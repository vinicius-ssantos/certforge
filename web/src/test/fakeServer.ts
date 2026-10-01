/** A stand-in for the backend, for tests: a table of handlers behind a fetch function. */
export interface FakeRequest {
  method: string;
  path: string;
  query: URLSearchParams;
  headers: Headers;
  body: unknown;
}

export interface FakeReply {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

export type Handler = FakeReply | ((request: FakeRequest) => FakeReply | Promise<FakeReply>);

export interface FakeFetch {
  (input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  /** Every request made so far. */
  calls: FakeRequest[];
  /** Replace or add handlers while a test runs. */
  on(key: string, handler: Handler): void;
}

/** Problem body in the shape the backend produces. */
export function problem(status: number, code: string, extra: Record<string, unknown> = {}): FakeReply {
  return {
    status,
    headers: { "content-type": "application/problem+json", "x-request-id": "req-test-0001" },
    body: { type: "about:blank", title: code, status, code, requestId: "req-test-0001", ...extra },
  };
}

/** Handlers are keyed by "METHOD /exact/path". An unhandled request fails the test loudly. */
export function fakeFetch(routes: Record<string, Handler> = {}): FakeFetch {
  const table = new Map(Object.entries(routes));
  const calls: FakeRequest[] = [];

  const fn = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = input instanceof Request ? input : new Request(new URL(String(input), "http://app.test"), init);
    const url = new URL(request.url);
    const text = request.method === "GET" || request.method === "HEAD" ? "" : await request.clone().text();
    const fake: FakeRequest = {
      method: request.method,
      path: url.pathname,
      query: url.searchParams,
      headers: request.headers,
      body: text ? JSON.parse(text) : undefined,
    };
    calls.push(fake);
    const handler = table.get(`${fake.method} ${fake.path}`);
    if (!handler) {
      throw new Error(`Unhandled request in test: ${fake.method} ${fake.path}`);
    }
    const reply = typeof handler === "function" ? await handler(fake) : handler;
    const status = reply.status ?? 200;
    const noBody = status === 204 || reply.body === undefined;
    return new Response(noBody ? null : JSON.stringify(reply.body), {
      status,
      headers: { ...(noBody ? {} : { "content-type": "application/json" }), ...reply.headers },
    });
  }) as FakeFetch;

  fn.calls = calls;
  fn.on = (key, handler) => {
    table.set(key, handler);
  };
  return fn;
}
