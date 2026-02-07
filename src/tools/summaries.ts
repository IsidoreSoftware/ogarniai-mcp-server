import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, handleApiError } from "../services/api.js";
import { GuidSchema } from "../schemas/common.js";

export function registerSummaryTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_get_weekly_summary",
    {
      title: "Get Latest Weekly Summary",
      description: `Get the most recent weekly spending summary.

Returns a summary with period dates, total amount, daily breakdowns, category totals, and an AI-generated text summary.

Returns: JSON with periodStart, periodEnd, summary (text), dailySummaries[], categoryTotals[], totalAmount`,
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
          "/api/weekly-summaries/latest"
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
    "ogarniai_get_weekly_summary_periods",
    {
      title: "List Weekly Summary Periods",
      description: `List available weekly summary periods with pagination.

Args:
  - page (number, optional): Page number (default: 1)
  - pageSize (number, optional): Items per page (default: 10)

Returns: JSON array of period summaries with periodStart, periodEnd, totalAmount, summary text`,
      inputSchema: z
        .object({
          page: z.number().int().min(1).default(1).describe("Page number"),
          pageSize: z
            .number()
            .int()
            .min(1)
            .max(50)
            .default(10)
            .describe("Items per page"),
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
        const { data } = await apiGet<unknown>("/api/weekly-summaries", {
          page: params.page,
          pageSize: params.pageSize,
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
    "ogarniai_get_summary_by_period",
    {
      title: "Get Summary for Date Range",
      description: `Get a spending summary for a custom date range with configurable granularity.

Args:
  - startDate (string): Start date (ISO 8601, e.g. "2024-01-01")
  - endDate (string): End date (ISO 8601, e.g. "2024-01-31")
  - granularity (string, optional): Time granularity - "Day" (default), "Week", or "Month"

Returns: JSON with periodStart, periodEnd, totalAmount, dailySummaries[], categoryTotals[], detailedCategoryTotals[]`,
      inputSchema: z
        .object({
          startDate: z
            .string()
            .describe("Start date (ISO 8601, e.g. 2024-01-01)"),
          endDate: z
            .string()
            .describe("End date (ISO 8601, e.g. 2024-01-31)"),
          granularity: z
            .enum(["Day", "Week", "Month"])
            .default("Day")
            .describe("Time granularity for breakdown"),
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
        const { data } = await apiGet<unknown>("/api/summaries/periods", {
          startDate: params.startDate,
          endDate: params.endDate,
          granularity: params.granularity,
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
    "ogarniai_get_current_period",
    {
      title: "Get Current Period Summary",
      description: `Get spending summary for a preset period (current week, current month, etc.).

Args:
  - preset (string): Period preset - "current-week", "current-month", "last-week", or "last-month"
  - granularity (string, optional): Time granularity - "Day" (default), "Week", or "Month"

Returns: JSON with periodStart, periodEnd, totalAmount, dailySummaries[], categoryTotals[]`,
      inputSchema: z
        .object({
          preset: z
            .enum(["current-week", "current-month", "last-week", "last-month"])
            .describe("Period preset"),
          granularity: z
            .enum(["Day", "Week", "Month"])
            .default("Day")
            .describe("Time granularity for breakdown"),
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
        const { data } = await apiGet<unknown>("/api/summaries/presets", {
          preset: params.preset,
          granularity: params.granularity,
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
