import { assertSameOrigin, handleError, json, methodNotAllowed, readJson, RequestError } from "../_lib/http";
import {
  assertEmail,
  assertHumanTiming,
  cleanLocale,
  cleanText,
  createFingerprint,
} from "../_lib/security";
import type { ContactPayload, Env } from "../_lib/types";

const MAXIMUM_MESSAGES_PER_HOUR = 3;

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") return methodNotAllowed(["POST"]);
  if (!assertSameOrigin(context.request)) return json({ ok: false, error: "Invalid origin" }, 403);

  try {
    const payload = await readJson<ContactPayload>(context.request);

    if (payload.website) {
      return json({ ok: true, accepted: true }, 202);
    }

    assertHumanTiming(payload.startedAt);
    const name = cleanText(payload.name, "Name", 1, 80);
    const email = assertEmail(cleanText(payload.email, "Email", 3, 254));
    const subject = cleanText(payload.subject, "Subject", 1, 120);
    const message = cleanText(payload.message, "Message", 10, 5_000);
    const locale = cleanLocale(payload.locale);
    const fingerprint = await createFingerprint(context.request, context.env);

    const recent = await context.env.DB.prepare(
      "SELECT COUNT(*) AS count FROM contact_messages WHERE fingerprint = ? AND created_at >= datetime('now', '-1 hour')",
    ).bind(fingerprint).first<{ count: number }>();

    if ((recent?.count ?? 0) >= MAXIMUM_MESSAGES_PER_HOUR) {
      throw new RequestError("Too many messages. Please try again later", 429);
    }

    const record = {
      id: crypto.randomUUID(),
      name,
      email,
      subject,
      message,
      locale,
      fingerprint,
    };

    await context.env.DB.prepare(
      `INSERT INTO contact_messages
       (id, name, email, subject, message, locale, fingerprint)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      record.id,
      record.name,
      record.email,
      record.subject,
      record.message,
      record.locale,
      record.fingerprint,
    ).run();

    if (context.env.CONTACT_WEBHOOK_URL) {
      context.waitUntil(fetch(context.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          name: record.name,
          email: record.email,
          subject: record.subject,
          message: record.message,
          locale: record.locale,
        }),
      }).catch((error) => console.error("Contact webhook failed", error)));
    }

    return json({ ok: true, accepted: true, id: record.id }, 202);
  } catch (error) {
    return handleError(error);
  }
};
