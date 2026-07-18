import { afterAll, beforeAll, expect, test } from "bun:test";
import { extract } from "../src/index.ts";

let server: ReturnType<typeof Bun.serve>;
let originalPatchright: string | undefined;
let originalTavily: string | undefined;

beforeAll(() => {
  originalPatchright = process.env.PATCHRIGHT_URL;
  originalTavily = process.env.TAVILY_API_KEY;
  process.env.PATCHRIGHT_URL = "";
  process.env.TAVILY_API_KEY = "";
  server = Bun.serve({
    port: 0,
    fetch(request) {
      const path = new URL(request.url).pathname;
      if (path === "/missing") return new Response("missing", { status: 404 });
      return new Response(
        `<html><body><main><h1>Local extraction</h1><p>${"This is useful page content for extraction. ".repeat(12)}</p></main></body></html>`,
        { headers: { "content-type": "text/html" } },
      );
    },
  });
});

afterAll(() => {
  server.stop(true);
  if (originalPatchright === undefined) delete process.env.PATCHRIGHT_URL;
  else process.env.PATCHRIGHT_URL = originalPatchright;
  if (originalTavily === undefined) delete process.env.TAVILY_API_KEY;
  else process.env.TAVILY_API_KEY = originalTavily;
});

test("extract accepts one URL and returns clean content", async () => {
  const result = await extract(`http://localhost:${server.port}/page`);
  expect(result.outcome).toBe("ok");
  expect(result.provider).toBe("impit");
  expect(result.contentType).toBe("html");
  expect(result.content).toContain("# Local extraction");
  expect(result.attempts[0]?.outcome).toBe("ok");
});

test("extract classifies a missing page as dead", async () => {
  const result = await extract(`http://localhost:${server.port}/missing`);
  expect(result.outcome).toBe("dead");
  expect(result.content).toBe("");
  expect(result.attempts).toHaveLength(1);
  expect(result.attempts[0]?.detail).toBe("HTTP 404");
});

test("extract rejects non-http URLs", async () => {
  expect(extract("file:///tmp/page.html")).rejects.toThrow("URL must use http or https");
});
