import type { CvDesign, CvFont, TemplateId } from "./types";

export type TemplateMeta = {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  bestFor: string;
  font: CvFont;
  accent: string;
  format: string;
};

export const CV_TEMPLATES: TemplateMeta[] = [
  {
    id: "modern",
    name: "Meridian",
    tagline: "The modern default",
    description:
      "A quiet left rail for contact and skills, a wide column for the work. Reads well on screen and on paper.",
    bestFor: "Product, design, marketing, operations",
    font: "grotesque",
    accent: "#1D5C45",
    format: "Two column",
  },
  {
    id: "classic",
    name: "Folio",
    tagline: "The classic single column",
    description:
      "Centred name, rules between sections, generous margins. The shape recruiters already know how to read.",
    bestFor: "Any role, every region",
    font: "editorial",
    accent: "#14140F",
    format: "Single column",
  },
  {
    id: "executive",
    name: "Boardroom",
    tagline: "The executive brief",
    description:
      "A strong masthead, small caps section markers and room for a leadership narrative above the roles.",
    bestFor: "Directors, heads of, C-suite",
    font: "editorial",
    accent: "#1E3A5F",
    format: "Masthead",
  },
  {
    id: "academic",
    name: "Quarto",
    tagline: "The academic record",
    description:
      "Dense, orderly and citation friendly, with space for publications, teaching and research detail.",
    bestFor: "Research, lecturing, scholarships",
    font: "editorial",
    accent: "#14140F",
    format: "Single column",
  },
  {
    id: "creative",
    name: "Studio",
    tagline: "The creative statement",
    description:
      "A tinted sidebar, a short profile quote and project cards that let the work speak before the chronology.",
    bestFor: "Design, film, brand, content",
    font: "grotesque",
    accent: "#A9502A",
    format: "Sidebar",
  },
  {
    id: "technical",
    name: "Kernel",
    tagline: "The technical spec",
    description:
      "Mono section markers, compact spacing and a skills matrix built for engineers and analysts.",
    bestFor: "Engineering, data, security, product ops",
    font: "technical",
    accent: "#1D5C45",
    format: "Compact",
  },
];

export const TEMPLATE_BY_ID: Record<TemplateId, TemplateMeta> = CV_TEMPLATES.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<TemplateId, TemplateMeta>,
);

/** Accents are print colours: all dark enough to hold text contrast on paper. */
export const CV_ACCENTS = [
  { name: "Forest", value: "#1D5C45" },
  { name: "Ink", value: "#14140F" },
  { name: "Clay", value: "#A9502A" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Plum", value: "#5A2A4A" },
  { name: "Graphite", value: "#4A4A45" },
] as const;

export const CV_FONTS: { id: CvFont; name: string; sample: string }[] = [
  { id: "grotesque", name: "Grotesque", sample: "Aa" },
  { id: "editorial", name: "Editorial", sample: "Aa" },
  { id: "technical", name: "Technical", sample: "Aa" },
];

export function fontStack(font: CvFont): string {
  if (font === "editorial") {
    return 'Georgia, "Iowan Old Style", "Times New Roman", serif';
  }
  if (font === "technical") {
    return 'var(--font-jetbrains), "JetBrains Mono", ui-monospace, monospace';
  }
  return 'var(--font-inter), Inter, "Helvetica Neue", Arial, sans-serif';
}

export function defaultDesign(template: TemplateId = "modern"): CvDesign {
  const meta = TEMPLATE_BY_ID[template];
  return {
    template,
    accent: meta.accent,
    font: meta.font,
    density: "balanced",
  };
}
