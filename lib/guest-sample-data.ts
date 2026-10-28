import type { ResumeData } from "./types"

// Sample resumes seeded into a brand-new guest session so the dashboard and
// editor feel populated. The people and employers are fictional.

const contact = {
  name: "Priya Raman",
  email: "priya.raman@example.com",
  phone: "+1 (415) 555-0142",
  linkedin: "linkedin.com/in/priyaraman",
  github: "github.com/priyaraman",
  location: "Seattle, WA",
}

const education: ResumeData["education"] = [
  {
    id: "edu-1",
    school: "University of Washington",
    degree: "B.S. in Computer Science",
    startDate: "Sep 2014",
    endDate: "Jun 2018",
    details: "Graduated cum laude. Teaching assistant for Data Structures and Human-Computer Interaction.",
  },
]

const frontendResume: ResumeData = {
  contact,
  summary:
    "Senior frontend engineer with 7 years of experience building fast, accessible web apps used by millions. Led the migration of a 400k-line codebase to React and TypeScript, and cut core page load time by 42%. Happiest working at the seam between design and engineering.",
  skills: [
    { id: "sk-1", category: "Languages", skills: "TypeScript, JavaScript, HTML, CSS, SQL, Python" },
    { id: "sk-2", category: "Frontend", skills: "React, Next.js, Redux, Tailwind CSS, Storybook, Framer Motion" },
    { id: "sk-3", category: "Tooling", skills: "Vite, Webpack, Jest, Playwright, GitHub Actions, Figma" },
    { id: "sk-4", category: "Practices", skills: "Web accessibility (WCAG 2.2), performance budgets, design systems, mentoring" },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Lumen Labs",
      role: "Senior Frontend Engineer",
      location: "Seattle, WA",
      startDate: "Mar 2022",
      endDate: "Present",
      bullets: [
        "Led a team of 5 engineers rebuilding the analytics dashboard in Next.js, improving Largest Contentful Paint from 3.8s to 2.2s (42% faster).",
        "Designed and shipped a company-wide component library of 60+ accessible components, adopted by 9 product teams and cutting UI build time by roughly a third.",
        "Introduced Playwright end-to-end tests for checkout and onboarding, reducing production regressions by 58% over two quarters.",
        "Mentored 4 engineers, two of whom were promoted to mid-level within 18 months.",
      ],
    },
    {
      id: "exp-2",
      company: "Northwind Analytics",
      role: "Frontend Engineer",
      location: "Seattle, WA",
      startDate: "Aug 2019",
      endDate: "Feb 2022",
      bullets: [
        "Migrated a 400k-line jQuery and Backbone codebase to React and TypeScript across 14 months with zero downtime.",
        "Built a real-time charting module handling 50k data points at 60fps using canvas rendering and virtualization.",
        "Raised Lighthouse accessibility scores from 71 to 97 by auditing keyboard navigation, focus management and color contrast.",
      ],
    },
    {
      id: "exp-3",
      company: "Brightpath",
      role: "Software Engineer",
      location: "Portland, OR",
      startDate: "Jul 2018",
      endDate: "Jul 2019",
      bullets: [
        "Shipped a self-serve onboarding flow that lifted trial-to-paid conversion from 9% to 13%.",
        "Wrote the first automated UI test suite, covering 80% of critical user journeys.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Tidepool",
      link: "github.com/priyaraman/tidepool",
      techStack: "React, TypeScript, Vite, IndexedDB",
      bullets: [
        "Open-source offline-first habit tracker with 1.8k GitHub stars and 40+ contributors.",
        "Implemented conflict-free sync between devices using CRDTs, with a full test suite and a published design doc.",
      ],
    },
  ],
  education,
}

const fullStackResume: ResumeData = {
  contact,
  summary:
    "Full-stack engineer who ships product end to end. Strong in React, Node.js and PostgreSQL, with a track record of turning vague problems into reliable, well-measured features. Tailored for a fintech platform role.",
  skills: [
    { id: "sk-1", category: "Languages", skills: "TypeScript, Node.js, Python, SQL, Go (working knowledge)" },
    { id: "sk-2", category: "Backend", skills: "PostgreSQL, Redis, REST, GraphQL, Stripe API, Supabase" },
    { id: "sk-3", category: "Frontend", skills: "React, Next.js, Tailwind CSS, React Query" },
    { id: "sk-4", category: "Infrastructure", skills: "AWS (ECS, S3, RDS), Docker, Terraform, GitHub Actions, Datadog" },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Lumen Labs",
      role: "Senior Software Engineer",
      location: "Seattle, WA",
      startDate: "Mar 2022",
      endDate: "Present",
      bullets: [
        "Designed an idempotent payments service in Node.js and PostgreSQL processing $3.2M monthly with zero duplicate charges since launch.",
        "Reduced p95 API latency from 480ms to 190ms by adding query indexes, Redis caching and connection pooling.",
        "Built an internal billing dashboard in Next.js that cut support escalations about invoices by 35%.",
        "Owned on-call runbooks and alerting, improving mean time to recovery from 42 minutes to 15.",
      ],
    },
    {
      id: "exp-2",
      company: "Northwind Analytics",
      role: "Software Engineer",
      location: "Seattle, WA",
      startDate: "Aug 2019",
      endDate: "Feb 2022",
      bullets: [
        "Created a data-export API streaming CSVs of up to 2M rows, replacing a job that previously timed out for large customers.",
        "Introduced role-based access control across 30+ endpoints, closing findings from two external security audits.",
        "Partnered with design to ship a self-serve reporting builder used by 1,200 accounts in its first quarter.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "LedgerLite",
      link: "github.com/priyaraman/ledgerlite",
      techStack: "Next.js, Supabase, Stripe, Tailwind CSS",
      bullets: [
        "Invoicing tool for freelancers with recurring billing and Stripe Checkout, used by 300 active users.",
        "Row-level security and webhook signature verification throughout.",
      ],
    },
  ],
  education,
}

const earlyCareerResume: ResumeData = {
  contact,
  summary:
    "Recent computer science graduate with internship experience in frontend development and a strong portfolio of shipped side projects. Looking for an associate engineer role on a product team that cares about craft.",
  skills: [
    { id: "sk-1", category: "Languages", skills: "JavaScript, TypeScript, Python, Java, SQL" },
    { id: "sk-2", category: "Frameworks", skills: "React, Node.js, Express, Flask" },
    { id: "sk-3", category: "Tools", skills: "Git, Docker, Postman, Figma" },
  ],
  experience: [
    {
      id: "exp-1",
      company: "Brightpath",
      role: "Software Engineering Intern",
      location: "Portland, OR",
      startDate: "Jun 2017",
      endDate: "Sep 2017",
      bullets: [
        "Built a customer feedback widget in React used on 3 marketing pages, collecting 2,400 responses in the first month.",
        "Fixed 25+ UI bugs across the web app and added unit tests that raised coverage on the touched modules from 40% to 75%.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "CampusCarpool",
      link: "github.com/priyaraman/campuscarpool",
      techStack: "React, Express, PostgreSQL",
      bullets: [
        "Ride-sharing app for 3,000 students with real-time seat matching, adopted by two student organizations.",
        "Won first place at the University of Washington 2017 hackathon out of 62 teams.",
      ],
    },
  ],
  education,
}

const DAY = 24 * 60 * 60 * 1000

export function buildGuestSampleResumes(now = Date.now()) {
  const entries: { title: string; data: ResumeData; createdDaysAgo: number; updatedDaysAgo: number }[] = [
    { title: "Senior Frontend Engineer", data: frontendResume, createdDaysAgo: 21, updatedDaysAgo: 0.1 },
    { title: "Full-Stack Engineer – Fintech", data: fullStackResume, createdDaysAgo: 12, updatedDaysAgo: 3 },
    { title: "New Grad – Software Engineer", data: earlyCareerResume, createdDaysAgo: 40, updatedDaysAgo: 16 },
  ]

  return entries.map((entry) => ({
    id: crypto.randomUUID(),
    title: entry.title,
    data: entry.data,
    created_at: new Date(now - entry.createdDaysAgo * DAY).toISOString(),
    updated_at: new Date(now - entry.updatedDaysAgo * DAY).toISOString(),
    user_id: "guest",
  }))
}
