import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const serverPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));

function createTransport() {
  return new StdioClientTransport({
    command: process.execPath,
    args: [serverPath],
    env: {
      OGARNIAI_API_TOKEN: "oai_protocol_test",
      OGARNIAI_API_URL: "http://127.0.0.1:1",
    },
    stderr: "ignore",
  });
}

test("serves MCP 2026-07-28 over stdio", async () => {
  const client = new Client(
    { name: "ogarniai-modern-test", version: "1.0.0" },
    { versionNegotiation: { mode: { pin: "2026-07-28" } } }
  );

  try {
    await client.connect(createTransport());

    assert.equal(client.getProtocolEra(), "modern");
    assert.equal(client.getServerVersion()?.version, "2.0.0");

    const { tools } = await client.listTools();
    assert.ok(tools.some(({ name }) => name === "ogarniai_list_documents"));
    assert.ok(tools.every(({ annotations }) => annotations?.readOnlyHint));
  } finally {
    await client.close();
  }
});

test("continues serving legacy MCP clients", async () => {
  const client = new Client({
    name: "ogarniai-legacy-test",
    version: "1.0.0",
  });

  try {
    await client.connect(createTransport());

    assert.equal(client.getProtocolEra(), "legacy");
    const { tools } = await client.listTools();
    assert.ok(tools.some(({ name }) => name === "ogarniai_list_documents"));
  } finally {
    await client.close();
  }
});
