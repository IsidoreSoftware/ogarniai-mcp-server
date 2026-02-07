import { z } from "zod";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants.js";

export const PaginationSchema = {
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE)
    .describe("Number of items per page"),
  pageNumber: z
    .number()
    .int()
    .min(1)
    .default(1)
    .describe("Page number (1-based)"),
};

export const DateRangeSchema = {
  from: z
    .string()
    .optional()
    .describe("Start date filter (ISO 8601 format, e.g. 2024-01-01)"),
  to: z
    .string()
    .optional()
    .describe("End date filter (ISO 8601 format, e.g. 2024-12-31)"),
};

export const GuidSchema = z
  .string()
  .uuid("Must be a valid UUID/GUID")
  .describe("Resource ID (UUID format)");
