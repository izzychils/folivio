import type {
  AtsCheck,
  AtsReport,
  CV,
  CvDesign,
  Education,
  Experience,
  GapItem,
  MatchReport,
  SkillGroup,
} from "./types";
import { cvPlainText, skillCount } from "./cv";
import { linesOf, titleCase, wordCount } from "./utils";

/* ══════════════════════════════════════════════════════════════════════════
   This is the local career intelligence engine.

   It is deliberately honest: every rewrite only removes filler, swaps a weak
   verb for a stronger one, or reorders what the person already wrote. It never
   adds a company, a date, a metric or a skill that is not in the source text.
   When a real model is wired in later, these functions become the fallback and
   the validators.
   ══════════════════════════════════════════════════════════════════════════ */

const STOP_WORDS = new Set(
  `a an the and or but if then than that this these those for with from into onto over under about as at by to of in on is are was were be been being have has had do does did will would can could should may might must not no yes you your yours we our us they their them i my me he she it its who whom which what when where why how all any each few more most other some such only own same so too very just also via using use used across within towards toward per plus etc role roles job jobs work working team teams company companies candidate candidates applicant applicants looking hiring join help helps helping including include includes strong good great excellent ability able experience experienced years year new well people person someone our who youll were who that also we're flexible ideal preferred required requirements responsibilities responsibility you'll we'll`
    .split(/\s+/)
    .filter(Boolean),
);

const GENERIC_TERMS = new Set([
  "ability",
  "opportunity",
  "environment",
  "benefits",
  "salary",
  "apply",
  "application",
  "position",
  "successful",
  "relevant",
  "related",
  "similar",
  "various",
]);

export function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function extractKeywords(text: string, limit = 30): string[] {
  const words = normalize(text).match(/[a-z][a-z0-9+#./-]{2,}/g) ?? [];
  const counts = new Map<string, number>();

  const add = (term: string, amount: number) => {
    if (!term || STOP_WORDS.has(term) || GENERIC_TERMS.has(term)) return;
    counts.set(term, (counts.get(term) ?? 0) + amount);
  };

  words.forEach((word, index) => {
    if (word.length < 3) return;
    add(word, 1);
    const next = words[index + 1];
    if (next && next.length > 2 && !STOP_WORDS.has(next)) {
      add(`${word} ${next}`, 1.35);
    }
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .slice(0, limit)
    .map(([term]) => term);
}

function containsTerm(haystack: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, "i").test(haystack);
}

/* ── rewriting ──────────────────────────────────────────────────────────── */

const GERUND_TO_PAST: Record<string, string> = {
  managing: "Managed",
  leading: "Led",
  building: "Built",
  designing: "Designed",
  developing: "Developed",
  creating: "Created",
  writing: "Wrote",
  running: "Ran",
  making: "Made",
  doing: "Did",
  improving: "Improved",
  increasing: "Increased",
  reducing: "Reduced",
  launching: "Launched",
  supporting: "Supported",
  maintaining: "Maintained",
  analysing: "Analyzed",
  analyzing: "Analyzed",
  coordinating: "Coordinated",
  delivering: "Delivered",
  owning: "Owned",
  driving: "Drove",
  training: "Trained",
  teaching: "Taught",
  presenting: "Presented",
  testing: "Tested",
  researching: "Researched",
  mentoring: "Mentored",
  hiring: "Hired",
  organising: "Organized",
  organizing: "Organized",
  planning: "Planned",
  reviewing: "Reviewed",
  shipping: "Shipped",
  growing: "Grew",
  scaling: "Scaled",
  transforming: "Transformed",
};

const BASE_TO_PAST: Record<string, string> = {
  manage: "Managed",
  lead: "Led",
  build: "Built",
  design: "Designed",
  develop: "Developed",
  create: "Created",
  write: "Wrote",
  run: "Ran",
  make: "Made",
  improve: "Improved",
  increase: "Increased",
  reduce: "Reduced",
  launch: "Launched",
  support: "Supported",
  maintain: "Maintained",
  analyse: "Analyzed",
  analyze: "Analyzed",
  coordinate: "Coordinated",
  deliver: "Delivered",
  own: "Owned",
  drive: "Drove",
  train: "Trained",
  teach: "Taught",
  present: "Presented",
  test: "Tested",
  research: "Researched",
  mentor: "Mentored",
  hire: "Hired",
  organise: "Organized",
  organize: "Organized",
  plan: "Planned",
  review: "Reviewed",
  ship: "Shipped",
  grow: "Grew",
  scale: "Scaled",
  transform: "Transformed",
  negotiate: "Negotiated",
  forecast: "Forecasted",
  automate: "Automated",
  document: "Documented",
  migrate: "Migrated",
  rebuild: "Rebuilt",
  audit: "Audited",
  onboard: "Onboarded",
};

const WEAK_PHRASES: [RegExp, string][] = [
  [/^i\s+(?:was|am)\s+responsible\s+for\s+/i, "Owned "],
  [/^(?:was|am)\s+responsible\s+for\s+/i, "Owned "],
  [/^responsible\s+for\s+/i, "Owned "],
  [/^i\s+helped\s+(?:to|with)\s+/i, "Partnered on "],
  [/^helped\s+(?:to|with)\s+/i, "Partnered on "],
  [/^i\s+helped\s+/i, "Supported "],
  [/^i\s+worked\s+on\s+/i, "Delivered "],
  [/^worked\s+on\s+/i, "Delivered "],
  [/^i\s+was\s+involved\s+in\s+/i, "Contributed to "],
  [/^involved\s+in\s+/i, "Contributed to "],
  [/^i\s+took\s+part\s+in\s+/i, "Contributed to "],
  [/^took\s+part\s+in\s+/i, "Contributed to "],
  [/^i\s+was\s+in\s+charge\s+of\s+/i, "Led "],
  [/^in\s+charge\s+of\s+/i, "Led "],
  [/^i\s+assisted\s+(?:with|in)\s+/i, "Supported "],
  [/^assisted\s+(?:with|in)\s+/i, "Supported "],
  [/^i\s+/i, ""],
  [/^my\s+/i, ""],
  [/^we\s+/i, ""],
  [/^i've\s+/i, ""],
];

const FILLER = [
  /\bvery\b/gi,
  /\breally\b/gi,
  /\bquite\b/gi,
  /\bbasically\b/gi,
  /\bactually\b/gi,
  /\bjust\b/gi,
  /\bsuccessfully\b/gi,
  /\beffectively\b/gi,
  /\bin order to\b/gi,
];

function toStrongVerb(sentence: string): string {
  const match = sentence.match(/^([a-z]+)(\s+[\s\S]*)?$/i);
  if (!match) return sentence;
  const first = match[1];
  const rest = match[2] ?? "";
  const past = BASE_TO_PAST[first.toLowerCase()];
  if (past) return `${past}${rest}`;
  const gerund = GERUND_TO_PAST[first.toLowerCase()];
  if (gerund) return `${gerund}${rest}`;
  return sentence;
}

function tidy(sentence: string): string {
  return sentence
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .replace(/:?;$/g, "")
    .trim()
    .replace(/^[a-z]/, (char) => char.toUpperCase())
    .replace(/\.$/, "");
}

/** Returns three rewordings that only use what the person actually wrote. */
export function rewriteBullet(raw: string): { label: string; text: string }[] {
  let working = raw.replace(/^[\s•\-*\u2022\u2013\u2014]+/, "").trim();
  if (!working) return [];

  for (const [pattern, replacement] of WEAK_PHRASES) {
    if (pattern.test(working)) {
      working = working.replace(pattern, replacement);
      break;
    }
  }

  working = working
    .replace(/^(managed|led|owns?)\s+the\s+day[-\s]to[-\s]day\s+/i, "Ran ")
    .replace(/\bwas tasked with\b/gi, "Owned")
    .replace(/\bresponsible for\b/gi, "owned");

  const tightened = tidy(toStrongVerb(tidy(working)));

  const formal = tidy(
    working
      .replace(/\bdidn't\b/gi, "did not")
      .replace(/\bcan't\b/gi, "cannot")
      .replace(/\bwon't\b/gi, "will not")
      .replace(/\bit's\b/gi, "it is")
      .replace(/\bI'm\b/g, "I am")
      .replace(/\ba lot of\b/gi, "a substantial volume of"),
  );

  const concise = tidy(
    FILLER.reduce((text, pattern) => text.replace(pattern, ""), working).replace(/\s+/g, " "),
  );

  const candidates = [
    { label: "Tightened", text: tightened },
    { label: "Formal", text: formal },
    { label: "Concise", text: concise },
  ].filter((item) => item.text.length > 3);

  const seen = new Set<string>();
  return candidates.filter((item) => {
    const key = normalize(item.text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ── job matching ───────────────────────────────────────────────────────── */

export function keywordSetFor(cv: CV): string[] {
  const source = cv.jobDescription.trim() || `${cv.targetRole} ${cv.title}`;
  return extractKeywords(source, 28);
}

export function matchJob(cv: CV, jobDescription: string): MatchReport {
  const text = normalize(cvPlainText(cv));
  const source = jobDescription.trim() || `${cv.targetRole} ${cv.title}`;
  const terms = extractKeywords(source, 32);

  const matched: string[] = [];
  const missing: string[] = [];
  for (const term of terms) {
    if (containsTerm(text, term)) matched.push(term);
    else missing.push(term);
  }

  const coverage = terms.length ? matched.length / terms.length : 0;
  const skills = skillCount(cv);
  const score = Math.round(Math.min(100, coverage * 88 + Math.min(12, skills / 2)));

  return {
    score,
    matched,
    missing: missing.slice(0, 14),
    emphasis: matched.slice(0, 6),
    stats: { required: terms.length, covered: matched.length },
  };
}

/* ── ATS report ─────────────────────────────────────────────────────────── */

function statusFor(condition: boolean, warning: boolean): "pass" | "warn" | "fail" {
  if (condition) return "pass";
  return warning ? "warn" : "fail";
}

export function atsReport(cv: CV): AtsReport {
  const bullets = cv.experience.flatMap((role) => role.bullets.filter(Boolean));
  const quantified = bullets.filter((bullet) => /\d/.test(bullet)).length;
  const words = cvWordsSafe(cv);
  const roles = cv.experience.filter((role) => role.role || role.company).length;
  const skills = skillCount(cv);
  const keywordTerms = keywordSetFor(cv);
  const plain = normalize(cvPlainText(cv));
  const keywordHits = keywordTerms.filter((term) => containsTerm(plain, term));
  const coverage = keywordTerms.length ? keywordHits.length / keywordTerms.length : 0;

  const duplicate = new Set<string>();
  let duplicates = 0;
  for (const bullet of bullets) {
    const key = normalize(bullet);
    if (duplicate.has(key)) duplicates += 1;
    duplicate.add(key);
  }

  const hasContact = Boolean(cv.contact.email.trim() && cv.contact.phone.trim());
  const hasSummary = wordCount(cv.summary) >= 40;
  const hasEducation = cv.education.some((item) => item.school || item.degree);
  const datesOk =
    cv.experience.length > 0 &&
    cv.experience.every((role) => Boolean(role.start.trim() && role.end.trim()));
  const actionVerbs = bullets.filter((bullet) => /^[A-Z][a-z]+ed\b|^Led\b|^Built\b|^Wrote\b|^Ran\b|^Drove\b|^Made\b|^Grew\b/.test(bullet.trim())).length;
  const verbRatio = bullets.length ? actionVerbs / bullets.length : 0;
  const longBullets = bullets.filter((bullet) => wordCount(bullet) > 32).length;

  const checks: AtsCheck[] = [
    {
      id: "contact",
      label: "Contact details",
      status: hasContact ? "pass" : cv.contact.email.trim() ? "warn" : "fail",
      detail: hasContact
        ? "Email and phone are both present."
        : "Applicant tracking systems expect an email and a phone number in the header.",
      weight: 6,
    },
    {
      id: "summary",
      label: "Professional summary",
      status: statusFor(hasSummary, wordCount(cv.summary) > 0),
      detail: hasSummary
        ? `${wordCount(cv.summary)} words in the summary.`
        : "Aim for 40 to 90 words that say what you do and the value you bring.",
      weight: 8,
    },
    {
      id: "roles",
      label: "Work history",
      status: statusFor(roles >= 2, roles === 1),
      detail:
        roles >= 2
          ? `${roles} roles listed with titles and employers.`
          : "Add at least two roles so a recruiter can see progression.",
      weight: 12,
    },
    {
      id: "bullets",
      label: "Achievements under each role",
      status: statusFor(
        cv.experience.length > 0 && cv.experience.every((role) => role.bullets.filter(Boolean).length >= 2),
        bullets.length >= 3,
      ),
      detail:
        bullets.length >= 4
          ? `${bullets.length} achievement statements across your roles.`
          : "Two or more bullets per role gives a parser enough to work with.",
      weight: 8,
    },
    {
      id: "metrics",
      label: "Measurable outcomes",
      status: statusFor(quantified >= 3, quantified >= 1),
      detail:
        quantified >= 3
          ? `${quantified} bullets include a number, percentage or scale.`
          : "Add numbers where you know them: time saved, volume handled, percentage moved.",
      weight: 12,
    },
    {
      id: "skills",
      label: "Skills section",
      status: statusFor(skills >= 6, skills >= 3),
      detail:
        skills >= 6
          ? `${skills} skills listed and grouped.`
          : "List at least six tools or competencies, grouped by kind.",
      weight: 8,
    },
    {
      id: "education",
      label: "Education",
      status: statusFor(hasEducation, false),
      detail: hasEducation ? "Education is present." : "Add your highest qualification or training.",
      weight: 6,
    },
    {
      id: "dates",
      label: "Complete date ranges",
      status: statusFor(datesOk, cv.experience.length > 0),
      detail: datesOk
        ? "Every role has a start and end label."
        : "Give each role a start and an end, using Present for a current role.",
      weight: 6,
    },
    {
      id: "duplicates",
      label: "No duplicated statements",
      status: statusFor(duplicates === 0, duplicates === 1),
      detail:
        duplicates === 0
          ? "No repeated achievement statements."
          : `${duplicates} bullets appear more than once.`,
      weight: 6,
    },
    {
      id: "keywords",
      label: cv.jobDescription.trim() ? "Job description keywords" : "Role keywords",
      status: statusFor(coverage >= 0.55, coverage >= 0.3),
      detail: cv.jobDescription.trim()
        ? `${keywordHits.length} of ${keywordTerms.length} job description terms appear in the document.`
        : `${keywordHits.length} of ${keywordTerms.length} terms for this target role appear in the document.`,
      weight: 14,
    },
    {
      id: "length",
      label: "Length and scannability",
      status: statusFor(words >= 260 && words <= 900 && longBullets <= 2, words > 0),
      detail:
        words === 0
          ? "The document is empty."
          : `${words} words, ${bullets.length} bullets, ${longBullets} longer than 32 words.`,
      weight: 8,
    },
    {
      id: "verbs",
      label: "Action verbs",
      status: statusFor(verbRatio >= 0.6, verbRatio >= 0.3),
      detail:
        bullets.length === 0
          ? "No achievement statements yet."
          : `${Math.round(verbRatio * 100)}% of bullets open with an action verb.`,
      weight: 6,
    },
  ];

  const earned = checks.reduce((total, check) => {
    const factor = check.status === "pass" ? 1 : check.status === "warn" ? 0.5 : 0;
    return total + check.weight * factor;
  }, 0);
  const score = Math.round((earned / 100) * 100);

  return {
    score,
    grade: score >= 85 ? "Excellent" : score >= 70 ? "Strong" : score >= 55 ? "Fair" : "Needs work",
    checks,
    keywords: keywordTerms.map((term) => ({ term, matched: worseMatch(plain, term) })),
    stats: {
      words,
      bullets: bullets.length,
      quantified,
      roles,
      skills,
    },
  };
}

function worseMatch(text: string, term: string) {
  return containsTerm(text, term);
}

function cvWordsSafe(cv: CV): number {
  return wordCount(cvPlainText(cv));
}

/* ── gap analysis ───────────────────────────────────────────────────────── */

export function gapAnalysis(cv: CV, jobDescription: string): GapItem[] {
  const report = atsReport(cv);
  const match = matchJob(cv, jobDescription);
  const items: GapItem[] = [];

  for (const check of report.checks) {
    if (check.status === "pass") continue;
    items.push({
      title: check.label,
      detail: check.detail,
      severity: check.status === "fail" ? "high" : "medium",
    });
  }

  if (match.missing.length) {
    items.unshift({
      title: "Terms the role asks for that your CV does not mention",
      detail: match.missing
        .slice(0, 8)
        .map((term) => titleCase(term))
        .join(", "),
      severity: "high",
    });
  }

  if (cv.experience.some((role) => role.summary && role.summary.split(" ").length > 40)) {
    items.push({
      title: "Role summaries are carrying too much",
      detail: "Move detail into bullets so a six second scan still finds the outcome.",
      severity: "low",
    });
  }

  if (cv.projects.length === 0 && cv.experience.length < 3) {
    items.push({
      title: "No projects to show",
      detail: "One or two projects can carry a short career history, especially for a career change.",
      severity: "medium",
    });
  }

  return items.slice(0, 8);
}

/* ── drafting ───────────────────────────────────────────────────────────── */

function topQuantifiedBullet(cv: CV): string | null {
  const bullets = cv.experience.flatMap((role) => role.bullets.filter(Boolean));
  const withNumbers = bullets.filter((bullet) => /\d/.test(bullet));
  return (withNumbers[0] ?? bullets[0] ?? null) as string | null;
}

function yearsFor(cv: CV): number {
  const years = cv.experience
    .map((role) => role.start.match(/(19|20)\d{2}/)?.[0])
    .filter(Boolean)
    .map(Number);
  if (!years.length) return 0;
  const earliest = Math.min(...years);
  return Math.max(1, new Date().getFullYear() - earliest);
}

function companyList(cv: CV): string {
  const names = cv.experience.map((role) => role.company).filter(Boolean);
  if (!names.length) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names[2]}`;
}

export function draftSummary(cv: CV): string {
  const headline = cv.contact.headline || cv.targetRole || "Professional";
  const years = yearsFor(cv);
  const companies = companyList(cv);
  const skills = cv.skills.flatMap((group) => group.items).filter(Boolean).slice(0, 3);
  const achievement = topQuantifiedBullet(cv);

  const opening = years
    ? `${headline} with ${years} years of experience${companies ? ` across ${companies}` : ""}.`
    : `${headline} focused on work that holds up after launch.`;

  const proof = achievement
    ? ` ${achievement.replace(/\.$/, "")}.`
    : "";

  const focus = skills.length
    ? ` Works in ${skills.slice(0, 2).join(" and ")}${
        skills[2] ? `, with ${skills[2].toLowerCase()} close at hand` : ""
      }.`
    : "";

  return `${opening}${proof}${focus}`.replace(/\s+/g, " ").trim();
}

export function draftBio(cv: CV): string {
  const name = cv.contact.fullName || "This professional";
  const headline = cv.contact.headline || cv.targetRole || "practitioner";
  const years = yearsFor(cv);
  const skills = cv.skills.flatMap((group) => group.items).filter(Boolean);
  const achievement = topQuantifiedBullet(cv);
  const project = cv.projects[0]?.name;

  const first = `${name} is a ${headline.toLowerCase()} with ${
    years ? `${years} years of practice` : "a record of careful work"
  }${cv.contact.location ? `, based in ${cv.contact.location}` : ""}.`;

  const second = achievement
    ? `Their work has been measured, not just shipped: ${achievement
        .replace(/\.$/, "")
        .replace(/^[A-Z]/, (char) => char.toLowerCase())}.`
    : "They are known for turning a vague brief into a clear plan.";

  const third = skills.length
    ? `The toolkit runs through ${skills.slice(0, 4).join(", ")}${
        project ? `, and ${project} is the cleanest example of how it comes together` : ""
      }.`
    : "";

  return `${first} ${second} ${third}`.replace(/\s+/g, " ").trim();
}

export function draftLinkedIn(cv: CV): string {
  const headline = cv.contact.headline || cv.targetRole || "Professional";
  const skills = cv.skills.flatMap((group) => group.items).filter(Boolean).slice(0, 5);
  const achievement = topQuantifiedBullet(cv);

  return [
    `${headline}. ${cv.summary || draftSummary(cv)}`,
    achievement ? achievement.replace(/\.$/, "") + "." : "",
    skills.length ? `Working with ${skills.join(", ")}.` : "",
    cv.contact.location ? `Based in ${cv.contact.location}. Open to conversations about work worth doing.` : "Open to conversations about work worth doing.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function draftCoverLetter(input: {
  cv: CV;
  jobDescription: string;
  company: string;
  role: string;
}): string {
  const { cv } = input;
  const match = matchJob(cv, input.jobDescription);
  const bullets = cv.experience.flatMap((role) => role.bullets.filter(Boolean));
  const relevant =
    bullets.find((bullet) =>
      match.matched.some((term) => containsTerm(normalize(bullet), term)),
    ) ?? bullets[0];
  const second = bullets.find((bullet) => bullet !== relevant && /\d/.test(bullet)) ?? bullets[1];

  const company = input.company.trim();
  const role = input.role.trim() || cv.targetRole || "the role";
  const skills = cv.skills
    .flatMap((group) => group.items)
    .filter((skill) => match.matched.some((term) => normalize(skill).includes(term)))
    .slice(0, 3);
  const fallbackSkills = cv.skills.flatMap((group) => group.items).slice(0, 3);
  const focus = (skills.length ? skills : fallbackSkills).filter(Boolean);

  const greeting = company ? `Dear ${company} hiring team,` : "Dear Hiring Team,";

  const opening = `I am applying for the ${role} role. ${
    cv.contact.headline ? `I work as a ${cv.contact.headline.toLowerCase()}` : "I work in this field"
  }${cv.experience[0]?.company ? `, most recently at ${cv.experience[0].company}` : ""}. What I want next is a team where the work is judged by what it changes for the people using it.`;

  const bodyOne = relevant
    ? `The clearest example I can offer is this: ${relevant
        .replace(/\.$/, "")
        .replace(/^[A-Z]/, (char) => char.toLowerCase())}. That is the kind of problem I want more of.`
    : "";

  const bodyTwo = second
    ? `I would also point to another piece of the record: ${second
        .replace(/\.$/, "")
        .replace(/^[A-Z]/, (char) => char.toLowerCase())}.`
    : "";

  const bodyThree = focus.length
    ? `Day to day that means ${focus.join(", ")}. I care about the handoff as much as the concept, so the shipped thing still looks like the decision that was made.`
    : "";

  const closing = company
    ? `I would welcome a conversation about what ${company} is building and where this role fits into it. Thank you for your time.`
    : "I would welcome a conversation about the role and where the work is heading. Thank you for your time.";

  return [
    greeting,
    "",
    opening,
    bodyOne,
    bodyTwo,
    bodyThree,
    closing,
    "",
    "Kind regards,",
    cv.contact.fullName || "Your name",
  ]
    .filter((line) => line !== "")
    .join("\n\n");
}

export function draftPersonalStatement(cv: CV): string {
  const name = cv.contact.fullName || "I";
  const headline = cv.contact.headline || cv.targetRole || "practitioner";
  const education = cv.education[0];
  const skills = cv.skills.flatMap((group) => group.items).filter(Boolean).slice(0, 4);
  const project = cv.projects[0];
  const achievement = topQuantifiedBullet(cv);

  return [
    `My name is ${name} and I am applying as a ${headline.toLowerCase()}.`,
    cv.summary || draftSummary(cv),
    education
      ? `I studied ${education.degree} at ${education.school}${
          education.detail ? `. ${education.detail}` : ""
        }`
      : "",
    achievement
      ? `The work I am proudest of is concrete: ${achievement
          .replace(/\.$/, "")
          .replace(/^[A-Z]/, (char) => char.toLowerCase())}.`
      : "",
    project
      ? `${project.name} is the project that best shows how I think. ${project.summary}`
      : "",
    skills.length ? `I work with ${skills.join(", ")}.` : "",
    "I am looking for a place where the standard is high, the feedback is direct, and the work has a clear user on the other side of it.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/* ── career paths and interview prep ────────────────────────────────────── */

type Cluster = {
  title: string;
  cues: string[];
  roles: string[];
  bridge: string[];
};

const CLUSTERS: Cluster[] = [
  {
    title: "Product design",
    cues: ["design", "figma", "prototyping", "research", "usability", "accessibility", "interaction"],
    roles: ["Staff Product Designer", "Design Systems Lead", "Design Manager", "Design Engineer"],
    bridge: ["Design leadership", "Design ops", "Frontend fundamentals"],
  },
  {
    title: "Engineering",
    cues: ["react", "typescript", "javascript", "api", "next", "css", "testing", "node"],
    roles: ["Senior Frontend Engineer", "Design Engineer", "Platform Lead", "Product Engineer"],
    bridge: ["System design", "Performance engineering", "Technical writing"],
  },
  {
    title: "Data and analytics",
    cues: ["sql", "python", "analytics", "dashboards", "experimentation", "metrics", "data"],
    roles: ["Analytics Engineer", "Product Analyst", "Data Product Manager", "Insights Lead"],
    bridge: ["Experimentation design", "Data modelling", "Storytelling with data"],
  },
  {
    title: "Product management",
    cues: ["roadmap", "discovery", "stakeholders", "strategy", "metrics", "prioritisation"],
    roles: ["Product Manager", "Group Product Manager", "Product Lead", "Principal PM"],
    bridge: ["Pricing", "Discovery at scale", "Commercial modelling"],
  },
  {
    title: "Brand and content",
    cues: ["brand", "content", "copywriting", "seo", "campaign", "editorial", "social"],
    roles: ["Brand Strategist", "Content Lead", "Growth Marketing Manager", "Editorial Director"],
    bridge: ["Performance marketing", "Brand measurement", "Channel strategy"],
  },
  {
    title: "People and operations",
    cues: ["hiring", "onboarding", "operations", "process", "programme", "program", "training"],
    roles: ["People Operations Lead", "Programme Manager", "Business Operations Manager", "Chief of Staff"],
    bridge: ["Workforce planning", "Change management", "Commercial fluency"],
  },
];

export function careerPaths(cv: CV): { title: string; why: string; bridge: string[] }[] {
  const skillText = normalize(
    [...cv.skills.flatMap((group) => group.items), cv.contact.headline, cv.targetRole].join(" "),
  );
  const scored = CLUSTERS.map((cluster) => {
    const hits = cluster.cues.filter((cue) => containsTerm(skillText, cue));
    return { cluster, hits };
  })
    .sort((a, b) => b.hits.length - a.hits.length)
    .slice(0, 3);

  return scored.map(({ cluster, hits }) => ({
    title: cluster.roles[0],
    why: hits.length
      ? `Your profile already signals ${hits.slice(0, 3).join(", ")}.`
      : "A nearby move that reuses the judgement you already apply.",
    bridge: cluster.bridge.slice(0, 3),
  }));
}

const QUESTION_BANK = [
  "Walk me through a piece of work you are proud of, and what you would do differently now.",
  "Tell me about a time you disagreed with someone senior. How did it end?",
  "Describe a project that failed. What did you learn that changed your next one?",
  "How do you decide what not to build?",
  "Tell me about a time you had to ship with incomplete information.",
  "How do you measure whether your work succeeded, six months later?",
  "Describe how you give feedback to a peer whose work is not landing.",
  "What is the most useful piece of criticism you have received?",
];

export function interviewQuestions(cv: CV): { question: string; why: string }[] {
  const role = cv.targetRole || cv.contact.headline || "the role";
  const skills = cv.skills.flatMap((group) => group.items).filter(Boolean);
  const bullets = cv.experience.flatMap((item) => item.bullets).filter(Boolean);

  const skillQuestions = skills.slice(0, 4).map((skill) => ({
    question: `Tell me how you have used ${skill.toLowerCase()} in production, and what you would not use it for.`,
    why: `${skill} appears in your CV. Expect at least one question that tests depth, not vocabulary.`,
  }));

  const roleQuestions = [
    {
      question: `What does good look like for a ${role.toLowerCase()} in their first 90 days?`,
      why: "Hiring managers use this to test whether you understand the job, not just the title.",
    },
    {
      question: `Which part of your record best proves you can do this ${role.toLowerCase()} work?`,
      why: "Have one achievement ready that maps directly to the job description.",
    },
  ];

  const bank = QUESTION_BANK.slice(0, 4).map((question, index) => ({
    question,
    why: bullets[index]
      ? `Answer with the achievement you already wrote: ${bullets[index].slice(0, 90)}${bullets[index].length > 90 ? "..." : ""}`
      : "Prepare a specific example. Generality is what interviewers remember least.",
  }));

  return [...roleQuestions, ...skillQuestions, ...bank];
}

/* ── design recommendations ─────────────────────────────────────────────── */

export function suggestDesign(role: string): {
  design: Partial<CvDesign>;
  rationale: string;
} {
  const text = normalize(role);
  if (/engineer|developer|data|analyst|security|devops|architect|technical/.test(text)) {
    return {
      design: { template: "technical", accent: "#1D5C45", font: "technical", density: "compact" },
      rationale: "Technical hiring reads for signal density: mono section markers, tight spacing, a skills matrix first.",
    };
  }
  if (/design|creative|brand|content|film|art|writer/.test(text)) {
    return {
      design: { template: "creative", accent: "#A9502A", font: "grotesque", density: "airy" },
      rationale: "Portfolio led roles get a tinted sidebar and project cards, so the work appears before the chronology.",
    };
  }
  if (/director|head|chief|vp|executive|lead|manager|principal/.test(text)) {
    return {
      design: { template: "executive", accent: "#1E3A5F", font: "editorial", density: "balanced" },
      rationale: "Leadership readers want scope and outcomes fast: a masthead, a narrative, then the numbers.",
    };
  }
  if (/research|academic|professor|lecturer|phd|scholar|scientist/.test(text)) {
    return {
      design: { template: "academic", accent: "#14140F", font: "editorial", density: "compact" },
      rationale: "Academic review rewards a single dense column with clear chronological structure.",
    };
  }
  return {
    design: { template: "modern", accent: "#1D5C45", font: "grotesque", density: "balanced" },
    rationale: "A two column layout gives a recruiter contact and skills at a glance, then the proof.",
  };
}

/* ── importing an existing document ─────────────────────────────────────── */

const SECTION_ALIASES: Record<string, string> = {
  summary: "summary",
  profile: "summary",
  about: "summary",
  "professional summary": "summary",
  objective: "summary",
  experience: "experience",
  "work experience": "experience",
  employment: "experience",
  "employment history": "experience",
  education: "education",
  qualifications: "education",
  skills: "skills",
  "core skills": "skills",
  "technical skills": "skills",
  tools: "skills",
  projects: "projects",
  "selected projects": "projects",
  certifications: "certifications",
  certificates: "certifications",
  languages: "languages",
  awards: "achievements",
  achievements: "achievements",
};

export type ParsedProfile = {
  contact: { fullName: string; email: string; phone: string; linkedin: string; website: string; location: string };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: string[];
  lines: number;
};

function sectionOf(line: string): string | null {
  const clean = normalize(line.replace(/[:•|]+$/g, ""));
  if (clean.length > 34) return null;
  return SECTION_ALIASES[clean] ?? null;
}

export function parseResumeText(raw: string): ParsedProfile {
  const lines = raw.split(/\r?\n/).map((line) => line.trim());
  const email = raw.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] ?? "";
  const phone = raw.match(/(\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ?? "";
  const linkedin = raw.match(/(?:linkedin\.com\/in\/[\w-]+)/i)?.[0] ?? "";
  const websiteMatch = raw.match(/(?:https?:\/\/)?((?:www\.)?[\w-]+\.(?:com|net|org|io|dev|design|site|me|co)(?:\/[\w\-./]*)?)/i)?.[1];
  const website = websiteMatch && !websiteMatch.includes("@") ? websiteMatch : "";

  const headerLine = lines.find(
    (line) =>
      line &&
      !line.includes("@") &&
      !/\d{4}/.test(line) &&
      line.split(/\s+/).length <= 5 &&
      /^[A-Za-z][A-Za-z'.\-]+(?:\s+[A-Za-z'.\-]+)+$/.test(line),
  );

  const buckets = new Map<string, string[]>();
  let current = "header";
  buckets.set(current, []);

  for (const line of lines) {
    if (!line) continue;
    const section = sectionOf(line);
    if (section) {
      current = section;
      if (!buckets.has(current)) buckets.set(current, []);
      continue;
    }
    if (line === headerLine) continue;
    buckets.get(current)?.push(line);
  }

  const summary = (buckets.get("summary") ?? [])
    .filter((line) => !line.includes("@"))
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 800);

  const experienceLines = buckets.get("experience") ?? [];
  const experience: Experience[] = [];
  for (const line of experienceLines) {
    const dateMatch = line.match(
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b(?:19|20)\d{2})\s*(?:[-\u2013\u2014]|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\b(?:19|20)\d{2}|Present|Current)/i,
    );
    const isBullet = /^[•\-*\u2022]/.test(line);
    if (!isBullet && (dateMatch || (!experience.length && line.length < 90))) {
      const withoutDates = line
        .replace(dateMatch?.[0] ?? "", "")
        .replace(/[|,\u2013\u2014]\s*$/, "")
        .trim();
      const parts = withoutDates.split(/\s+(?:at|@)\s+|\s*[|,]\s*/i).filter(Boolean);
      const existing = experience[experience.length - 1];
      if (!dateMatch && existing && !existing.role && parts.length) {
        existing.role = parts[0];
        existing.company = parts[1] ?? "";
        continue;
      }
      experience.push({
        id: `exp_import_${experience.length}`,
        role: parts[0] ?? withoutDates,
        company: parts[1] ?? "",
        location: parts[3] ?? "",
        start: dateMatch?.[1]?.trim() ?? "",
        end: dateMatch?.[2]?.trim() ?? "",
        summary: "",
        bullets: [],
      });
      continue;
    }
    const last = experience[experience.length - 1];
    if (last) {
      const bullet = line.replace(/^[•\-*\u2022]\s*/, "");
      if (bullet.length > 20) last.bullets.push(bullet);
    }
  }

  const educationLines = buckets.get("education") ?? [];
  const education: Education[] = [];
  for (const line of educationLines) {
    if (/degree|bachelor|master|bsc|msc|mba|phd|diploma|university|college|institute|school/i.test(line)) {
      const years = line.match(/\b(19|20)\d{2}\b/g);
      const parts = line.split(/\s*[|,]\s*/).filter(Boolean);
      education.push({
        id: `edu_import_${education.length}`,
        degree: parts[0] ?? "",
        school: parts[1] ?? "",
        location: parts[2] ?? "",
        start: years?.[0] ?? "",
        end: years?.[1] ?? "",
        detail: "",
      });
    }
  }

  const skillLines = buckets.get("skills") ?? [];
  const skills = skillLines.length
    ? [
        {
          id: "skl_import",
          label: "Skills",
          items: skillLines
            .join(", ")
            .split(/[,;|•]/)
            .map((item) => item.trim())
            .filter((item) => item.length > 1 && item.length < 40)
            .slice(0, 24),
        },
      ]
    : [];

  return {
    contact: {
      fullName: headerLine ?? "",
      email,
      phone,
      linkedin,
      website,
      location: "",
    },
    summary,
    experience,
    education,
    skills,
    projects: buckets.get("projects") ?? [],
    lines: lines.filter(Boolean).length,
  };
}

/* ── guided profile builder ─────────────────────────────────────────────── */

export type ProfileDraft = {
  role: string;
  company: string;
  achievement: string;
  skills: string[];
  targetRole: string;
  summary: string;
};

export const emptyDraft = (): ProfileDraft => ({
  role: "",
  company: "",
  achievement: "",
  skills: [],
  targetRole: "",
  summary: "",
});

export const ASSISTANT_OPENING =
  "Let us build the raw material first. What is the role you hold now, and where do you do it? A short answer is fine, something like Senior Product Designer at Meridian Health.";

export function assistantStep(
  step: number,
  answer: string,
  draft: ProfileDraft,
): {
  reply: string;
  draft: ProfileDraft;
  nextStep: number;
  done: boolean;
  suggestions: string[];
  extracted: boolean;
} {
  const clean = answer.trim();
  const next: ProfileDraft = { ...draft };

  if (step === 0) {
    const parts = clean.split(/\s+(?:at|@)\s+|\s*,\s*/i).map((part) => part.trim()).filter(Boolean);
    next.role = parts[0] ? titleCase(parts[0]) : clean;
    next.company = parts[1] ?? "";
    return {
      reply: next.company
        ? `Good. ${next.role} at ${next.company}. Now the proof: what is one thing you built, changed or improved there? Plain language is fine, and add a number if you have one.`
        : `Noted: ${next.role}. Which organisation is that with, and what is one thing you built or improved there?`,
      draft: next,
      nextStep: 1,
      done: false,
      suggestions: [],
      extracted: Boolean(next.role),
    };
  }

  if (step === 1) {
    next.achievement = clean;
    return {
      reply:
        "That is the material that matters. Which skills do you actually use week to week? List them as you would say them out loud.",
      draft: next,
      nextStep: 2,
      done: false,
      suggestions: ["Figma, research, design systems", "React, TypeScript, testing", "SQL, dashboards, experimentation"],
      extracted: clean.length > 8,
    };
  }

  if (step === 2) {
    next.skills = clean
      .split(/,| and |;|\n/)
      .map((item) => item.trim())
      .filter((item) => item.length > 1)
      .slice(0, 12);
    return {
      reply: "Last one: what role are you aiming for next? This sets the language of the documents, not the facts.",
      draft: next,
      nextStep: 3,
      done: false,
      suggestions: ["Senior Product Designer", "Design Systems Lead", "Product Manager"],
      extracted: next.skills.length > 0,
    };
  }

  next.targetRole = clean;
  next.summary = buildDraftSummary(next);
  return {
    reply:
      "That is enough to make a real start. I have kept every fact exactly as you gave it. Review the draft, then add it to your profile and I will build a CV from it.",
    draft: next,
    nextStep: 4,
    done: true,
    suggestions: [],
    extracted: true,
  };
}

export function buildDraftSummary(draft: ProfileDraft): string {
  const role = draft.role || "Professional";
  const company = draft.company ? ` at ${draft.company}` : "";
  const achievement = draft.achievement
    ? ` ${draft.achievement.replace(/\.$/, "")}.`
    : "";
  const skills = draft.skills.length
    ? ` Works with ${draft.skills.slice(0, 4).join(", ")}.`
    : "";
  const target = draft.targetRole ? ` Moving toward ${draft.targetRole.toLowerCase()} work.` : "";
  return `${role}${company}.${achievement}${skills}${target}`.replace(/\s+/g, " ").trim();
}

export function draftFromProfile(input: {
  fullName: string;
  role: string;
  company: string;
  achievement: string;
  skills: string[];
  targetRole: string;
}): ProfileDraft {
  const draft: ProfileDraft = {
    role: input.role,
    company: input.company,
    achievement: input.achievement,
    skills: input.skills,
    targetRole: input.targetRole,
    summary: "",
  };
  draft.summary = buildDraftSummary(draft);
  return draft;
}

/* small helper used by the editor's quality panel */
export function qualityNotes(cv: CV): { tone: "good" | "note"; text: string }[] {
  const notes: { tone: "good" | "note"; text: string }[] = [];
  const bullets = cv.experience.flatMap((role) => role.bullets.filter(Boolean));

  if (cv.summary.length > 260) {
    notes.push({ tone: "note", text: "The summary is longer than most recruiters will read in one pass." });
  }
  const passive = bullets.filter((bullet) => /\b(was|were)\s+\w+ed\b/i.test(bullet)).length;
  if (passive) {
    notes.push({ tone: "note", text: `${passive} bullets use passive phrasing. An action verb reads faster.` });
  }
  const noPeriod = bullets.filter((bullet) => !/[.!?]$/.test(bullet.trim())).length;
  if (noPeriod > 2) {
    notes.push({ tone: "note", text: "Some bullets do not end with punctuation. Consistency is part of presentation." });
  }
  const duplicateCompanies = new Set(cv.experience.map((role) => role.company.toLowerCase())).size;
  if (duplicateCompanies < cv.experience.length) {
    notes.push({ tone: "note", text: "The same employer appears more than once. Consider grouping the roles." });
  }
  if (notes.length === 0) {
    notes.push({ tone: "good", text: "No consistency problems found in the document." });
  }
  return notes;
}

export function parseLines(text: string): string[] {
  return linesOf(text);
}
