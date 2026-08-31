// One-time setup: creates the fixed test account the authenticated e2e test
// signs in as. Run locally with your service-role key -- it is only ever
// read from your shell's environment, never written to any file, and never
// sent anywhere but Supabase's own API.
//
//   SUPABASE_SERVICE_ROLE_KEY=<your key> node scripts/create-e2e-test-user.mjs
//
// The account's password is intentionally hardcoded and committed below --
// it is a throwaway fixture, not a real secret: it belongs to a low-privilege
// account that (via this app's RLS policies) can only ever create/read/
// update/delete its own resumes, nothing else. Treat it like a test fixture,
// not a credential.

import { createClient } from "@supabase/supabase-js"

const EMAIL = "e2e-test@resumebuilder.test"
const PASSWORD = "E2E-Test-Fixture-Only-Not-A-Real-Secret-2026"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your shell first.")
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey)

const { data: existing, error: listError } = await supabase.auth.admin.listUsers()
if (listError) {
  console.error("Failed to list users:", listError.message)
  process.exit(1)
}

const alreadyExists = existing?.users?.some((u) => u.email === EMAIL)

if (alreadyExists) {
  console.log(`Test user ${EMAIL} already exists. Nothing to do.`)
  process.exit(0)
}

const { error } = await supabase.auth.admin.createUser({
  email: EMAIL,
  password: PASSWORD,
  email_confirm: true,
})

if (error) {
  console.error("Failed to create test user:", error.message)
  process.exit(1)
}

console.log(`Created test user ${EMAIL}.`)
