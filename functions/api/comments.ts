import { assertSameOrigin, handleError, json, methodNotAllowed, readJson, RequestError } from "../_lib/http";
import {
  assertBlogPath,
  assertHumanTiming,
  cleanLocale,
  cleanText,
  createFingerprint,
} from "../_lib/security";
import type { CommentPayload, Env } from "../_lib/types";

const MAXIMUM_COMMENTS_PER_HOUR = 5;

interface CommentRow {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
}

async function listComments(request: Request, env: Env) {
  const page = assertBlogPath(new URL(request.url).searchParams.get("page"));
  const result = await env.DB.prepare(
    `SELECT id, author_name, message, created_at
     FROM comments
     WHERE page_path = ? AND status = 'approved'
     ORDER BY created_at ASC`,
  ).bind(page).all<CommentRow>();

  return json(
    {
      ok: true,
      comments: (result.results ?? []).map((comment) => ({
        id: comment.id,
        name: comment.author_name,
        message: comment.message,
        createdAt: comment.created_at,
      })),
    },
    200,
    { "cache-control": "no-store" },
  );
}

async function submitComment(context: EventContext<Env, string, unknown>) {
  if (!assertSameOrigin(context.request)) return json({ ok: false, error: "Invalid origin" }, 403);
  const payload = await readJson<CommentPayload>(context.request);

  if (payload.website) {
    return json({ ok: true, accepted: true, moderation: "pending" }, 202);
  }

  assertHumanTiming(payload.startedAt);
  const page = assertBlogPath(payload.page);
  const name = cleanText(payload.name, "Name", 1, 60);
  const message = cleanText(payload.message, "Comment", 2, 2_000);
  const locale = cleanLocale(payload.locale);
  const fingerprint = await createFingerprint(context.request, context.env);

  const recent = await context.env.DB.prepare(
    "SELECT COUNT(*) AS count FROM comments WHERE fingerprint = ? AND created_at >= datetime('now', '-1 hour')",
  ).bind(fingerprint).first<{ count: number }>();

  if ((recent?.count ?? 0) >= MAXIMUM_COMMENTS_PER_HOUR) {
    throw new RequestError("Too many comments. Please try again later", 429);
  }

  const id = crypto.randomUUID();
  await context.env.DB.prepare(
    `INSERT INTO comments
     (id, page_path, author_name, message, locale, fingerprint)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).bind(id, page, name, message, locale, fingerprint).run();

  return json({ ok: true, accepted: true, moderation: "pending", id }, 202);
}

export const onRequest: PagesFunction<Env> = async (context) => {
  try {
    if (context.request.method === "GET") return await listComments(context.request, context.env);
    if (context.request.method === "POST") return await submitComment(context);
    return methodNotAllowed(["GET", "POST"]);
  } catch (error) {
    return handleError(error);
  }
};
