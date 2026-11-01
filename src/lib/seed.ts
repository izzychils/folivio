import { defaultDesign } from "./templates";
import type {
  Account,
  CV,
  CareerProfile,
  Contact,
  Portfolio,
  Settings,
  Workspace,
} from "./types";
import { nowISO, slugify, uid } from "./utils";

export const emptyContact = (): Contact => ({
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
});

export const defaultSettings = (): Settings => ({
  theme: "light",
  defaultTemplate: "modern",
  defaultAccent: "#1D5C45",
  reduceMotion: false,
  sampleContent: true,
});

export function emptyProfile(contact: Partial<Contact> = {}): CareerProfile {
  return {
    contact: { ...emptyContact(), ...contact },
    summary: "",
    bio: "",
    goals: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    updatedAt: nowISO(),
  };
}

export function emptyPortfolio(contact: Partial<Contact> = {}): Portfolio {
  return {
    slug: slugify(contact.fullName || "your-name"),
    published: false,
    displayName: contact.fullName || "",
    headline: contact.headline || "",
    about: "",
    location: contact.location || "",
    email: contact.email || "",
    website: contact.website || "",
    linkedin: contact.linkedin || "",
    showEmail: true,
    theme: "editorial",
    accent: "#1D5C45",
    projects: [],
    updatedAt: nowISO(),
  };
}

function sampleProfileFor(account: Pick<Account, "name" | "email">): CareerProfile {
  const name = account.name || "Amara Okonkwo";
  const slug = slugify(name) || "amara-okonkwo";
  return {
    contact: {
      fullName: name,
      headline: "Senior Product Designer",
      email: account.email || "hello@example.com",
      phone: "+234 800 000 0000",
      location: "Lagos, Nigeria",
      website: `${slug}.folio.site`,
      linkedin: `linkedin.com/in/${slug.replace(/-/g, "")}`,
      github: "",
    },
    summary:
      "Senior product designer with 8 years shaping health and fintech products used by more than two million people. I turn tangled service journeys into clear, accessible interfaces, and I build the design systems that keep them consistent after launch.",
    bio: "I am a product designer who likes the unglamorous part of the work: the messy research notes, the edge cases, the handoff document nobody reads until week three. Over eight years I have moved from agency projects to in-house product teams, and the thread through all of it is clarity. I design for the person on the other side of the screen who is tired, distracted, or in a hurry.",
    goals: "Move into a design leadership role where I can shape how a health product makes decisions, not just how it looks.",
    experience: [
      {
        id: uid("exp"),
        role: "Senior Product Designer",
        company: "Meridian Health",
        location: "Lagos, Nigeria",
        start: "Mar 2022",
        end: "Present",
        summary:
          "Owning the patient experience across web and mobile for a care network serving three markets.",
        bullets: [
          "Led the redesign of the patient onboarding journey, cutting drop-off from 41% to 18% across three markets.",
          "Built Meridian's first design system, now used by 34 engineers and 6 product teams across web and mobile.",
          "Ran 42 moderated research sessions with patients and clinicians, turning the findings into a prioritised roadmap.",
          "Mentored three mid-level designers and introduced a weekly critique that measurably lifted handoff quality.",
        ],
      },
      {
        id: uid("exp"),
        role: "Product Designer",
        company: "Kobo Labs",
        location: "Lagos, Nigeria",
        start: "Jan 2019",
        end: "Feb 2022",
        summary: "",
        bullets: [
          "Designed the savings and transfer experience for a fintech app with 600,000 monthly active users.",
          "Partnered with engineering to ship 18 releases, reducing average design-to-build time from 3 weeks to 9 days.",
          "Introduced accessibility checks into the design process, bringing core flows to WCAG 2.1 AA.",
        ],
      },
      {
        id: uid("exp"),
        role: "Junior Product Designer",
        company: "Studio Nine",
        location: "Abuja, Nigeria",
        start: "Jul 2017",
        end: "Dec 2018",
        summary: "",
        bullets: [
          "Produced interface work for 12 client projects across fintech, logistics and education.",
          "Created a reusable component library that reduced project setup time by 40%.",
        ],
      },
    ],
    education: [
      {
        id: uid("edu"),
        degree: "BSc Human Computer Interaction",
        school: "Covenant University",
        location: "Ota, Nigeria",
        start: "2013",
        end: "2017",
        detail:
          "Second Class Upper. Final year project on wayfinding in low bandwidth health applications.",
      },
    ],
    skills: [
      {
        id: uid("skl"),
        label: "Product",
        items: [
          "Product strategy",
          "Design systems",
          "Interaction design",
          "Prototyping",
          "Design critique",
        ],
      },
      {
        id: uid("skl"),
        label: "Research",
        items: [
          "Usability testing",
          "User interviews",
          "Journey mapping",
          "Accessibility (WCAG 2.1)",
        ],
      },
      {
        id: uid("skl"),
        label: "Tools",
        items: ["Figma", "Framer", "Storybook", "HTML and CSS", "Maze"],
      },
    ],
    projects: [
      {
        id: uid("prj"),
        name: "Care pathways",
        role: "Lead designer",
        year: "2023",
        link: "",
        summary:
          "A rebuilt referral journey for clinicians moving patients between primary and specialist care.",
        bullets: [
          "Mapped 11 handoff points with clinical staff before drawing a single screen.",
          "Cut referral completion time from 6 days to 2 by removing two duplicate approval steps.",
        ],
        tags: ["Healthcare", "Service design", "Research"],
      },
      {
        id: uid("prj"),
        name: "Meridian design system",
        role: "Founder and maintainer",
        year: "2022",
        link: "",
        summary:
          "One component library and one language for six product teams, from tokens to documentation.",
        bullets: [
          "Shipped 62 components with usage guidance and accessibility notes.",
          "Reduced new feature design time by roughly a third in the first two quarters.",
        ],
        tags: ["Design systems", "Accessibility", "Documentation"],
      },
      {
        id: uid("prj"),
        name: "Savings circles",
        role: "Product designer",
        year: "2021",
        link: "",
        summary:
          "A group savings feature built around trust, transparency and the way people actually save together.",
        bullets: [
          "Designed a shared ledger that made every contribution visible to the whole circle.",
          "Grew weekly active use of savings features by 27% in the first release window.",
        ],
        tags: ["Fintech", "Mobile", "Community"],
      },
    ],
    certifications: [
      {
        id: uid("crt"),
        name: "NN/g UX Certification",
        issuer: "Nielsen Norman Group",
        year: "2021",
        link: "",
      },
      {
        id: uid("crt"),
        name: "Google UX Design Certificate",
        issuer: "Google",
        year: "2020",
        link: "",
      },
    ],
    languages: [
      { id: uid("lng"), name: "English", level: "Native" },
      { id: uid("lng"), name: "Igbo", level: "Fluent" },
      { id: uid("lng"), name: "French", level: "Conversational" },
    ],
    achievements: [
      "Cut patient onboarding drop-off by 23 points across three markets.",
      "Shipped a design system adopted by six product teams.",
      "Speaker at Lagos Design Week, 2023.",
    ],
    updatedAt: nowISO(),
  };
}

function cvFromProfile(
  profile: CareerProfile,
  input: {
    title: string;
    targetRole: string;
    targetCompany: string;
    summary: string;
    template: CV["design"]["template"];
    accent: string;
    jobDescription?: string;
    projectLimit?: number;
    experienceLimit?: number;
  },
): CV {
  const at = nowISO();
  const design = {
    ...defaultDesign(input.template),
    accent: input.accent,
  };
  return {
    id: uid("cv"),
    title: input.title,
    targetRole: input.targetRole,
    targetCompany: input.targetCompany,
    jobDescription: input.jobDescription ?? "",
    contact: { ...profile.contact, headline: input.targetRole || profile.contact.headline },
    summary: input.summary,
    experience: profile.experience.slice(0, input.experienceLimit ?? 3).map((item) => ({
      ...item,
      bullets: [...item.bullets],
    })),
    education: profile.education.map((item) => ({ ...item })),
    skills: profile.skills.map((group) => ({ ...group, items: [...group.items] })),
    projects: profile.projects
      .slice(0, input.projectLimit ?? profile.projects.length)
      .map((item) => ({ ...item, bullets: [...item.bullets], tags: [...item.tags] })),
    certifications: profile.certifications.map((item) => ({ ...item })),
    languages: profile.languages.map((item) => ({ ...item })),
    achievements: profile.achievements.slice(0, 4),
    design,
    createdAt: at,
    updatedAt: at,
    versions: [],
  };
}

const SAMPLE_JD = `Senior Product Designer, Care Platform

We are looking for a senior product designer to lead the end to end experience of our care platform. You will work with clinicians, engineers and data partners to simplify complex workflows for patients and care teams.

What you will do
- Own discovery and delivery for two squads, from research through to production handoff
- Build and maintain the design system alongside the frontend platform team
- Run qualitative research with patients and clinicians, and turn it into decisions
- Raise the accessibility bar across every surface we ship

What we are looking for
- 5 or more years designing digital products, ideally in health or fintech
- Strong systems thinking and hands on design system experience
- Comfortable with usability testing, journey mapping and prototyping
- Working knowledge of WCAG 2.1 accessibility standards
- Clear written communication and a portfolio that explains your decisions`;

function sampleCvs(profile: CareerProfile): CV[] {
  return [
    cvFromProfile(profile, {
      title: "Senior Product Designer, health",
      targetRole: "Senior Product Designer",
      targetCompany: "Lumen Health",
      summary:
        "Senior product designer with 8 years across health and fintech, focused on the moments where a product either earns trust or loses it. I led a patient onboarding redesign that cut drop-off by 23 points, and built a design system used by six product teams.",
      template: "modern",
      accent: "#1D5C45",
      jobDescription: SAMPLE_JD,
      projectLimit: 2,
    }),
    cvFromProfile(profile, {
      title: "Design systems lead",
      targetRole: "Design Systems Lead",
      targetCompany: "",
      summary:
        "Product designer who treats a design system as product work, not a library of screens. I built Meridian's system from tokens to documentation, grew adoption across 34 engineers, and cut new feature design time by a third.",
      template: "technical",
      accent: "#1E3A5F",
      experienceLimit: 2,
      projectLimit: 3,
    }),
    cvFromProfile(profile, {
      title: "UX lead, fintech",
      targetRole: "UX Lead",
      targetCompany: "Northwind",
      summary:
        "Designer with a record of shipping financial products people use every week. At Kobo Labs I designed savings and transfer flows for 600,000 monthly users and brought core journeys to WCAG 2.1 AA.",
      template: "executive",
      accent: "#14140F",
      experienceLimit: 2,
      projectLimit: 1,
    }),
  ];
}

function samplePortfolio(profile: CareerProfile): Portfolio {
  return {
    slug: slugify(profile.contact.fullName) || "your-name",
    published: true,
    displayName: profile.contact.fullName,
    headline: profile.contact.headline,
    about:
      "I design health and financial products, and I care most about the moment someone stops struggling. Eight years in, I still start with the research notes.",
    location: profile.contact.location,
    email: profile.contact.email,
    website: profile.contact.website,
    linkedin: profile.contact.linkedin,
    showEmail: true,
    theme: "editorial",
    accent: "#1D5C45",
    projects: profile.projects.map((project, index) => ({
      id: uid("pfp"),
      title: project.name,
      subtitle: project.role,
      year: project.year,
      summary: project.summary,
      body: project.bullets.join(" "),
      tags: [...project.tags],
      link: project.link,
      tone: (index % 6) as Portfolio["projects"][number]["tone"],
    })),
    updatedAt: nowISO(),
  };
}

export function sampleWorkspace(account: Pick<Account, "name" | "email">): Workspace {
  const profile = sampleProfileFor(account);
  const cvs = sampleCvs(profile);
  const firstCv = cvs[0];
  return {
    version: 1,
    profile,
    cvs,
    portfolio: samplePortfolio(profile),
    letters: [
      {
        id: uid("ltr"),
        kind: "cover",
        title: "Cover letter, Lumen Health",
        role: "Senior Product Designer",
        company: "Lumen Health",
        body: `Dear Hiring Team,

I am applying for the Senior Product Designer role on the care platform. For the last four years I have designed patient facing products at Meridian Health, where the work is measured in fewer missed appointments rather than more screens shipped.

The part of this role that pulled me in is the systems problem underneath the interface. I built Meridian's design system from tokens through documentation, and it now runs across six product teams and 34 engineers. That work taught me that consistency is not a visual preference: it is how a care team learns to trust what the product tells them.

Before Meridian, I designed savings and transfer flows at Kobo Labs for 600,000 monthly users, where I brought core journeys to WCAG 2.1 AA. I run research myself, I write the handoff notes, and I stay close enough to engineering that the shipped thing is still recognisable.

I would welcome the chance to talk about what the care platform is trying to become, and where design can make that easier.

Kind regards,
${profile.contact.fullName}`,
        cvId: firstCv.id,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      },
    ],
    activity: [
      {
        id: uid("act"),
        kind: "cv.updated",
        text: "Updated " + firstCv.title,
        at: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
      },
      {
        id: uid("act"),
        kind: "letter.created",
        text: "Drafted a cover letter for Lumen Health",
        at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: uid("act"),
        kind: "portfolio.published",
        text: "Published the online portfolio",
        at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        id: uid("act"),
        kind: "profile.updated",
        text: "Added the Meridian design system project",
        at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      },
    ],
    settings: defaultSettings(),
  };
}

/** A blank workspace, used when someone clears the sample content. */
export function blankWorkspace(account: Pick<Account, "name" | "email">): Workspace {
  const contact = {
    fullName: account.name,
    email: account.email,
  };
  return {
    version: 1,
    profile: emptyProfile(contact),
    cvs: [],
    portfolio: { ...emptyPortfolio(contact), published: false },
    letters: [],
    activity: [],
    settings: { ...defaultSettings(), sampleContent: false },
  };
}
