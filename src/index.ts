#!/usr/bin/env node

/**
 * Ogarni.AI MCP Server
 *
 * Provides read-only access to Ogarni.AI personal finance data via the API.
 * Requires OGARNIAI_API_TOKEN environment variable.
 */

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { registerDocumentTools } from "./tools/documents.js";
import { registerCategoryTools } from "./tools/categories.js";
import { registerSummaryTools } from "./tools/summaries.js";
import { registerNotificationTools } from "./tools/notifications.js";
import { registerGroupTools } from "./tools/groups.js";
import { registerMailboxTools } from "./tools/mailboxes.js";
import { registerDeduplicationTools } from "./tools/deduplication.js";
import { registerLoyaltyTools } from "./tools/loyalty.js";
import { registerBankTools } from "./tools/banks.js";
import { registerProfileTools } from "./tools/profile.js";

function buildServer(): McpServer {
  const server = new McpServer({
    name: "ogarniai-mcp-server",
    version: "2.0.0",
  });

  registerDocumentTools(server);
  registerCategoryTools(server);
  registerSummaryTools(server);
  registerNotificationTools(server);
  registerGroupTools(server);
  registerMailboxTools(server);
  registerDeduplicationTools(server);
  registerLoyaltyTools(server);
  registerBankTools(server);
  registerProfileTools(server);

  return server;
}

async function main(): Promise<void> {
  if (!process.env.OGARNIAI_API_TOKEN) {
    console.error(
      "ERROR: OGARNIAI_API_TOKEN environment variable is required.\n" +
        "Create a token at https://app.ogarni.ai → Settings → API Tokens."
    );
    process.exit(1);
  }

  serveStdio(buildServer);
  console.error(
    "Ogarni.AI MCP server running via stdio (MCP 2026-07-28 and legacy clients)"
  );
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
