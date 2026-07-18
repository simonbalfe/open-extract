import { expect, test } from "bun:test";
import { extractStructuredData, htmlToMarkdown } from "../src/index.ts";

const PAGE = `<html><head>
  <meta name="description" content="Acme company profile.">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Acme","numberOfEmployees":{"@type":"QuantitativeValue","value":220},"foundingDate":"2016","url":"https://acme.test"}</script>
  </head><body>
  <nav><a href="/about">About</a></nav>
  <main>
    <h1>Acme Pricing</h1>
    <p>Choose the plan that fits your team. Every subscription includes a fourteen day free trial with no credit card required.</p>
    <table><tr><th>Plan</th><th>Price</th></tr><tr><td>Starter</td><td>$10/mo</td></tr></table>
    <p>Read <a href="/terms">our terms</a> or follow <a href="https://social.test/acme">social updates</a>.</p>
  </main>
  <footer>Copyright Acme</footer>
  </body></html>`;

test("extractStructuredData renders useful metadata", () => {
  const result = extractStructuredData(PAGE);
  expect(result).toContain("Description: Acme company profile.");
  expect(result).toContain("name: Acme");
  expect(result).toContain("employees: 220");
  expect(result).toContain("founded: 2016");
});

test("htmlToMarkdown keeps content and removes page chrome", () => {
  const result = htmlToMarkdown(PAGE, "https://acme.test/pricing");
  expect(result).toContain("# Acme Pricing");
  expect(result).toContain("fourteen day free trial");
  expect(result).toContain("| Starter | $10/mo |");
  expect(result).toContain("[our terms](https://acme.test/terms)");
  expect(result).not.toContain("About");
  expect(result).not.toContain("Copyright Acme");
  expect(result).not.toContain("social.test");
});

test("htmlToMarkdown handles empty input", () => {
  expect(htmlToMarkdown("", "https://example.com")).toBe("");
});
