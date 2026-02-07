import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerLoyaltyTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_loyalty_accounts",
    {
      title: "List Loyalty Accounts",
      description: `List connected external loyalty program accounts (e.g. store loyalty cards).

Returns: JSON array of loyalty connections with id, program, maskedLogin, status, createdAt`,
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
        const { data } = await apiGet<unknown>("/api/external_loyalty");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
