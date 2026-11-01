import type { CSSProperties, ReactNode } from "react";
import type { CV, CvDensity } from "@/lib/types";
import { fontStack } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const SHEET_WIDTH = 794;
export const SHEET_HEIGHT = 1123;

type Density = {
  pad: number;
  name: number;
  body: number;
  small: number;
  gap: number;
  section: number;
  line: number;
};

const DENSITIES: Record<CvDensity, Density> = {
  airy: { pad: 52, name: 38, body: 12.8, small: 10.6, gap: 26, section: 20, line: 1.58 },
  balanced: { pad: 46, name: 35, body: 12.3, small: 10.3, gap: 20, section: 16, line: 1.52 },
  compact: { pad: 38, name: 31, body: 11.6, small: 9.8, gap: 15, section: 12, line: 1.45 },
};

function fade(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

function range(start: string, end: string) {
  const parts = [start?.trim(), end?.trim()].filter(Boolean);
  return parts.join(" - ");
}

function contactBits(cv: CV) {
  return [
    cv.contact.email,
    cv.contact.phone,
    cv.contact.location,
    cv.contact.website,
    cv.contact.linkedin,
    cv.contact.github,
  ].filter(Boolean);
}

type DocProps = {
  cv: CV;
  style: CSSProperties;
  density: Density;
  accent: string;
  children: ReactNode;
};

function SheetFrame({ cv, style, children }: DocProps) {
  return (
    <article
      data-cv-sheet
      className="cv-sheet overflow-hidden bg-white text-[#16150f]"
      style={{
        width: SHEET_WIDTH,
        minHeight: SHEET_HEIGHT,
        fontFamily: fontStack(cv.design.font),
        ...style,
      }}
    >
      {children}
    </article>
  );
}

function Bullets({
  items,
  density,
  accent,
  marker = "dot",
  style,
}: {
  items: string[];
  density: Density;
  accent: string;
  marker?: "dot" | "dash" | "arrow";
  style?: CSSProperties;
}) {
  const clean = items.filter(Boolean);
  if (!clean.length) return null;
  return (
    <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none", ...style }}>
      {clean.map((item, index) => (
        <li
          key={`${item.slice(0, 18)}-${index}`}
          style={{
            position: "relative",
            paddingLeft: 13,
            fontSize: density.body,
            lineHeight: density.line,
            marginBottom: 2.5,
            color: "#2f2e28",
          }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              color: marker === "dot" ? accent : "#6b6a5f",
              fontSize: marker === "arrow" ? density.body + 1 : density.body,
              lineHeight: density.line,
            }}
          >
            {marker === "dot" ? "•" : marker === "dash" ? "-" : "›"}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function EntryHead({
  title,
  subtitle,
  meta,
  density,
  accent,
  stacked = false,
  titleColor = "#16150f",
  subtitleColor,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  density: Density;
  accent: string;
  stacked?: boolean;
  titleColor?: string;
  subtitleColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: stacked ? "flex-start" : "baseline",
        gap: 12,
        flexDirection: stacked ? "column" : "row",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: density.body + 2,
            fontWeight: 650,
            letterSpacing: "-0.01em",
            color: titleColor,
          }}
        >
          {title}
        </p>
        {subtitle ? (
          <p
            style={{
              margin: "2px 0 0",
              fontSize: density.small,
              color: subtitleColor ?? accent,
              fontWeight: 600,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {meta ? (
        <p
          style={{
            margin: 0,
            fontSize: density.small - 0.6,
            color: "#6e6c60",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {meta}
        </p>
      ) : null}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   1. MERIDIAN
   ══════════════════════════════════════════════════════════════════════════ */

function Meridian({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ display: "flex", minHeight: SHEET_HEIGHT }}>
        <aside
          style={{
            width: 258,
            padding: `${density.pad}px 26px`,
            background: fade(accent, "0e"),
            borderRight: `1px solid ${fade(accent, "22")}`,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: density.name - 6,
              lineHeight: 1.03,
              fontWeight: 650,
              letterSpacing: "-0.03em",
              color: "#16150f",
            }}
          >
            {cv.contact.fullName || "Your name"}
          </h1>
          <p
            style={{
              margin: "9px 0 0",
              fontSize: 9.6,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            {cv.contact.headline || cv.targetRole}
          </p>

          <div style={{ marginTop: 18, display: "grid", gap: 5 }}>
            {bits.map((bit) => (
              <p key={bit} style={{ margin: 0, fontSize: density.small - 0.6, color: "#45443c", lineHeight: 1.5, wordBreak: "break-word" }}>
                {bit}
              </p>
            ))}
          </div>

          {groups.length ? (
            <div style={{ marginTop: 24 }}>
              <p style={sideLabel(accent)}>Skills</p>
              {groups.map((group) => (
                <div key={group.id} style={{ marginBottom: 10 }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: 8.6,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "#75746a",
                      fontWeight: 600,
                    }}
                  >
                    {group.label}
                  </p>
                  <p style={{ margin: 0, fontSize: density.small, lineHeight: 1.55, color: "#2f2e28" }}>
                    {group.items.filter(Boolean).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {cv.certifications.length ? (
            <div style={{ marginTop: 14 }}>
              <p style={sideLabel(accent)}>Certifications</p>
              {cv.certifications.filter((item) => item.name).map((item) => (
                <div key={item.id} style={{ marginBottom: 7 }}>
                  <p style={{ margin: 0, fontSize: density.small, fontWeight: 600, lineHeight: 1.4 }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: density.small - 1, color: "#6e6c60", lineHeight: 1.4 }}>
                    {[item.issuer, item.year].filter(Boolean).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {cv.languages.length ? (
            <div style={{ marginTop: 14 }}>
              <p style={sideLabel(accent)}>Languages</p>
              {cv.languages.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: "0 0 4px", fontSize: density.small, color: "#2f2e28" }}>
                  {item.name}
                  <span style={{ color: "#8a897d" }}> ({item.level})</span>
                </p>
              ))}
            </div>
          ) : null}
        </aside>

        <main style={{ flex: 1, padding: `${density.pad}px 34px` }}>
          {cv.summary ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={mainLabel(accent)}>Profile</h2>
              <p style={{ margin: 0, fontSize: density.body, lineHeight: density.line + 0.06, color: "#33322b" }}>
                {cv.summary}
              </p>
            </section>
          ) : null}

          {roles.length ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={mainLabel(accent)}>Experience</h2>
              {roles.map((role) => (
                <div key={role.id} style={{ marginBottom: density.gap * 0.72 }}>
                  <EntryHead
                    title={role.role}
                    subtitle={[role.company, role.location].filter(Boolean).join(", ")}
                    meta={range(role.start, role.end)}
                    density={density}
                    accent={accent}
                  />
                  {role.summary ? (
                    <p style={{ margin: "5px 0 0", fontSize: density.body, lineHeight: density.line, color: "#4a4941" }}>
                      {role.summary}
                    </p>
                  ) : null}
                  <Bullets items={role.bullets} density={density} accent={accent} />
                </div>
              ))}
            </section>
          ) : null}

          {cv.projects.length ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={mainLabel(accent)}>Selected projects</h2>
              {cv.projects.map((project) => (
                <div key={project.id} style={{ marginBottom: density.gap * 0.6 }}>
                  <EntryHead
                    title={project.name}
                    subtitle={[project.role, project.tags.join(", ")].filter(Boolean).join(" · ")}
                    meta={project.year}
                    density={density}
                    accent={accent}
                  />
                  {project.summary ? (
                    <p style={{ margin: "4px 0 0", fontSize: density.body, lineHeight: density.line, color: "#4a4941" }}>
                      {project.summary}
                    </p>
                  ) : null}
                  <Bullets items={project.bullets} density={density} accent={accent} />
                </div>
              ))}
            </section>
          ) : null}

          {cv.education.length ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={mainLabel(accent)}>Education</h2>
              {cv.education.map((item) => (
                <div key={item.id} style={{ marginBottom: density.gap * 0.45 }}>
                  <EntryHead
                    title={item.degree}
                    subtitle={[item.school, item.location].filter(Boolean).join(", ")}
                    meta={range(item.start, item.end)}
                    density={density}
                    accent={accent}
                  />
                  {item.detail ? (
                    <p style={{ margin: "4px 0 0", fontSize: density.small, lineHeight: density.line, color: "#4a4941" }}>
                      {item.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {cv.achievements.filter(Boolean).length ? (
            <section>
              <h2 style={mainLabel(accent)}>Recognition</h2>
              <Bullets items={cv.achievements} density={density} accent={accent} marker="dash" />
            </section>
          ) : null}
        </main>
      </div>
    </SheetFrame>
  );
}

function sideLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 7px",
    fontSize: 9,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: accent,
    fontWeight: 700,
  };
}

function mainLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 8px",
    paddingBottom: 5,
    borderBottom: `1px solid ${fade(accent, "33")}`,
    fontSize: 9.4,
    letterSpacing: "0.19em",
    textTransform: "uppercase",
    color: accent,
    fontWeight: 700,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   2. FOLIO
   ══════════════════════════════════════════════════════════════════════════ */

function Folio({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ padding: `${density.pad + 8}px ${density.pad + 18}px` }}>
        <header style={{ textAlign: "center", marginBottom: 18 }}>
          <h1
            style={{
              margin: 0,
              fontSize: density.name + 5,
              lineHeight: 1.02,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            {cv.contact.fullName || "Your name"}
          </h1>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 9.8,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: accent,
              fontWeight: 600,
            }}
          >
            {cv.contact.headline || cv.targetRole}
          </p>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: density.small - 0.4,
              color: "#55544b",
              lineHeight: 1.7,
            }}
          >
            {bits.map((bit, index) => (
              <span key={bit}>
                {bit}
                {index < bits.length - 1 ? <span style={{ color: "#b0ae9f", margin: "0 6px" }}>·</span> : null}
              </span>
            ))}
          </p>
          <div style={{ marginTop: 12, borderTop: `1.5px solid ${accent}`, borderBottom: "0.5px solid #d8d5c8", height: 3 }} />
        </header>

        {cv.summary ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={{ ...folioLabel(accent) }}>Profile</h2>
            <p style={{ margin: 0, fontSize: density.body, lineHeight: density.line + 0.08, color: "#33322b", textAlign: "justify" }}>
              {cv.summary}
            </p>
          </section>
        ) : null}

        {roles.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={folioLabel(accent)}>Experience</h2>
            {roles.map((role) => (
              <div key={role.id} style={{ marginBottom: density.gap * 0.72 }}>
                <EntryHead
                  title={role.role}
                  subtitle={role.company}
                  meta={range(role.start, role.end)}
                  density={density}
                  accent={accent}
                  titleColor="#16150f"
                  subtitleColor="#55544b"
                />
                {role.location ? (
                  <p style={{ margin: "1px 0 0", fontSize: density.small - 0.7, color: "#8a897d", fontStyle: "italic" }}>
                    {role.location}
                  </p>
                ) : null}
                {role.summary ? (
                  <p style={{ margin: "5px 0 0", fontSize: density.body, lineHeight: density.line, color: "#4a4941" }}>
                    {role.summary}
                  </p>
                ) : null}
                <Bullets items={role.bullets} density={density} accent={accent} marker="dash" />
              </div>
            ))}
          </section>
        ) : null}

        {cv.projects.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={folioLabel(accent)}>Projects</h2>
            {cv.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: density.gap * 0.55 }}>
                <EntryHead
                  title={project.name}
                  subtitle={[project.role, project.tags.join(", ")].filter(Boolean).join(" · ")}
                  meta={project.year}
                  density={density}
                  accent={accent}
                  subtitleColor="#55544b"
                />
                {project.summary ? (
                  <p style={{ margin: "4px 0 0", fontSize: density.body, lineHeight: density.line, color: "#4a4941" }}>
                    {project.summary}
                  </p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {cv.education.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={folioLabel(accent)}>Education</h2>
            {cv.education.map((item) => (
              <div key={item.id} style={{ marginBottom: density.gap * 0.4 }}>
                <EntryHead
                  title={item.degree}
                  subtitle={[item.school, item.location].filter(Boolean).join(", ")}
                  meta={range(item.start, item.end)}
                  density={density}
                  accent={accent}
                  subtitleColor="#55544b"
                />
                {item.detail ? (
                  <p style={{ margin: "3px 0 0", fontSize: density.small, color: "#4a4941", lineHeight: density.line }}>
                    {item.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {groups.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={folioLabel(accent)}>Skills</h2>
            {groups.map((group) => (
              <p key={group.id} style={{ margin: "0 0 4px", fontSize: density.body, lineHeight: density.line }}>
                <span style={{ fontWeight: 700 }}>{group.label}:</span>{" "}
                <span style={{ color: "#3d3c34" }}>{group.items.filter(Boolean).join(", ")}</span>
              </p>
            ))}
          </section>
        ) : null}

        <div style={{ display: "flex", gap: 34 }}>
          {cv.certifications.length ? (
            <section style={{ flex: 1 }}>
              <h2 style={folioLabel(accent)}>Certifications</h2>
              {cv.certifications.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: "0 0 3px", fontSize: density.small, lineHeight: density.line }}>
                  {item.name}
                  {item.issuer ? <span style={{ color: "#6e6c60" }}>, {item.issuer}</span> : null}
                  {item.year ? <span style={{ color: "#8a897d" }}> ({item.year})</span> : null}
                </p>
              ))}
            </section>
          ) : null}
          {cv.languages.length ? (
            <section style={{ flex: 1 }}>
              <h2 style={folioLabel(accent)}>Languages</h2>
              <p style={{ margin: 0, fontSize: density.small, lineHeight: density.line }}>
                {cv.languages.filter((item) => item.name).map((item) => `${item.name} (${item.level})`).join(", ")}
              </p>
            </section>
          ) : null}
        </div>

        {cv.achievements.filter(Boolean).length ? (
          <section style={{ marginTop: density.section }}>
            <h2 style={folioLabel(accent)}>Achievements</h2>
            <Bullets items={cv.achievements} density={density} accent={accent} marker="dash" />
          </section>
        ) : null}
      </div>
    </SheetFrame>
  );
}

function folioLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 7px",
    paddingBottom: 4,
    borderBottom: "0.5px solid #cfccbd",
    fontSize: 9.6,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    fontWeight: 700,
    color: accent,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   3. BOARDROOM
   ══════════════════════════════════════════════════════════════════════════ */

function Boardroom({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ padding: `${density.pad + 4}px ${density.pad + 10}px` }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 24,
            paddingBottom: 12,
            borderBottom: `2px solid ${accent}`,
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: density.name + 6, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.03em" }}>
              {cv.contact.fullName || "Your name"}
            </h1>
            <p
              style={{
                margin: "7px 0 0",
                fontSize: 9.8,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: accent,
                fontWeight: 700,
              }}
            >
              {cv.contact.headline || cv.targetRole}
            </p>
          </div>
          <div style={{ textAlign: "right", display: "grid", gap: 2, paddingBottom: 2 }}>
            {bits.map((bit) => (
              <p key={bit} style={{ margin: 0, fontSize: density.small - 0.8, color: "#55544b", lineHeight: 1.4 }}>
                {bit}
              </p>
            ))}
          </div>
        </header>

        {cv.summary ? (
          <p
            style={{
              margin: "16px 0 0",
              paddingLeft: 12,
              borderLeft: `2px solid ${accent}`,
              fontSize: density.body + 1.2,
              lineHeight: 1.62,
              color: "#33322b",
            }}
          >
            {cv.summary}
          </p>
        ) : null}

        {roles.length ? (
          <section style={{ marginTop: density.section + 4 }}>
            <h2 style={execLabel(accent)}>Experience</h2>
            {roles.map((role) => (
              <div key={role.id} style={{ marginBottom: density.gap * 0.75 }}>
                <EntryHead
                  title={[role.company, role.location].filter(Boolean).join(", ")}
                  subtitle={role.role}
                  meta={range(role.start, role.end)}
                  density={density}
                  accent={accent}
                  subtitleColor="#55544b"
                />
                {role.summary ? (
                  <p style={{ margin: "5px 0 0", fontSize: density.body, lineHeight: density.line, color: "#4a4941" }}>
                    {role.summary}
                  </p>
                ) : null}
                <Bullets items={role.bullets} density={density} accent={accent} />
              </div>
            ))}
          </section>
        ) : null}

        {cv.projects.length ? (
          <section style={{ marginTop: density.section }}>
            <h2 style={execLabel(accent)}>Selected work</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${density.gap * 0.55}px 26px` }}>
              {cv.projects.map((project) => (
                <div key={project.id} style={{ borderTop: "0.5px solid #d8d5c8", paddingTop: 7 }}>
                  <p style={{ margin: 0, fontSize: density.body + 0.4, fontWeight: 650 }}>
                    {project.name}
                    {project.year ? <span style={{ color: "#8a897d", fontWeight: 400 }}> · {project.year}</span> : null}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: density.small, color: "#55544b", lineHeight: density.line }}>
                    {project.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div style={{ display: "flex", gap: 30, marginTop: density.section }}>
          <div style={{ flex: 1.2 }}>
            {groups.length ? (
              <section>
                <h2 style={execLabel(accent)}>Capabilities</h2>
                {groups.map((group) => (
                  <p key={group.id} style={{ margin: "0 0 3px", fontSize: density.small, lineHeight: density.line }}>
                    <span style={{ fontWeight: 700 }}>{group.label}</span>
                    <span style={{ color: "#55544b" }}> {group.items.filter(Boolean).join(", ")}</span>
                  </p>
                ))}
              </section>
            ) : null}
          </div>
          <div style={{ flex: 1 }}>
            {cv.education.length ? (
              <section>
                <h2 style={execLabel(accent)}>Education</h2>
                {cv.education.map((item) => (
                  <div key={item.id} style={{ marginBottom: 6 }}>
                    <p style={{ margin: 0, fontSize: density.small, fontWeight: 600 }}>{item.degree}</p>
                    <p style={{ margin: 0, fontSize: density.small - 0.8, color: "#6e6c60" }}>
                      {[item.school, range(item.start, item.end)].filter(Boolean).join(", ")}
                    </p>
                  </div>
                ))}
              </section>
            ) : null}
            {cv.languages.length ? (
              <section style={{ marginTop: 10 }}>
                <h2 style={execLabel(accent)}>Languages</h2>
                <p style={{ margin: 0, fontSize: density.small, color: "#55544b" }}>
                  {cv.languages.filter((item) => item.name).map((item) => `${item.name} (${item.level})`).join(", ")}
                </p>
              </section>
            ) : null}
          </div>
        </div>

        {cv.certifications.length || cv.achievements.filter(Boolean).length ? (
          <section style={{ marginTop: density.section }}>
            <h2 style={execLabel(accent)}>{cv.certifications.length ? "Credentials and recognition" : "Recognition"}</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 26px" }}>
              {cv.certifications.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: 0, fontSize: density.small, color: "#3d3c34" }}>
                  {item.name}
                  {item.year ? <span style={{ color: "#8a897d" }}> ({item.year})</span> : null}
                </p>
              ))}
              {cv.achievements.filter(Boolean).map((item) => (
                <p key={item} style={{ margin: 0, fontSize: density.small, color: "#3d3c34" }}>
                  {item}
                </p>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </SheetFrame>
  );
}

function execLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 9px",
    fontSize: 9,
    letterSpacing: "0.24em",
    textTransform: "uppercase",
    color: accent,
    fontWeight: 700,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   4. QUARTO
   ══════════════════════════════════════════════════════════════════════════ */

function Quarto({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ padding: `${density.pad + 10}px ${density.pad + 22}px` }}>
        <header style={{ textAlign: "center", borderBottom: `0.75px solid ${accent}`, paddingBottom: 12, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: density.name - 2, fontWeight: 500, letterSpacing: "0.01em" }}>
            {cv.contact.fullName || "Your name"}
          </h1>
          <p style={{ margin: "5px 0 0", fontSize: density.small - 0.4, letterSpacing: "0.08em", textTransform: "uppercase", color: "#55544b" }}>
            {cv.contact.headline || cv.targetRole}
          </p>
          <p style={{ margin: "8px 0 0", fontSize: density.small - 1, color: "#6e6c60", lineHeight: 1.6 }}>
            {bits.map((bit, index) => (
              <span key={bit}>
                {bit}
                {index < bits.length - 1 ? <span style={{ margin: "0 5px", color: "#b0ae9f" }}>|</span> : null}
              </span>
            ))}
          </p>
        </header>

        {cv.summary ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={quartoLabel(accent)}>Research profile</h2>
            <p style={{ margin: 0, fontSize: density.body, lineHeight: density.line + 0.06, textAlign: "justify", color: "#33322b" }}>
              {cv.summary}
            </p>
          </section>
        ) : null}

        {cv.education.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={quartoLabel(accent)}>Education</h2>
            {cv.education.map((item) => (
              <div key={item.id} style={{ marginBottom: density.gap * 0.5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <p style={{ margin: 0, fontSize: density.body + 0.5, fontWeight: 600 }}>{item.degree}</p>
                  <p style={{ margin: 0, fontSize: density.small - 0.6, color: "#6e6c60", whiteSpace: "nowrap" }}>
                    {range(item.start, item.end)}
                  </p>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: density.small, fontStyle: "italic", color: "#55544b" }}>
                  {[item.school, item.location].filter(Boolean).join(", ")}
                </p>
                {item.detail ? (
                  <p style={{ margin: "3px 0 0", fontSize: density.small - 0.4, lineHeight: density.line, color: "#4a4941" }}>
                    {item.detail}
                  </p>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {roles.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={quartoLabel(accent)}>Appointments</h2>
            {roles.map((role) => (
              <div key={role.id} style={{ marginBottom: density.gap * 0.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <p style={{ margin: 0, fontSize: density.body + 0.4, fontWeight: 600 }}>
                    {role.role}
                    {role.company ? <span style={{ fontWeight: 400, fontStyle: "italic" }}>, {role.company}</span> : null}
                  </p>
                  <p style={{ margin: 0, fontSize: density.small - 0.6, color: "#6e6c60", whiteSpace: "nowrap" }}>
                    {range(role.start, role.end)}
                  </p>
                </div>
                <Bullets items={role.bullets} density={density} accent={accent} marker="dash" />
              </div>
            ))}
          </section>
        ) : null}

        {cv.projects.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={quartoLabel(accent)}>Selected projects and publications</h2>
            {cv.projects.map((project, index) => (
              <div key={project.id} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: density.small, color: accent, fontWeight: 600 }}>[{index + 1}]</span>
                <p style={{ margin: 0, fontSize: density.small, lineHeight: density.line, color: "#33322b" }}>
                  <span style={{ fontWeight: 600 }}>{project.name}</span>
                  {project.year ? <span style={{ color: "#6e6c60" }}>, {project.year}</span> : null}.{" "}
                  {project.summary}
                  {project.tags.length ? <span style={{ fontStyle: "italic", color: "#6e6c60" }}> ({project.tags.join(", ")})</span> : null}
                </p>
              </div>
            ))}
          </section>
        ) : null}

        {groups.length ? (
          <section style={{ marginBottom: density.section }}>
            <h2 style={quartoLabel(accent)}>Areas of expertise</h2>
            {groups.map((group) => (
              <p key={group.id} style={{ margin: "0 0 3px", fontSize: density.small + 0.2, lineHeight: density.line }}>
                <span style={{ fontWeight: 600 }}>{group.label}:</span>{" "}
                <span style={{ color: "#4a4941" }}>{group.items.filter(Boolean).join(", ")}</span>
              </p>
            ))}
          </section>
        ) : null}

        <div style={{ display: "flex", gap: 30 }}>
          {cv.certifications.length ? (
            <section style={{ flex: 1 }}>
              <h2 style={quartoLabel(accent)}>Certifications</h2>
              {cv.certifications.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: "0 0 2px", fontSize: density.small - 0.4, color: "#33322b" }}>
                  {item.name}
                  {item.issuer ? `, ${item.issuer}` : ""}
                  {item.year ? ` (${item.year})` : ""}
                </p>
              ))}
            </section>
          ) : null}
          {cv.languages.length ? (
            <section style={{ flex: 1 }}>
              <h2 style={quartoLabel(accent)}>Languages</h2>
              <p style={{ margin: 0, fontSize: density.small - 0.4, color: "#33322b" }}>
                {cv.languages.filter((item) => item.name).map((item) => `${item.name} (${item.level})`).join(", ")}
              </p>
            </section>
          ) : null}
        </div>

        {cv.achievements.filter(Boolean).length ? (
          <section style={{ marginTop: density.section }}>
            <h2 style={quartoLabel(accent)}>Honours and awards</h2>
            <Bullets items={cv.achievements} density={density} accent={accent} marker="dash" />
          </section>
        ) : null}
      </div>
    </SheetFrame>
  );
}

function quartoLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 6px",
    fontSize: 9.4,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: accent,
    fontWeight: 700,
    borderBottom: "0.5px solid #d8d5c8",
    paddingBottom: 3,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   5. STUDIO
   ══════════════════════════════════════════════════════════════════════════ */

function Studio({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ display: "flex", minHeight: SHEET_HEIGHT }}>
        <aside style={{ width: 272, background: accent, color: "#fff", padding: `${density.pad}px 26px` }}>
          <h1 style={{ margin: 0, fontSize: density.name - 5, lineHeight: 1.02, fontWeight: 600, letterSpacing: "-0.02em" }}>
            {cv.contact.fullName || "Your name"}
          </h1>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 9.6,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.78)",
              fontWeight: 600,
              lineHeight: 1.7,
            }}
          >
            {cv.contact.headline || cv.targetRole}
          </p>

          <div style={{ marginTop: 22, display: "grid", gap: 5 }}>
            {bits.map((bit) => (
              <p key={bit} style={{ margin: 0, fontSize: density.small - 0.6, color: "rgba(255,255,255,0.9)", lineHeight: 1.5, wordBreak: "break-word" }}>
                {bit}
              </p>
            ))}
          </div>

          {groups.length ? (
            <div style={{ marginTop: 26 }}>
              <p style={studioSideLabel}>Practice</p>
              {groups.map((group) => (
                <div key={group.id} style={{ marginBottom: 12 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 8.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.62)" }}>
                    {group.label}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {group.items.filter(Boolean).map((item) => (
                      <span
                        key={item}
                        style={{
                          fontSize: 9.4,
                          lineHeight: 1.4,
                          padding: "2px 6px",
                          border: "0.5px solid rgba(255,255,255,0.32)",
                          borderRadius: 3,
                          color: "rgba(255,255,255,0.94)",
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {cv.certifications.length ? (
            <div style={{ marginTop: 18 }}>
              <p style={studioSideLabel}>Recognition</p>
              {cv.certifications.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: "0 0 5px", fontSize: density.small - 0.6, color: "rgba(255,255,255,0.92)", lineHeight: 1.5 }}>
                  {item.name}
                  {item.year ? <span style={{ color: "rgba(255,255,255,0.6)" }}> {item.year}</span> : null}
                </p>
              ))}
            </div>
          ) : null}

          {cv.languages.length ? (
            <div style={{ marginTop: 16 }}>
              <p style={studioSideLabel}>Languages</p>
              {cv.languages.filter((item) => item.name).map((item) => (
                <p key={item.id} style={{ margin: "0 0 3px", fontSize: density.small - 0.5, color: "rgba(255,255,255,0.9)" }}>
                  {item.name} <span style={{ color: "rgba(255,255,255,0.6)" }}>· {item.level}</span>
                </p>
              ))}
            </div>
          ) : null}
        </aside>

        <main style={{ flex: 1, padding: `${density.pad}px 32px` }}>
          {cv.summary ? (
            <p
              style={{
                margin: "0 0 18px",
                fontSize: density.body + 1.6,
                lineHeight: 1.6,
                fontWeight: 500,
                color: "#1f1e18",
              }}
            >
              {cv.summary}
            </p>
          ) : null}

          {cv.projects.length ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={studioMainLabel(accent)}>Selected work</h2>
              {cv.projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{
                    border: "0.5px solid #e0ddd0",
                    borderRadius: 4,
                    padding: "9px 11px",
                    marginBottom: 8,
                    background: index % 2 === 0 ? "#faf9f4" : "#fff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                    <p style={{ margin: 0, fontSize: density.body + 0.6, fontWeight: 650 }}>
                      {project.name}
                      {project.role ? <span style={{ fontWeight: 400, color: "#6e6c60" }}> · {project.role}</span> : null}
                    </p>
                    <span style={{ fontSize: 8.8, letterSpacing: "0.08em", color: accent, fontWeight: 700 }}>
                      {project.year}
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: density.small, lineHeight: 1.5, color: "#4a4941" }}>
                    {project.summary}
                  </p>
                  {project.tags.length ? (
                    <p style={{ margin: "4px 0 0", fontSize: 8.6, letterSpacing: "0.06em", textTransform: "uppercase", color: "#8a897d" }}>
                      {project.tags.join(" / ")}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {roles.length ? (
            <section style={{ marginBottom: density.section }}>
              <h2 style={studioMainLabel(accent)}>Experience</h2>
              {roles.map((role) => (
                <div key={role.id} style={{ marginBottom: density.gap * 0.65 }}>
                  <EntryHead
                    title={role.role}
                    subtitle={role.company}
                    meta={range(role.start, role.end)}
                    density={density}
                    accent={accent}
                    subtitleColor="#55544b"
                  />
                  <Bullets items={role.bullets} density={density} accent={accent} />
                </div>
              ))}
            </section>
          ) : null}

          {cv.education.length ? (
            <section>
              <h2 style={studioMainLabel(accent)}>Education</h2>
              {cv.education.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 5 }}>
                  <p style={{ margin: 0, fontSize: density.small + 0.4, color: "#33322b" }}>
                    <span style={{ fontWeight: 600 }}>{item.degree}</span>
                    {item.school ? <span style={{ color: "#6e6c60" }}>, {item.school}</span> : null}
                  </p>
                  <p style={{ margin: 0, fontSize: density.small - 0.8, color: "#8a897d", whiteSpace: "nowrap" }}>
                    {range(item.start, item.end)}
                  </p>
                </div>
              ))}
            </section>
          ) : null}

          {cv.achievements.filter(Boolean).length ? (
            <section style={{ marginTop: density.section }}>
              <h2 style={studioMainLabel(accent)}>Moments</h2>
              <Bullets items={cv.achievements} density={density} accent={accent} marker="dash" />
            </section>
          ) : null}
        </main>
      </div>
    </SheetFrame>
  );
}

const studioSideLabel: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.6)",
  fontWeight: 700,
};

function studioMainLabel(accent: string): CSSProperties {
  return {
    margin: "0 0 9px",
    fontSize: 9.2,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: accent,
    fontWeight: 700,
    borderBottom: "0.5px solid #e0ddd0",
    paddingBottom: 4,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   6. KERNEL
   ══════════════════════════════════════════════════════════════════════════ */

function Kernel({ cv, density, accent, style }: DocProps) {
  const bits = contactBits(cv);
  const roles = cv.experience.filter((role) => role.role || role.company);
  const groups = cv.skills.filter((group) => group.items.filter(Boolean).length);
  const KernelSection = ({ title, index, children }: { title: string; index: string; children: ReactNode }) => {
    return (
      <section style={{ marginBottom: density.section }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 8.4, color: accent, fontWeight: 700, letterSpacing: "0.06em" }}>
            {index}
          </span>
          <h2 style={{ margin: 0, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600, color: "#3d3c34" }}>
            {title}
          </h2>
          <span style={{ flex: 1, height: 0.5, background: "#dcd9cc" }} />
        </div>
        {children}
      </section>
    );
  };

  return (
    <SheetFrame cv={cv} density={density} accent={accent} style={style}>
      <div style={{ padding: `${density.pad}px ${density.pad + 2}px` }}>
        <header style={{ paddingBottom: 12, borderBottom: `2px solid ${accent}`, marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontSize: density.name - 8, letterSpacing: "-0.02em", fontWeight: 600 }}>
            {cv.contact.fullName || "Your name"}
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: density.small, color: accent, fontWeight: 600, letterSpacing: "0.02em" }}>
            {cv.contact.headline || cv.targetRole}
          </p>
          <p style={{ margin: "7px 0 0", fontSize: density.small - 1, color: "#55544b", lineHeight: 1.6 }}>
            {bits.map((bit, index) => (
              <span key={bit}>
                {bit}
                {index < bits.length - 1 ? <span style={{ color: "#b0ae9f", margin: "0 5px" }}>·</span> : null}
              </span>
            ))}
          </p>
        </header>

        {cv.summary ? (
          <KernelSection title="Profile" index="01">
            <p style={{ margin: 0, fontSize: density.body, lineHeight: density.line + 0.04, color: "#33322b" }}>
              {cv.summary}
            </p>
          </KernelSection>
        ) : null}

        {groups.length ? (
          <KernelSection title="Technical skills" index="02">
            <div style={{ display: "grid", gap: 4 }}>
              {groups.map((group) => (
                <div key={group.id} style={{ display: "flex", gap: 10, fontSize: density.small + 0.1, lineHeight: 1.5 }}>
                  <span style={{ width: 108, flexShrink: 0, color: "#6e6c60", letterSpacing: "0.04em" }}>{group.label}</span>
                  <span style={{ color: "#2f2e28" }}>{group.items.filter(Boolean).join(", ")}</span>
                </div>
              ))}
            </div>
          </KernelSection>
        ) : null}

        {roles.length ? (
          <KernelSection title="Experience" index="03">
            {roles.map((role) => (
              <div key={role.id} style={{ marginBottom: density.gap * 0.65 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                  <p style={{ margin: 0, fontSize: density.body + 1, fontWeight: 650 }}>
                    {role.role}
                    {role.company ? <span style={{ fontWeight: 400, color: accent }}> @ {role.company}</span> : null}
                  </p>
                  <p style={{ margin: 0, fontSize: 9, color: "#6e6c60", whiteSpace: "nowrap" }}>
                    {range(role.start, role.end)}
                  </p>
                </div>
                {role.location ? (
                  <p style={{ margin: "1px 0 0", fontSize: 9.2, color: "#8a897d" }}>{role.location}</p>
                ) : null}
                <Bullets items={role.bullets} density={density} accent={accent} marker="arrow" />
              </div>
            ))}
          </KernelSection>
        ) : null}

        {cv.projects.length ? (
          <KernelSection title="Projects" index="04">
            {cv.projects.map((project) => (
              <div key={project.id} style={{ marginBottom: density.gap * 0.45 }}>
                <p style={{ margin: 0, fontSize: density.body + 0.3, fontWeight: 650 }}>
                  {project.name}
                  {project.year ? <span style={{ fontWeight: 400, color: "#8a897d" }}> · {project.year}</span> : null}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: density.small, lineHeight: density.line, color: "#4a4941" }}>
                  {project.summary}
                  {project.tags.length ? (
                    <span style={{ color: "#8a897d" }}> [{project.tags.join(", ")}]</span>
                  ) : null}
                </p>
              </div>
            ))}
          </KernelSection>
        ) : null}

        {cv.education.length ? (
          <KernelSection title="Education" index="05">
            {cv.education.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: density.small + 0.3, color: "#33322b" }}>
                  <span style={{ fontWeight: 600 }}>{item.degree}</span>
                  {item.school ? <span style={{ color: "#6e6c60" }}>, {item.school}</span> : null}
                </p>
                <p style={{ margin: 0, fontSize: 9, color: "#8a897d", whiteSpace: "nowrap" }}>
                  {range(item.start, item.end)}
                </p>
              </div>
            ))}
          </KernelSection>
        ) : null}

        {cv.certifications.length || cv.languages.length || cv.achievements.filter(Boolean).length ? (
          <KernelSection title="Additional" index="06">
            {cv.certifications.filter((item) => item.name).map((item) => (
              <p key={item.id} style={{ margin: "0 0 2px", fontSize: density.small, color: "#33322b" }}>
                {item.name}
                {item.issuer ? <span style={{ color: "#6e6c60" }}> · {item.issuer}</span> : null}
                {item.year ? <span style={{ color: "#8a897d" }}> · {item.year}</span> : null}
              </p>
            ))}
            {cv.languages.length ? (
              <p style={{ margin: "4px 0 0", fontSize: density.small, color: "#33322b" }}>
                Languages: {cv.languages.filter((item) => item.name).map((item) => `${item.name} (${item.level})`).join(", ")}
              </p>
            ) : null}
            {cv.achievements.filter(Boolean).length ? (
              <Bullets items={cv.achievements} density={density} accent={accent} marker="arrow" />
            ) : null}
          </KernelSection>
        ) : null}
      </div>
    </SheetFrame>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Entry point
   ══════════════════════════════════════════════════════════════════════════ */

export function CvSheet({ cv, className }: { cv: CV; className?: string }) {
  const density = DENSITIES[cv.design.density] ?? DENSITIES.balanced;
  const accent = cv.design.accent || "#1D5C45";
  const props: DocProps = {
    cv,
    density,
    accent,
    style: {},
    children: null,
  };

  const doc = () => {
    switch (cv.design.template) {
      case "classic":
        return <Folio {...props} />;
      case "executive":
        return <Boardroom {...props} />;
      case "academic":
        return <Quarto {...props} />;
      case "creative":
        return <Studio {...props} />;
      case "technical":
        return <Kernel {...props} />;
      case "modern":
      default:
        return <Meridian {...props} />;
    }
  };

  return <div className={cn("shadow-[var(--shadow-sheet)]", className)}>{doc()}</div>;
}
