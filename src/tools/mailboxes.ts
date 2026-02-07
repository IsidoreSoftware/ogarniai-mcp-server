import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerMailboxTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_mailboxes",
    {
      title: "List Inbound Mailboxes",
      description: `List inbound email addresses for forwarding purchase confirmation emails.

Users can forward emails from stores to these addresses for automatic receipt processing.

Returns: JSON array of mailboxes with id, address, localPart, domain, isPrimary, status, authMode, lastActivityAt`,
      inputSchema: z.object({}).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        const { data } = await apiGet<unknown>("/api/inbound-mailboxes");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
