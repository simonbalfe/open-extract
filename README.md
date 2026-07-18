# Open Extract

Standalone Bun and TypeScript URL-to-Markdown extraction library and CLI.

## Install

```bash
bun add open-extract
```

## TypeScript

The extraction input is one URL:

```ts
import { extract } from "open-extract";

const result = await extract("https://example.com");

if (result.outcome === "ok") {
  console.log(result.content);
}
```

## CLI

```bash
open-extract https://example.com
```

The CLI writes an `ExtractResult` as JSON to stdout and exits non-zero when extraction does not succeed.

## Retrieval order

1. impit HTTP retrieval
2. Patchright rendered browser
3. Patchright with proxy
4. Patchright with proxy and challenge solver
5. Tavily Extract

Set `PATCHRIGHT_URL` to the Patchright service URL. It defaults to `http://localhost:9223`; set it to an empty value to disable browser fallbacks. Set `TAVILY_API_KEY` to enable the final managed fallback.

## Scope

Open Extract owns URL retrieval, HTML and PDF extraction, page usability detection, Markdown conversion, and fallback selection. It intentionally has no search, caching, cost accounting, URL provenance, database, persistent state, or orchestration-framework dependency.
