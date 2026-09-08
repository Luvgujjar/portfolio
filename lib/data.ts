export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  blurb: string;
  stack: string[];
  /**
   * Live URL for the project.
   * -------------------------------------------------------------------------
   * Paste your remaining deployment links here. An empty string ("") renders
   * the card in its "link coming soon" state instead of a dead anchor.
   * -------------------------------------------------------------------------
   */
  href: string;
  /** Which mock UI the preview thumbnail draws. */
  preview: "chat" | "dashboard" | "storefront" | "console";
};

export const profile = {
  name: "Love Kumar Basista",
  /** Short wordmark used as the site logo. */
  wordmark: "Basista",
  /**
   * Portrait shown in the About section. Drop your photo at this path inside
   * `public/`; if the file is missing the card falls back to a monogram.
   */
  photo: "/portrait.jpg",
  roles: ["Software Developer", "Full Stack Developer", "Frontend Developer"],
  email: "luvgujjar2810@gmail.com",
  phone: "+91 7827241168",
  location: "Delhi, India",
  tagline:
    "I build complete, production-ready web products — from REST APIs and data models up to the interface people actually touch.",
  summary:
    "Full-stack developer with hands-on industry experience across ERP tooling, e-commerce, travel-tech, and real-time messaging systems. Comfortable working end-to-end with React.js, Node.js, MongoDB, and REST APIs, backed by a strong foundation in Data Structures, Algorithms, and OOP from a B.Tech in Computer Science Engineering (AI minor).",
  /** Add your GitHub / LinkedIn / resume URLs here when you have them. */
  socials: [
    { label: "GitHub", href: "" },
    { label: "LinkedIn", href: "" },
  ],
};

export const stats = [
  { value: "3", label: "Industry roles" },
  { value: "10+", label: "Products shipped" },
  { value: "5", label: "Certifications" },
  { value: "7.13", label: "B.Tech CGPA" },
];

export const skillGroups = [
  { title: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript"] },
  {
    title: "Frontend",
    items: ["React.js", "Next.js", "Vue.js", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express.js", "PHP", "Laravel", "REST APIs"],
  },
  {
    title: "Data & Storage",
    items: ["MongoDB", "MySQL", "Firebase Firestore", "Cloudinary"],
  },
  {
    title: "Tools & Platforms",
    items: ["Git", "Firebase Auth", "Vercel", "Render", "VS Code"],
  },
  {
    title: "Core CS",
    items: ["Data Structures", "Algorithms", "OOP"],
  },
];

export const alsoKnown = [
  "Basic Cybersecurity",
  "Basic Data Science",
  "Video Editing",
  "Graphic Design",
  "Content Creation",
];

export const experience = [
  {
    role: "Web Developer",
    company: "Course Unbox",
    period: "Aug 2026 — Present",
    points: [
      "Built a WhatsApp-clone messaging application using a polling-based system to sync messages.",
      "Developed a Kashmir tour package website, building both static and dynamic pages.",
      "Built “Experience My India,” a full travel review platform end-to-end — REST APIs, forms, MongoDB, and Cloudinary for media handling.",
    ],
    stack: ["React.js", "Node.js", "MongoDB", "Cloudinary"],
  },
  {
    role: "IT Team Member",
    company: "CTA Apparels",
    period: "Mar 2026 — Jul 2026",
    points: [
      "Contributed to building the company's in-house ERP system.",
      "Built an embroidery-machine stitch-count tracking system with an information dashboard and a historical record system for past dates and styles.",
      "Worked across the broader stack using Laravel, PHP, Vue.js, and MySQL.",
    ],
    stack: ["Laravel", "PHP", "Vue.js", "MySQL"],
  },
  {
    role: "Frontend & Backend Developer Intern",
    company: "ITG Telematics",
    period: "4 months · 3rd year of college",
    points: [
      "Contributed “Rakshak,” a real-time GPS tracking and driver/EMT punch-in–punch-out system for ambulance services.",
      "Built the records module storing driver and EMT documents.",
    ],
    stack: ["React.js", "Tailwind CSS", "MySQL"],
  },
];

export const projects: Project[] = [
  {
    slug: "whatsapp-clone",
    title: "WhatsApp Clone",
    subtitle: "Real-time messaging",
    year: "2026",
    blurb:
      "A messaging application that keeps conversations in sync through a polling-based engine — threaded chats, delivery states, and an interface tuned to feel instant.",
    stack: ["React.js", "Node.js", "MongoDB", "Polling sync"],
    href: "https://whatsapp-clone-teal-seven.vercel.app",
    preview: "chat",
  },
  {
    slug: "elevate-agency",
    title: "Elevate Agency",
    subtitle: "Digital marketing platform",
    year: "2025",
    blurb:
      "A high-converting agency platform with a mobile-first UI and optimized lead-generation workflows, backed by an Express REST API and a real-time admin dashboard for centralized lead management.",
    stack: ["React", "Tailwind CSS", "Node.js", "Express", "Vercel", "Render"],
    href: "",
    preview: "dashboard",
  },
  {
    slug: "bossata",
    title: "Bossata",
    subtitle: "E-commerce storefront",
    year: "2025",
    blurb:
      "A single-page React storefront with custom state-based routing and an editorial-style responsive UI — dynamic cart, persistent wishlist tracking, and localized authentication states built on React Hooks.",
    stack: ["React", "Tailwind CSS", "React Hooks"],
    href: "",
    preview: "storefront",
  },
  {
    slug: "cctv-platform",
    title: "CCTV Service Platform",
    subtitle: "Quoting & order tracking",
    year: "2025",
    blurb:
      "A full-stack service platform pairing a dynamic cost-estimation engine with a role-based admin dashboard, wired to Firestore for real-time data sync, cart management, and live order tracking.",
    stack: ["React", "Vite", "Tailwind CSS", "Firebase"],
    href: "",
    preview: "console",
  },
];

export const education = [
  {
    degree: "B.Tech, Computer Science Engineering",
    detail: "Minor in Artificial Intelligence",
    school: "Guru Tegh Bahadur 4th Centenary Institute of Technology, GGSIPU",
    period: "2022 — 2026",
    note: "CGPA 7.13/10 · First Division · Provisional Degree",
  },
  {
    degree: "Senior Secondary (Class XII), CBSE",
    detail: "",
    school: "G.L.T Saraswati Bal Mandir, Nehru Nagar, New Delhi",
    period: "2022",
    note: "",
  },
  {
    degree: "Secondary (Class X), CBSE",
    detail: "",
    school: "G.L.T Saraswati Bal Mandir, Nehru Nagar, New Delhi",
    period: "2020",
    note: "",
  },
];

export const certifications = [
  "Master Data Structures and Algorithms using Java — Coding Blocks",
  "Web Development using MERN Stack — Coding Blocks",
  "Hands-on AI project led by IIT Delhi alumnus Mr. Trivikrama — NxtWave",
  "Frontend Internship Program — IBM SkillsBuild",
  "Frontend and Backend Developer Internship — ITG Telematics",
];

export const highlights = [
  {
    title: "1st place — Cyber-Tale, ENCIPHER’25",
    detail:
      "Won the cybersecurity and forensics competition at Ram Lal Anand College, University of Delhi (via Unstop).",
  },
  {
    title: "Esports Head — Midknite, GTB4CEC",
    detail: "Organised and managed multiple events for the college.",
  },
  {
    title: "Cleared SSB for TES-48",
    detail: "B.Tech entry, October 2022 — medically out.",
  },
];

export const languages = ["English — Fluent", "Hindi — Fluent"];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
