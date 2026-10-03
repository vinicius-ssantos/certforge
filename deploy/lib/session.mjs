// A small HTTP client with a cookie jar and the CSRF header, for the release scripts. Node's fetch
// keeps no cookies of its own.

/**
 * Signs in the bootstrap administrator, and explains the failure that actually happens rather than
 * printing a stack trace.
 *
 * <p>That administrator is created only when the database has none, so pointing
 * `BOOTSTRAP_ADMIN_EMAIL` at a different address on a database that already has one does nothing
 * at all, silently: the account made on the first start is still the only administrator. The
 * symptom is a 401 that looks like a wrong password.
 */
export async function signInAdmin(session, email, password) {
  try {
    await session.signIn(email, password);
  } catch (error) {
    console.error(`${error.message}.`);
    console.error("");
    console.error("The bootstrap administrator is created only when the database has none, so");
    console.error("changing BOOTSTRAP_ADMIN_EMAIL on a database that already has one has no");
    console.error("effect: whoever was created on the first start is still the administrator.");
    console.error("");
    console.error("Sign in as that account, or start over with an empty database: just reset");
    process.exit(2);
  }
}

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
    if (!response.ok) throw new Error(`sign-in as ${email} failed with ${response.status}`);
  }
}
