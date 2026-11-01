import { defaultDesign } from "./templates";
import type { CareerProfile, CV, CvVersion, TemplateId } from "./types";
import { escapeHtml, nowISO, slugify, uid, wordCount } from "./utils";

export function newCv(
  profile: CareerProfile,
  options: {
    title?: string;
    template?: TemplateId;
    accent?: string;
    targetRole?: string;
    targetCompany?: string;
    jobDescription?: string;
  } = {},
): CV {
  const at = nowISO();
  const template = options.template ?? "modern";
  const design = defaultDesign(template);
  return {
    id: uid("cv"),
    title: options.title ?? "Untitled CV",
    targetRole: options.targetRole ?? profile.contact.headline ?? "",
    targetCompany: options.targetCompany ?? "",
    jobDescription: options.jobDescription ?? "",
    contact: { ...profile.contact },
    summary: profile.summary,
    experience: profile.experience.map((item) => ({ ...item, bullets: [...item.bullets] })),
    education: profile.education.map((item) => ({ ...item })),
    skills: profile.skills.map((group) => ({ ...group, items: [...group.items] })),
    projects: profile.projects.map((item) => ({
      ...item,
      bullets: [...item.bullets],
      tags: [...item.tags],
    })),
    certifications: profile.certifications.map((item) => ({ ...item })),
    languages: profile.languages.map((item) => ({ ...item })),
    achievements: [...profile.achievements],
    design: { ...design, accent: options.accent ?? design.accent },
    createdAt: at,
    updatedAt: at,
    versions: [],
  };
}

export function duplicateCv(cv: CV): CV {
  const at = nowISO();
  return {
    ...structuredClone(cv),
    id: uid("cv"),
    title: `${cv.title} (copy)`,
    createdAt: at,
    updatedAt: at,
    versions: [],
  };
}

/** Takes a snapshot for version history, keeping the same document fields. */
export function snapshotVersion(cv: CV, label: string): CvVersion {
  return {
    id: uid("ver"),
    at: nowISO(),
    label,
    document: stripCv(cv),
  };
}

export function stripCv(cv: CV) {
  return {
    title: cv.title,
    targetRole: cv.targetRole,
    targetCompany: cv.targetCompany,
    jobDescription: cv.jobDescription,
    contact: cv.contact,
    summary: cv.summary,
    experience: cv.experience,
    education: cv.education,
    skills: cv.skills,
    projects: cv.projects,
    certifications: cv.certifications,
    languages: cv.languages,
    achievements: cv.achievements,
    design: cv.design,
  };
}

export function applyVersion(cv: CV, version: CvVersion): CV {
  return {
    ...cv,
    ...structuredClone(version.document),
    id: cv.id,
    createdAt: cv.createdAt,
    versions: cv.versions,
    updatedAt: nowISO(),
  };
}

export function cvPlainText(cv: CV): string {
  const parts: string[] = [
    cv.contact.fullName,
    cv.contact.headline,
    [cv.contact.email, cv.contact.phone, cv.contact.location, cv.contact.website]
      .filter(Boolean)
      .join(" "),
    cv.summary,
  ];
  for (const role of cv.experience) {
    parts.push(`${role.role} ${role.company} ${role.location} ${role.start} ${role.end}`);
    parts.push(role.summary);
    parts.push(...role.bullets);
  }
  for (const group of cv.skills) parts.push(group.label, ...group.items);
  for (const project of cv.projects) {
    parts.push(project.name, project.summary, ...project.bullets, ...project.tags);
  }
  for (const education of cv.education) {
    parts.push(education.degree, education.school, education.detail);
  }
  for (const certification of cv.certifications) {
    parts.push(certification.name, certification.issuer, certification.year);
  }
  for (const language of cv.languages) parts.push(language.name, language.level);
  parts.push(...cv.achievements);
  return parts.filter(Boolean).join("\n");
}

export function cvWords(cv: CV): number {
  return wordCount(cvPlainText(cv));
}

export type Completeness = {
  pct: number;
  missing: string[];
};

export function cvCompleteness(cv: CV): Completeness {
  const checks: { label: string; ok: boolean }[] = [
    { label: "Full name", ok: Boolean(cv.contact.fullName.trim()) },
    { label: "Headline", ok: Boolean(cv.contact.headline.trim()) },
    { label: "Email", ok: Boolean(cv.contact.email.trim()) },
    { label: "Phone", ok: Boolean(cv.contact.phone.trim()) },
    { label: "Location", ok: Boolean(cv.contact.location.trim()) },
    {
      label: "Summary of 40 words or more",
      ok: wordCount(cv.summary) >= 40,
    },
    {
      label: "At least two roles",
      ok: cv.experience.filter((role) => role.role || role.company).length >= 2,
    },
    {
      label: "Two bullets per role",
      ok:
        cv.experience.length > 0 &&
        cv.experience.every((role) => role.bullets.filter(Boolean).length >= 2),
    },
    { label: "Education", ok: cv.education.some((entry) => entry.school || entry.degree) },
    { label: "Six or more skills", ok: skillCount(cv) >= 6 },
    { label: "A project or achievement", ok: cv.projects.length > 0 || cv.achievements.length > 0 },
    { label: "Target role", ok: Boolean(cv.targetRole.trim()) },
  ];
  const passed = checks.filter((check) => check.ok).length;
  return {
    pct: Math.round((passed / checks.length) * 100),
    missing: checks.filter((check) => !check.ok).map((check) => check.label),
  };
}

export function skillCount(cv: CV): number {
  return cv.skills.reduce((total, group) => total + group.items.filter(Boolean).length, 0);
}

export function cvFilename(cv: CV, extension: string): string {
  const name = slugify(cv.contact.fullName || cv.title || "cv") || "cv";
  const title = slugify(cv.title) || "resume";
  return `${name}-${title}.${extension}`;
}

/** A self contained HTML export, useful when someone wants the document itself. */
export function cvToHtmlDocument(cv: CV): string {
  const accent = cv.design.accent;
  const contactBits = [
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.contact.website,
    cv.contact.linkedin,
  ].filter(Boolean);

  const sectionTitle = (label: string) =>
    `<h2>${escapeHtml(label)}</h2>`;

  const experienceHtml = cv.experience
    .filter((role) => role.role || role.company)
    .map(
      (role) => `
      <article class="entry">
        <div class="entry-head">
          <div>
            <h3>${escapeHtml(role.role)}</h3>
            <p class="org">${escapeHtml([role.company, role.location].filter(Boolean).join(", "))}</p>
          </div>
          <p class="dates">${escapeHtml([role.start, role.end].filter(Boolean).join(" to "))}</p>
        </div>
        ${role.summary ? `<p class="summary">${escapeHtml(role.summary)}</p>` : ""}
        ${
          role.bullets.filter(Boolean).length
            ? `<ul>${role.bullets
                .filter(Boolean)
                .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                .join("")}</ul>`
            : ""
        }
      </article>`,
    )
    .join("");

  const educationHtml = cv.education
    .filter((item) => item.school || item.degree)
    .map(
      (item) => `
      <article class="entry compact">
        <div class="entry-head">
          <div>
            <h3>${escapeHtml(item.degree)}</h3>
            <p class="org">${escapeHtml([item.school, item.location].filter(Boolean).join(", "))}</p>
          </div>
          <p class="dates">${escapeHtml([item.start, item.end].filter(Boolean).join(" to "))}</p>
        </div>
        ${item.detail ? `<p class="summary">${escapeHtml(item.detail)}</p>` : ""}
      </article>`,
    )
    .join("");

  const skillsHtml = cv.skills
    .filter((group) => group.items.filter(Boolean).length)
    .map(
      (group) =>
        `<p class="skill-row"><span>${escapeHtml(group.label)}</span> ${escapeHtml(
          group.items.filter(Boolean).join(", "),
        )}</p>`,
    )
    .join("");

  const projectsHtml = cv.projects
    .filter((project) => project.name)
    .map(
      (project) => `
      <article class="entry compact">
        <div class="entry-head">
          <div>
            <h3>${escapeHtml(project.name)}${project.role ? `, ${escapeHtml(project.role)}` : ""}</h3>
            <p class="org">${escapeHtml(project.tags.join(", "))}</p>
          </div>
          <p class="dates">${escapeHtml(project.year)}</p>
        </div>
        ${project.summary ? `<p class="summary">${escapeHtml(project.summary)}</p>` : ""}
        ${
          project.bullets.filter(Boolean).length
            ? `<ul>${project.bullets
                .filter(Boolean)
                .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
                .join("")}</ul>`
            : ""
        }
      </article>`,
    )
    .join("");

  const certificationsHtml = cv.certifications
    .filter((item) => item.name)
    .map(
      (item) =>
        `<p class="skill-row"><span>${escapeHtml(item.year)}</span> ${escapeHtml(item.name)}${
          item.issuer ? `, ${escapeHtml(item.issuer)}` : ""
        }</p>`,
    )
    .join("");

  const languagesHtml = cv.languages
    .filter((item) => item.name)
    .map((item) => `${escapeHtml(item.name)} (${escapeHtml(item.level)})`)
    .join(", ");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(cv.contact.fullName)} ${escapeHtml(cv.title)}</title>
<style>
  :root { --accent: ${accent}; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #f4f2ec; font-family: Georgia, "Times New Roman", serif; color: #16150f; }
  .sheet { width: 210mm; min-height: 297mm; margin: 24px auto; background: #fff; padding: 18mm 18mm 20mm; box-shadow: 0 24px 60px -30px rgba(0,0,0,.35); }
  header { border-bottom: 2px solid var(--accent); padding-bottom: 12px; margin-bottom: 18px; }
  h1 { font-size: 32px; margin: 0 0 4px; letter-spacing: -.02em; }
  .headline { margin: 0 0 8px; color: var(--accent); font-size: 13px; text-transform: uppercase; letter-spacing: .18em; }
  .contact { margin: 0; font-size: 11px; color: #4b4a42; }
  .contact span + span::before { content: "  ·  "; color: #9a978a; }
  h2 { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--accent); margin: 20px 0 8px; border-bottom: 1px solid #e3e0d5; padding-bottom: 5px; }
  h3 { font-size: 13.5px; margin: 0; }
  .entry { margin-bottom: 12px; break-inside: avoid; }
  .entry.compact { margin-bottom: 9px; }
  .entry-head { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
  .org { margin: 2px 0 0; font-size: 11.5px; color: #55544b; font-style: italic; }
  .dates { margin: 0; font-size: 10.5px; color: #6e6c60; white-space: nowrap; }
  .summary { font-size: 11.5px; margin: 5px 0 4px; color: #35342d; }
  ul { margin: 4px 0 0; padding-left: 16px; }
  li { font-size: 11.5px; line-height: 1.5; margin-bottom: 3px; }
  .skill-row { font-size: 11.5px; margin: 0 0 5px; line-height: 1.5; }
  .skill-row span { color: var(--accent); font-weight: 700; }
  @media print { @page { size: A4; margin: 0; } body { background: #fff; } .sheet { box-shadow: none; margin: 0; } }
</style>
</head>
<body>
  <main class="sheet">
    <header>
      <h1>${escapeHtml(cv.contact.fullName)}</h1>
      <p class="headline">${escapeHtml(cv.contact.headline)}</p>
      <p class="contact">${contactBits.map((bit) => `<span>${escapeHtml(bit)}</span>`).join("")}</p>
    </header>
    ${cv.summary ? `${sectionTitle("Profile")}<p class="summary">${escapeHtml(cv.summary)}</p>` : ""}
    ${experienceHtml ? `${sectionTitle("Experience")}${experienceHtml}` : ""}
    ${projectsHtml ? `${sectionTitle("Selected projects")}${projectsHtml}` : ""}
    ${educationHtml ? `${sectionTitle("Education")}${educationHtml}` : ""}
    ${skillsHtml ? `${sectionTitle("Skills")}${skillsHtml}` : ""}
    ${certificationsHtml ? `${sectionTitle("Certifications")}${certificationsHtml}` : ""}
    ${languagesHtml ? `${sectionTitle("Languages")}<p class="summary">${languagesHtml}</p>` : ""}
    ${
      cv.achievements.filter(Boolean).length
        ? `${sectionTitle("Achievements")}<ul>${cv.achievements
            .filter(Boolean)
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}</ul>`
        : ""
    }
  </main>
</body>
</html>`;
}
