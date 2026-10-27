// Runs Contentful migration scripts against a space.
//
//   npm run migrate -- contentful/migrations/001-create-content-model.cjs [--yes]
//
// Without --yes it prints the plan and asks before applying, which needs an interactive
// terminal. Pass --yes to apply without asking (CI, or Claude Code's `!` commands).
//
// Needs CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN in the environment (or in .env.local).
// CONTENTFUL_ENVIRONMENT defaults to "master".
import { runMigration } from 'contentful-migration'
import path from 'node:path'

const args = process.argv.slice(2)
const yes = args.includes('--yes') || process.env.CI === 'true'
const files = args.filter((arg) => arg !== '--yes')
const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_ENVIRONMENT = 'master',
} = process.env

if (files.length === 0) {
  console.error('Usage: npm run migrate -- <migration file> [...more files] [--yes]')
  process.exit(1)
}
if (!yes && !process.stdin.isTTY) {
  console.error('No interactive terminal to confirm the migration. Re-run with --yes to apply it.')
  process.exit(1)
}
if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error('CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set.')
  process.exit(1)
}

for (const file of files) {
  console.log(`\n→ ${file} (space ${CONTENTFUL_SPACE_ID}, environment ${CONTENTFUL_ENVIRONMENT})`)
  await runMigration({
    filePath: path.resolve(file),
    spaceId: CONTENTFUL_SPACE_ID,
    environmentId: CONTENTFUL_ENVIRONMENT,
    accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
    yes,
  })
}
