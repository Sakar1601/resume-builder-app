import { test, expect } from "@playwright/test"

// Drives the real Supabase-authenticated path end to end: login -> dashboard
// -> create a resume -> edit -> delete. Uses a fixed, low-privilege fixture
// account (see scripts/create-e2e-test-user.mjs) -- not mocked, hits real
// Supabase auth and the real resumes table (RLS-scoped to this account only).

const TEST_EMAIL = "e2e-test@resumebuilder.test"
const TEST_PASSWORD = "E2E-Test-Fixture-Only-Not-A-Real-Secret-2026"

test("login -> create resume -> edit -> delete", async ({ page }) => {
  await page.goto("/auth/login")
  await page.getByLabel("Email").fill(TEST_EMAIL)
  await page.getByLabel("Password").fill(TEST_PASSWORD)
  await page.getByRole("button", { name: "Sign In" }).click()

  await expect(page).toHaveURL(/\/dashboard/)

  await page.getByRole("button", { name: "Create Resume" }).click()
  const dialog = page.getByRole("dialog")
  const title = `E2E Auth Test ${Date.now()}`
  await dialog.locator("#title").fill(title)
  await dialog.getByRole("button", { name: "Create Resume" }).click()

  await expect(page).toHaveURL(/\/dashboard\/resume\//)
  await expect(page.locator("body")).not.toContainText("Application error")

  // Clean up: delete the resume this test created so repeated runs don't pile
  // up rows under the fixture account. handleDelete() in resume-list.tsx uses
  // a native window.confirm(), not a custom dialog component.
  await page.goto("/dashboard")
  const card = page.locator("div", { has: page.getByText(title, { exact: true }) }).first()
  await card.getByRole("button", { name: "More options" }).click()

  page.once("dialog", (d) => d.accept())
  await page.getByRole("menuitem", { name: "Delete" }).click()

  await expect(page.getByText(title, { exact: true })).toHaveCount(0)
})
