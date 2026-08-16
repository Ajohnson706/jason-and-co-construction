import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finish carpentry website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Jason &amp; Co\. Construction \| Finish Carpentry &amp; New Construction<\/title>/i);
  assert.match(html, /The details that/);
  assert.match(html, /Finish carpentry · New construction/);
  assert.match(html, /href="tel:\+17064965687"/);
  assert.match(html, /jasonandco\.jason@gmail\.com/);
  assert.match(html, /application\/ld\+json/);
  assert.doesNotMatch(html, /To be added for launch|Demo edition|Bathroom remodeling/i);
});

test("ships the carpentry portfolio assets and production metadata", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /New-construction trim/);
  assert.match(page, /Built-ins &amp; cabinetry/);
  assert.match(layout, /Finish Carpentry & New Construction/);
  assert.match(layout, /canonical: "https:\/\/jasonandcoconstruction\.com\/"/);

  await Promise.all([
    "cabinet-installation.webp",
    "custom-cabinet-build.webp",
    "cabinetry-detail.webp",
    "woodwork-fabrication.webp",
    "fireplace-mantel.webp",
    "fireplace-trim.webp",
  ].map((name) => access(new URL(`../public/images/${name}`, import.meta.url))));
});
