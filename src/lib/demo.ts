import type { CV } from "./types";

/**
 * A fixed, deterministic document for the marketing site. Ids are explicit so
 * the hero and template gallery render identically on the server and client.
 */
export const demoCv: CV = {
  id: "demo_cv",
  title: "Senior Product Designer, health",
  targetRole: "Senior Product Designer",
  targetCompany: "Lumen Health",
  jobDescription: "",
  contact: {
    fullName: "Amara Okonkwo",
    headline: "Senior Product Designer",
    email: "amara@example.com",
    phone: "+234 800 000 0000",
    location: "Lagos, Nigeria",
    website: "amara.folio.site",
    linkedin: "linkedin.com/in/amaraokonkwo",
    github: "",
  },
  summary:
    "Senior product designer with 8 years shaping health and fintech products used by more than two million people. I turn tangled service journeys into clear, accessible interfaces, and I build the design systems that keep them consistent after launch.",
  experience: [
    {
      id: "demo_exp_1",
      role: "Senior Product Designer",
      company: "Meridian Health",
      location: "Lagos, Nigeria",
      start: "Mar 2022",
      end: "Present",
      summary: "Owning the patient experience across web and mobile for three markets.",
      bullets: [
        "Led the redesign of the patient onboarding journey, cutting drop-off from 41% to 18%.",
        "Built Meridian's first design system, now used by 34 engineers and 6 product teams.",
        "Ran 42 moderated research sessions with patients and clinicians.",
      ],
    },
    {
      id: "demo_exp_2",
      role: "Product Designer",
      company: "Kobo Labs",
      location: "Lagos, Nigeria",
      start: "Jan 2019",
      end: "Feb 2022",
      summary: "",
      bullets: [
        "Designed savings and transfer flows for a fintech app with 600,000 monthly active users.",
        "Reduced average design-to-build time from 3 weeks to 9 days across 18 releases.",
        "Brought core journeys to WCAG 2.1 AA.",
      ],
    },
  ],
  education: [
    {
      id: "demo_edu_1",
      degree: "BSc Human Computer Interaction",
      school: "Covenant University",
      location: "Ota, Nigeria",
      start: "2013",
      end: "2017",
      detail: "Second Class Upper. Final year project on wayfinding in low bandwidth health apps.",
    },
  ],
  skills: [
    {
      id: "demo_skl_1",
      label: "Product",
      items: ["Product strategy", "Design systems", "Prototyping", "Interaction design"],
    },
    {
      id: "demo_skl_2",
      label: "Research",
      items: ["Usability testing", "User interviews", "Accessibility (WCAG 2.1)"],
    },
    {
      id: "demo_skl_3",
      label: "Tools",
      items: ["Figma", "Framer", "Storybook", "HTML and CSS"],
    },
  ],
  projects: [
    {
      id: "demo_prj_1",
      name: "Care pathways",
      role: "Lead designer",
      year: "2023",
      link: "",
      summary: "A rebuilt referral journey for clinicians moving patients between care settings.",
      bullets: [],
      tags: ["Healthcare", "Service design"],
    },
    {
      id: "demo_prj_2",
      name: "Meridian design system",
      role: "Founder",
      year: "2022",
      link: "",
      summary: "Sixty two components, one language, six product teams.",
      bullets: [],
      tags: ["Design systems", "Accessibility"],
    },
  ],
  certifications: [
    { id: "demo_crt_1", name: "NN/g UX Certification", issuer: "Nielsen Norman Group", year: "2021", link: "" },
    { id: "demo_crt_2", name: "Google UX Certificate", issuer: "Google", year: "2020", link: "" },
  ],
  languages: [
    { id: "demo_lng_1", name: "English", level: "Native" },
    { id: "demo_lng_2", name: "Igbo", level: "Fluent" },
  ],
  achievements: [
    "Cut patient onboarding drop-off by 23 points across three markets.",
    "Speaker at Lagos Design Week, 2023.",
  ],
  design: {
    template: "modern",
    accent: "#1D5C45",
    font: "grotesque",
    density: "balanced",
  },
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  versions: [],
};
