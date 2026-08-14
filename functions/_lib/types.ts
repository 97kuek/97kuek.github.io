export interface Env {
  DB: D1Database;
  SPAM_SALT?: string;
  CONTACT_WEBHOOK_URL?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: "ja" | "en";
  website?: string;
  startedAt: number;
}

export interface CommentPayload {
  page: string;
  name: string;
  message: string;
  locale: "ja" | "en";
  website?: string;
  startedAt: number;
}
