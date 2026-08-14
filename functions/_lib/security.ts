import { RequestError } from "./http";
import type { Env } from "./types";

const MINIMUM_FORM_TIME_MS = 2_000;
const MAXIMUM_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

export function assertHumanTiming(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < MINIMUM_FORM_TIME_MS || elapsed > MAXIMUM_FORM_AGE_MS) {
    throw new RequestError("Please reload the form and try again", 429);
  }
}

export async function createFingerprint(request: Request, env: Env) {
  const address = request.headers.get("cf-connecting-ip") ?? "local";
  const agent = request.headers.get("user-agent") ?? "unknown";
  const salt = env.SPAM_SALT ?? "local-development-only";
  const bytes = new TextEncoder().encode(`${salt}:${address}:${agent}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function cleanText(value: unknown, field: string, minimum: number, maximum: number) {
  if (typeof value !== "string") throw new RequestError(`${field} is required`, 400);
  const normalized = value.trim().replace(/\r\n/g, "\n");
  if (normalized.length < minimum || normalized.length > maximum) {
    throw new RequestError(`${field} must be between ${minimum} and ${maximum} characters`, 400);
  }
  return normalized;
}

export function cleanLocale(value: unknown): "ja" | "en" {
  return value === "en" ? "en" : "ja";
}

export function assertEmail(value: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254) {
    throw new RequestError("A valid email address is required", 400);
  }
  return value;
}

export function assertBlogPath(value: unknown) {
  if (typeof value !== "string" || !/^\/blog\/[a-z0-9][a-z0-9-/]*\/$/.test(value) || value.length > 180) {
    throw new RequestError("Invalid comment page", 400);
  }
  return value;
}
