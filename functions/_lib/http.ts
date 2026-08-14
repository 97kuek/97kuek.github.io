const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
};

export function json(data: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

export function methodNotAllowed(allowed: string[]) {
  return json(
    { ok: false, error: "Method not allowed" },
    405,
    { allow: allowed.join(", ") },
  );
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export async function readJson<T>(request: Request, maximumBytes = 20_000) {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (!contentType.includes("application/json")) {
    throw new RequestError("Expected application/json", 415);
  }
  if (contentLength > maximumBytes) {
    throw new RequestError("Request body is too large", 413);
  }

  try {
    return (await request.json()) as T;
  } catch {
    throw new RequestError("Invalid JSON", 400);
  }
}

export class RequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export function handleError(error: unknown) {
  if (error instanceof RequestError) {
    return json({ ok: false, error: error.message }, error.status);
  }

  console.error(error);
  return json({ ok: false, error: "Internal server error" }, 500);
}
