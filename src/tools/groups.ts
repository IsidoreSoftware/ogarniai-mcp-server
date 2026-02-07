import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";
import { GuidSchema } from "../schemas/common.js";

export function registerGroupTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_groups",
    {
      title: "List Groups",
      description: `List finance groups the user belongs to.

Groups allow sharing expenses with a partner or family members.

Args:
  - showArchived (boolean, optional): Include archived groups (default: false)

Returns: JSON array of groups with id, name, description, ownerId, isActive, isArchived, memberCount, createdAt`,
      inputSchema: z
        .object({
          showArchived: z
            .boolean()
            .optional()
            .describe("Include archived groups"),
        })
        .strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (params) => {
      try {
        const { data } = await apiGet<unknown>("/api/Groups", {
          showArchived: params.showArchived,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "ogarniai_get_group",
    {
      title: "Get Group Details",
      description: `Get details of a specific finance group.

Args:
  - groupId (string): Group ID (UUID format)

Returns: JSON with group details including id, name, description, owner, isActive, isArchived, memberCount`,
      inputSchema: z.object({ groupId: GuidSchema }).strict(),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const { data } = await apiGet<unknown>(
          `/api/Groups/${params.groupId}`
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
