import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerProfileTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_get_recurring_expenses",
    {
      title: "List Recurring Expenses",
      description: `List recurring expenses (subscriptions, bills, regular payments).

Args:
  - includeInactive (boolean, optional): Include inactive recurring expenses (default: false)

Returns: JSON array of recurring expenses with id, name, description, frequency (Weekly/Monthly/Quarterly/Yearly), category, subcategory, paymentType, nextOccurrenceDate, isActive`,
      inputSchema: z
        .object({
          includeInactive: z
            .boolean()
            .default(false)
            .describe("Include inactive recurring expenses"),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const { data } = await apiGet<unknown>("/api/RecurringExpenses", {
          includeInactive: params.includeInactive,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
