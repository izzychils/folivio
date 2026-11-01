export type ID = string;

/* ── accounts ───────────────────────────────────────────────────────────── */

export type Account = {
  id: ID;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export type Session = {
  userId: ID;
  startedAt: string;
};

/* ── shared career building blocks ──────────────────────────────────────── */

export type Contact = {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
};

export type Experience = {
  id: ID;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  bullets: string[];
};

export type Education = {
  id: ID;
  degree: string;
  school: string;
  location: string;
  start: string;
  end: string;
  detail: string;
};

export type SkillGroup = {
  id: ID;
  label: string;
  items: string[];
};

export type Project = {
  id: ID;
  name: string;
  role: string;
  year: string;
  link: string;
  summary: string;
  bullets: string[];
  tags: string[];
};

export type Certification = {
  id: ID;
  name: string;
  issuer: string;
  year: string;
  link: string;
};

export type Language = {
  id: ID;
  name: string;
  level: string;
};

/* ── the career profile: the single source of truth ─────────────────────── */

export type CareerProfile = {
  contact: Contact;
  summary: string;
  bio: string;
  goals: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: string[];
  updatedAt: string;
};

/* ── CV documents ───────────────────────────────────────────────────────── */

export type TemplateId =
  | "modern"
  | "classic"
  | "executive"
  | "academic"
  | "creative"
  | "technical";

export type CvFont = "grotesque" | "editorial" | "technical";
export type CvDensity = "airy" | "balanced" | "compact";

export type CvDesign = {
  template: TemplateId;
  accent: string;
  font: CvFont;
  density: CvDensity;
};

/** Everything on the sheet. A CV owns copies so versions can diverge. */
export type CvDocument = {
  title: string;
  targetRole: string;
  targetCompany: string;
  jobDescription: string;
  contact: Contact;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  achievements: string[];
  design: CvDesign;
};

export type CvVersion = {
  id: ID;
  at: string;
  label: string;
  document: CvDocument;
};

export type CV = CvDocument & {
  id: ID;
  createdAt: string;
  updatedAt: string;
  versions: CvVersion[];
};

/* ── portfolio ──────────────────────────────────────────────────────────── */

export type PortfolioProject = {
  id: ID;
  title: string;
  subtitle: string;
  year: string;
  summary: string;
  body: string;
  tags: string[];
  link: string;
  tone: 0 | 1 | 2 | 3 | 4 | 5;
};

export type PortfolioTheme = "editorial" | "minimal" | "index";

export type Portfolio = {
  slug: string;
  published: boolean;
  displayName: string;
  headline: string;
  about: string;
  location: string;
  email: string;
  website: string;
  linkedin: string;
  showEmail: boolean;
  theme: PortfolioTheme;
  accent: string;
  projects: PortfolioProject[];
  updatedAt: string;
};

/* ── letters and other generated documents ──────────────────────────────── */

export type LetterKind =
  | "cover"
  | "statement"
  | "bio"
  | "linkedin"
  | "interview";

export type Letter = {
  id: ID;
  kind: LetterKind;
  title: string;
  role: string;
  company: string;
  body: string;
  cvId: ID | null;
  createdAt: string;
  updatedAt: string;
};

/* ── workspace and settings ─────────────────────────────────────────────── */

export type ThemeMode = "light" | "dark" | "system";

export type Settings = {
  theme: ThemeMode;
  defaultTemplate: TemplateId;
  defaultAccent: string;
  reduceMotion: boolean;
  sampleContent: boolean;
};

export type ActivityKind =
  | "cv.created"
  | "cv.updated"
  | "cv.duplicated"
  | "portfolio.published"
  | "letter.created"
  | "profile.updated"
  | "account.created";

export type Activity = {
  id: ID;
  kind: ActivityKind;
  text: string;
  at: string;
};

export type Workspace = {
  version: 1;
  profile: CareerProfile;
  cvs: CV[];
  portfolio: Portfolio;
  letters: Letter[];
  activity: Activity[];
  settings: Settings;
};

/* ── intelligence reports ───────────────────────────────────────────────── */

export type CheckStatus = "pass" | "warn" | "fail";

export type AtsCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  weight: number;
};

export type AtsReport = {
  score: number;
  grade: "Excellent" | "Strong" | "Fair" | "Needs work";
  checks: AtsCheck[];
  keywords: { term: string; matched: boolean }[];
  stats: {
    words: number;
    bullets: number;
    quantified: number;
    roles: number;
    skills: number;
  };
};

export type MatchReport = {
  score: number;
  matched: string[];
  missing: string[];
  emphasis: string[];
  stats: { required: number; covered: number };
};

export type GapItem = {
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
};

export type ChatTurn = {
  id: string;
  role: "assistant" | "user";
  text: string;
  at: string;
};

export type ChatSuggestion = {
  label: string;
  value: string;
};

export type PortfolioTone = 0 | 1 | 2 | 3 | 4 | 5;
