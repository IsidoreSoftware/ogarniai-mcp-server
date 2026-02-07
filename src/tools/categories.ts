import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerCategoryTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_categories",
    {
      title: "List Categories",
      description: `List all available expense/income categories and subcategories.

Returns the full category tree with Polish and English names, emojis, and subcategories with descriptions and examples.

Returns: JSON with categories[], each containing: polishName, englishName, emoji, subCategories[] with polishName, englishName, description, examples, emoji`,
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
        const { data } = await apiGet<unknown>("/api/Categories");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "ogarniai_list_tags",
    {
      title: "List Tags",
      description: `List all user-defined tags for organizing documents.

Returns: JSON array of tags with id, name, and authorId`,
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
        const { data } = await apiGet<unknown>("/api/Tags");
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );
}
