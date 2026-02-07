import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { apiGet, apiGetRaw, handleApiError } from "../services/api.js";
import { DateRangeSchema, GuidSchema } from "../schemas/common.js";

export function registerDocumentTools(server: McpServer): void {
  server.registerTool(
    "ogarniai_list_documents",
    {
      title: "List Purchase Documents",
      description: `List receipts and purchase documents with optional date filters and sorting.

Returns a paginated list of purchase documents (receipts, invoices, email purchases) with store name, total amount, items, categories, and tags.

Args:
  - from (string, optional): Start date filter (ISO 8601, e.g. "2024-01-01")
  - to (string, optional): End date filter (ISO 8601, e.g. "2024-12-31")
  - sortBy (string, optional): Sort field - "purchase_time" (default) or "created_at"
  - sortDirection (string, optional): Sort order - "desc" (default) or "asc"

Returns: JSON array of purchase documents with fields: id, storeName, purchaseTime, totalAmount, currency, items[], tags[], groupId, hasDuplicates`,
      inputSchema: z
        .object({
          ...DateRangeSchema,
          sortBy: z
            .enum(["purchase_time", "created_at"])
            .default("purchase_time")
            .describe("Field to sort by"),
          sortDirection: z
            .enum(["desc", "asc"])
            .default("desc")
            .describe("Sort direction"),
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
        const { data } = await apiGet<unknown>("/api/PurchaseDocuments/my", {
          from: params.from,
          to: params.to,
          sortBy: params.sortBy,
          sortDirection: params.sortDirection,
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
    "ogarniai_get_document",
    {
      title: "Get Purchase Document",
      description: `Get details of a single purchase document by ID.

Returns full document details including store name, purchase time, total amount, tax, currency, payment method, individual items with categories, tags, and duplicate info.

Args:
  - id (string): Document ID (UUID format)

Returns: JSON object with all document fields including items[] with name, price, quantity, category, subcategory`,
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
          `/api/PurchaseDocuments/${params.id}`
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
    "ogarniai_get_document_image",
    {
      title: "Get Document Image",
      description: `Get the scanned image of a purchase document (receipt photo).

Args:
  - id (string): Document ID (UUID format)

Returns: The receipt/document image as base64-encoded data`,
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
        const { data, contentType } = await apiGetRaw(
          `/api/PurchaseDocuments/${params.id}/image`
        );
        const base64 = Buffer.from(data).toString("base64");

        if (contentType.startsWith("image/")) {
          return {
            content: [
              {
                type: "image",
                data: base64,
                mimeType: contentType,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: "text",
              text: `Binary data (${contentType}), ${data.length} bytes`,
            },
          ],
        };
      } catch (error) {
        return { content: [{ type: "text", text: handleApiError(error) }] };
      }
    }
  );

  server.registerTool(
    "ogarniai_get_document_duplicates",
    {
      title: "Get Document Duplicates",
      description: `Get duplicate suggestions for a specific purchase document.

Args:
  - id (string): Document ID (UUID format)

Returns: JSON with duplicate document suggestions and confidence scores`,
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
          `/api/PurchaseDocuments/${params.id}/duplicates`
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
