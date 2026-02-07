import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";

export function registerDeduplicationTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_dedup_suggestions",
    {
      title: "List Deduplication Suggestions",
      description: `List duplicate document suggestions detected by the system.

Returns pairs of documents that may be duplicates, with confidence scores and matching reasons.

Returns: JSON array of suggestions with id, sourceDocumentId, targetDocumentId, confidenceScore (0-1), matchReason, status (Pending/Accepted/Rejected/Dismissed)`,
      inputSchema: z.object({}).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        const { data } = await apiGet<unknown>(
          "/api/Deduplication/suggestions"
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
