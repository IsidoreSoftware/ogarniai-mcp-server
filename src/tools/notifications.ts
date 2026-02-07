import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";
import { GuidSchema } from "../schemas/common.js";

export function registerNotificationTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_notifications",
    {
      title: "List Notifications",
      description: `List user notifications with optional filters.

Args:
  - isRead (boolean, optional): Filter by read status
  - type (string, optional): Filter by type - "Error", "Warning", "Info", or "Success"
  - category (string, optional): Filter by category - "DocumentProcessing", "WeeklySummary", "System", or "DuplicateDetection"
  - pageSize (number, optional): Items per page (default: 50)
  - pageNumber (number, optional): Page number (default: 1)

Returns: JSON array of notifications with id, type, category, title, message, isRead, isUrgent, actionUrl`,
      inputSchema: z
        .object({
          isRead: z.boolean().optional().describe("Filter by read status"),
          type: z
            .enum(["Error", "Warning", "Info", "Success"])
            .optional()
            .describe("Filter by notification type"),
          category: z
            .enum([
              "DocumentProcessing",
              "WeeklySummary",
              "System",
              "DuplicateDetection",
            ])
            .optional()
            .describe("Filter by notification category"),
          pageSize: z
            .number()
            .int()
            .min(1)
            .max(100)
            .default(50)
            .describe("Items per page"),
          pageNumber: z
            .number()
            .int()
            .min(1)
            .default(1)
            .describe("Page number"),
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
        const { data } = await apiGet<unknown>("/api/Notifications", {
          isRead: params.isRead,
          type: params.type,
          category: params.category,
          pageSize: params.pageSize,
          pageNumber: params.pageNumber,
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
    "ogarniai_get_notification",
    {
      title: "Get Notification Details",
      description: `Get details of a specific notification.

Args:
  - id (string): Notification ID (UUID format)

Returns: JSON with notification details including id, type, category, title, message, isRead, isUrgent, referenceId, actionUrl`,
      inputSchema: z.object({ id: GuidSchema }).strict(),
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
          `/api/Notifications/${params.id}`
        );
        return {
          content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "ogarniai_get_unread_count",
    {
      title: "Get Unread Notification Count",
      description: `Get the count of unread notifications.

Returns: JSON with count (number) of unread notifications`,
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
          "/api/Notifications/unread-count"
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
