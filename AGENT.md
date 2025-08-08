# Bugbutler Agent

Bugbutler is an autonomous error-fixing agent that listens to Sentry, diagnoses issues, writes safe fixes, and opens GitHub PRs — all while keeping developers in the loop via Slack.

## Build and commands

- Typecheck and lint: `pnpm check`
- Fix linting and formatting: `pnpm check:fix`
- Fix linting and formatting (unsafe): `pnpm check:fixall`
- Start the dev server: `pnpm dev`

## Development Environment

- Listener: `http://localhost:57000`

## Code Style

- TypeScript
- Tabs for indentation
- Single quotes, semicolons
- Use JSDoc for docstrings
- 100 character line length
- Use `kebab-case` for filenames, including React components

## Testing

- Plan to use vitest for unit testing

## Architecture

- Listener: H3.js v2.0 (beta) with oRPC routing
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS
- Package management: pnpm

## Security

- Never commit secrets to the repository
- Follow principles of least privilege
