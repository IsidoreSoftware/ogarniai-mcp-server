import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerBankTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_supported_banks",
    {
      title: "List Supported Banks",
      description: `List banks supported for bank statement import.

Returns: JSON array of supported bank names (strings)`,
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
        const { data } = await apiGet<unknown>(
          "/api/BankStatement/supported-banks"
        );
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
