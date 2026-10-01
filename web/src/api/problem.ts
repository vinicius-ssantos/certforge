/**
 * A failed API call, in the shape the backend promises: an RFC 9457 problem with a stable `code`
 * and a `requestId` that support can search the logs for. `status` is 0 when the server could not
 * be reached at all.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId: string | undefined;
  readonly retryAfterSeconds: number | undefined;
  readonly details: Record<string, unknown>;

  constructor(init: {
    status: number;
    code: string;
    title?: string;
    requestId?: string;
    retryAfterSeconds?: number;
    details?: Record<string, unknown>;
  }) {
    super(init.title ?? init.code);
    this.name = "ApiError";
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.retryAfterSeconds = init.retryAfterSeconds;
    this.details = init.details ?? {};
  }

  /** The server rejected the request because the learner is not signed in (any more). */
  get isUnauthenticated(): boolean {
    return this.status === 401;
  }

  get isNetworkFailure(): boolean {
    return this.status === 0;
  }
}

export function networkError(): ApiError {
  return new ApiError({ status: 0, code: "network_error", title: "The server could not be reached" });
}

/** Builds an ApiError from a problem body (any JSON) and the response it came with. */
export function problemToError(body: unknown, response: Response): ApiError {
  const problem = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const retryAfter = Number(response.headers.get("Retry-After"));
  const { code, title, requestId, ...details } = problem;
  const headerId = response.headers.get("X-Request-Id") ?? undefined;
  return new ApiError({
    status: response.status,
    code: typeof code === "string" ? code : "unexpected_error",
    ...(typeof title === "string" ? { title } : {}),
    ...(typeof requestId === "string" ? { requestId } : headerId ? { requestId: headerId } : {}),
    ...(Number.isFinite(retryAfter) && retryAfter > 0 ? { retryAfterSeconds: retryAfter } : {}),
    details,
  });
}

/** The outcome of an openapi-fetch call. */
interface Result<T> {
  data?: T;
  error?: unknown;
  response: Response;
}

/** Returns the data of a successful call or throws an ApiError. */
export async function unwrap<T>(call: Promise<Result<T>>): Promise<T> {
  let result: Result<T>;
  try {
    result = await call;
  } catch {
    throw networkError();
  }
  if (result.error !== undefined || !result.response.ok) {
    throw problemToError(result.error, result.response);
  }
  return result.data as T;
}

/** Like unwrap, for calls with no response body (for example 204). */
export async function unwrapVoid(call: Promise<Result<unknown>>): Promise<void> {
  await unwrap(call);
}
