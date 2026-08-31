// One-time setup: creates two demo accounts with realistic resume data for
// product demos. Run locally with your service-role key -- it is only ever
// read from your shell's environment, never written to any file, and never
// sent anywhere but Supabase's own API.
//
//   SUPABASE_SERVICE_ROLE_KEY=<your key> node scripts/seed-demo-users.mjs
//
// Two personas covering distinct use cases:
//   - Sarah Chen: a complete, polished resume -- every section filled, shows
//     the app at its best (readiness checklist all-green, full preview).
//   - Marcus Reed: a deliberately partial resume (no projects, thin skills) --
//     shows the readiness checklist and section-guidance UI doing real work
//     flagging what's missing, not just the happy path.
//
// Passwords are intentionally hardcoded and committed -- these are throwaway
// demo fixtures, not real secrets: low-privilege accounts that (via this
// app's RLS policies) can only ever touch their own resumes.

import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your shell first.")
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey)

const DEMO_USERS = [
  {
    email: "demo.sarah@resumebuilder.test",
    password: "Demo-Fixture-Only-Not-A-Real-Secret-2026",
    resumeTitle: "Senior Software Engineer Resume",
    template: "modern",
    data: {
      contact: {
        name: "Sarah Chen",
        email: "sarah.chen@example.com",
        phone: "(415) 555-0182",
        linkedin: "linkedin.com/in/sarahchen",
        github: "github.com/sarahchen",
        location: "San Francisco, CA",
      },
      summary:
        "Senior Software Engineer with 7+ years building high-throughput backend systems and leading cross-functional teams. Specializes in distributed systems, API design, and mentoring junior engineers. Shipped systems handling 50M+ daily requests at scale.",
      skills: [
        { id: "sk1", category: "Languages", skills: "TypeScript, Python, Go, SQL" },
        { id: "sk2", category: "Backend", skills: "Node.js, PostgreSQL, Redis, Kafka, gRPC" },
        { id: "sk3", category: "Infrastructure", skills: "AWS, Docker, Kubernetes, Terraform" },
        { id: "sk4", category: "Practices", skills: "System Design, Code Review, Mentorship, CI/CD" },
      ],
      experience: [
        {
          id: "ex1",
          company: "Nimbus Data",
          role: "Senior Software Engineer",
          location: "San Francisco, CA",
          startDate: "Jun 2022",
          endDate: "Present",
          bullets: [
            "Led redesign of the event-ingestion pipeline, cutting p99 latency from 800ms to 120ms while handling 3x traffic growth",
            "Mentored 4 junior engineers through structured code review and pairing, with 3 promoted within 18 months",
            "Designed and shipped a multi-tenant rate-limiting service adopted by 12 internal teams, reducing incident-related API abuse by 90%",
          ],
        },
        {
          id: "ex2",
          company: "Brightline Logistics",
          role: "Software Engineer",
          location: "Oakland, CA",
          startDate: "Aug 2019",
          endDate: "May 2022",
          bullets: [
            "Built the core routing-optimization service in Go, reducing average delivery time estimates error by 22%",
            "Migrated a monolithic Rails app to a microservices architecture over 9 months with zero customer-facing downtime",
            "Introduced automated integration testing, cutting regression bugs reaching production by 60%",
          ],
        },
      ],
      projects: [
        {
          id: "pr1",
          name: "OpenQueue",
          link: "github.com/sarahchen/openqueue",
          techStack: "Go, PostgreSQL, gRPC",
          bullets: [
            "Built an open-source, Postgres-backed job queue as a lightweight alternative to Redis-based queues for small teams",
            "Reached 800+ GitHub stars and adoption by 15+ production projects",
          ],
        },
      ],
      education: [
        {
          id: "ed1",
          school: "University of California, Berkeley",
          degree: "B.S. in Electrical Engineering & Computer Science",
          startDate: "Aug 2015",
          endDate: "May 2019",
          details: "Graduated with Honors. Relevant coursework: Distributed Systems, Database Systems, Algorithms.",
        },
      ],
    },
  },
  {
    email: "demo.marcus@resumebuilder.test",
    password: "Demo-Fixture-Only-Not-A-Real-Secret-2026",
    resumeTitle: "Product Manager Transition Resume",
    template: "modern",
    // Deliberately partial: no projects, one thin skills entry, one short
    // experience entry -- exercises the readiness checklist and section
    // guidance flagging real gaps instead of only ever showing a green state.
    data: {
      contact: {
        name: "Marcus Reed",
        email: "marcus.reed@example.com",
        phone: "",
        linkedin: "linkedin.com/in/marcusreed",
        github: "",
        location: "Austin, TX",
      },
      summary: "Customer success professional transitioning into product management.",
      skills: [{ id: "sk1", category: "Tools", skills: "Jira, Figma, SQL (basic)" }],
      experience: [
        {
          id: "ex1",
          company: "Loop Analytics",
          role: "Senior Customer Success Manager",
          location: "Austin, TX",
          startDate: "Mar 2021",
          endDate: "Present",
          bullets: [
            "Managed a portfolio of 40+ enterprise accounts",
            "Worked closely with product team on feature requests",
          ],
        },
      ],
      projects: [],
      education: [
        {
          id: "ed1",
          school: "University of Texas at Austin",
          degree: "B.A. in Communications",
          startDate: "Aug 2015",
          endDate: "May 2019",
          details: "",
        },
      ],
    },
  },
]

for (const demo of DEMO_USERS) {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
  if (listError) {
    console.error("Failed to list users:", listError.message)
    process.exit(1)
  }

  let userId = existingUsers?.users?.find((u) => u.email === demo.email)?.id

  if (userId) {
    console.log(`User ${demo.email} already exists (${userId}).`)
  } else {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: demo.email,
      password: demo.password,
      email_confirm: true,
    })
    if (createError) {
      console.error(`Failed to create ${demo.email}:`, createError.message)
      process.exit(1)
    }
    userId = created.user.id
    console.log(`Created user ${demo.email} (${userId}).`)
  }

  const { data: existingResumes, error: resumeListError } = await supabase
    .from("resumes")
    .select("id")
    .eq("user_id", userId)
    .eq("title", demo.resumeTitle)

  if (resumeListError) {
    console.error(`Failed to check existing resumes for ${demo.email}:`, resumeListError.message)
    process.exit(1)
  }

  if (existingResumes && existingResumes.length > 0) {
    console.log(`Resume "${demo.resumeTitle}" already exists for ${demo.email}. Skipping insert.`)
    continue
  }

  const { error: insertError } = await supabase.from("resumes").insert({
    user_id: userId,
    title: demo.resumeTitle,
    template: demo.template,
    data: demo.data,
  })

  if (insertError) {
    console.error(`Failed to insert resume for ${demo.email}:`, insertError.message)
    process.exit(1)
  }

  console.log(`Seeded resume "${demo.resumeTitle}" for ${demo.email}.`)
}

console.log("\nDemo accounts ready:")
for (const demo of DEMO_USERS) {
  console.log(`  ${demo.email} / ${demo.password}`)
}
