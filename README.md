# Bugbutler

**Autonomous error-fixing agent** for your codebase.  
Listens to Sentry, diagnoses issues, writes safe fixes, and opens GitHub PRs — all while keeping you in the loop via Slack.

## How it works
1. **Listen** – Subscribes to Sentry error events in real time.  
2. **Triage** – Scores and prioritizes issues based on severity, impact, and risk.  
3. **Fix** – Generates small, tested patches (frontend, backend, or both).  
4. **Ship** – Opens PRs with full context and waits for your approval or auto-merges low‑risk fixes.  
5. **Learn** – Improves over time by remembering past fixes.

## Status
⚠️ Early development — expect rapid changes.

## Getting Started
```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```
