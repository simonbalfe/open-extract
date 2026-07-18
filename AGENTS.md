# Open Extract

Standalone Bun and TypeScript URL-to-Markdown extraction library and CLI.

## Commands

- `bun install`
- `bun test`
- `bun run typecheck`
- `bun run cli -- https://example.com`

## Boundaries

- The public extraction input is one URL.
- Keep this project independent of consumers and orchestration frameworks.
- Do not add search, caching, cost accounting, URL provenance, databases, or persistent state.
- Do not add explanatory comments to source. Keep rationale in Markdown documentation.
- Never hardcode credentials. Optional providers use environment variables.
