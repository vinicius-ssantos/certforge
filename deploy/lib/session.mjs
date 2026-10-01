// A small HTTP client with a cookie jar and the CSRF header, for the release scripts. Node's fetch
// keeps no cookies of its own.

export class Session {
  constructor(base) {
    this.base = base;
    this.cookies = new Map();
  }
  header() {
    return [...this.cookies].map(([name, value]) => `${name}=${value}`).join("; ");
  }
  remember(response) {
    for (const line of response.headers.getSetCookie?.() ?? []) {
      const [pair] = line.split(";");
      const at = pair.indexOf("=");
      this.cookies.set(pair.slice(0, at), pair.slice(at + 1));
    }
  }
  async call(method, path, { body, headers = {}, raw } = {}) {
    const csrf = this.cookies.get("XSRF-TOKEN");
    const response = await fetch(`${this.base}${path}`, {
      method,
      redirect: "manual",
      headers: {
        ...(this.cookies.size ? { cookie: this.header() } : {}),
        ...(csrf && method !== "GET" ? { "X-XSRF-TOKEN": decodeURIComponent(csrf) } : {}),
        ...(body !== undefined && raw === undefined ? { "content-type": "application/json" } : {}),
        ...headers,
      },
      ...(raw !== undefined ? { body: raw } : body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    this.remember(response);
    return response;
  }
  async signIn(email, password) {
    await this.call("GET", "/api/auth/csrf");
    const response = await this.call("POST", "/api/auth/login", { body: { email, password } });
    if (!response.ok) throw new Error(`sign-in failed with ${response.status}`);
  }
}
