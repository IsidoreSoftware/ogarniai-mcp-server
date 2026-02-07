import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { DEFAULT_API_URL } from "../constants.js";

let client: AxiosInstance | null = null;

function getClient(): AxiosInstance {
  if (!client) {
    const token = process.env.OGARNIAI_API_TOKEN;
    if (!token) {
      throw new Error(
        "OGARNIAI_API_TOKEN environment variable is required. " +
          "Create a token at https://app.ogarni.ai → Settings → API Tokens."
      );
    }

    const baseURL = process.env.OGARNIAI_API_URL || DEFAULT_API_URL;

    client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "X-API-Key": token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
  }
  return client;
}

export interface ApiResponse<T> {
  data: T;
  rateLimitRemaining?: number;
  rateLimitLimit?: number;
  rateLimitResetAfter?: number;
}

function extractRateLimitInfo(response: AxiosResponse): {
  rateLimitRemaining?: number;
  rateLimitLimit?: number;
  rateLimitResetAfter?: number;
} {
  return {
    rateLimitRemaining: response.headers["x-ratelimit-remaining"]
      ? parseInt(response.headers["x-ratelimit-remaining"])
      : undefined,
    rateLimitLimit: response.headers["x-ratelimit-limit"]
      ? parseInt(response.headers["x-ratelimit-limit"])
      : undefined,
    rateLimitResetAfter: response.headers["x-ratelimit-reset-after"]
      ? parseInt(response.headers["x-ratelimit-reset-after"])
      : undefined,
  };
}

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<ApiResponse<T>> {
  const response = await getClient().get<T>(endpoint, { params });
  return {
    data: response.data,
    ...extractRateLimitInfo(response),
  };
}

export async function apiGetRaw(
  endpoint: string
): Promise<{ data: Buffer; contentType: string }> {
  const response = await getClient().get(endpoint, {
    responseType: "arraybuffer",
  });
  return {
    data: response.data as Buffer,
    contentType: response.headers["content-type"] || "application/octet-stream",
  };
}

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      const body = error.response.data;
      const message =
        typeof body === "object" && body?.message
          ? body.message
          : typeof body === "string"
            ? body
            : undefined;

      switch (status) {
        case 401:
          return "Error: Invalid or expired API token. Check your OGARNIAI_API_TOKEN.";
        case 403:
          return "Error: Insufficient permissions. Your token may lack the required scope.";
        case 404:
          return "Error: Resource not found. Please check the ID is correct.";
        case 429: {
          const retryAfter = error.response.headers["retry-after"];
          return `Error: Rate limit exceeded. Try again in ${retryAfter || "a few"} seconds.`;
        }
        default:
          return `Error: API request failed (${status})${message ? `: ${message}` : ""}`;
      }
    } else if (error.code === "ECONNABORTED") {
      return "Error: Request timed out. The API may be temporarily unavailable.";
    } else if (error.code === "ECONNREFUSED") {
      return "Error: Could not connect to the API. Check OGARNIAI_API_URL.";
    }
  }
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
