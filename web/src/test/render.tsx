import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { App } from "../App";
import { ApiProvider } from "../api/ApiProvider";
import { createApi } from "../api/client";
import { AuthProvider, ME_KEY } from "../auth/AuthContext";
import { TextProvider } from "../i18n/TextProvider";
import type { LocaleCode } from "../i18n/locales";
import { createQueryClient } from "../queryClient";
import { fakeFetch, type FakeFetch, type Handler } from "./fakeServer";

export const account = {
  id: "11111111-1111-4111-8111-111111111111",
  email: "learner@example.com",
  enabled: true,
  roles: ["LEARNER"],
  permissions: ["STUDY"],
};

export const editor = {
  id: "99999999-9999-4999-8999-999999999999",
  email: "editor@example.com",
  enabled: true,
  roles: ["EDITOR"],
  // Every account is also a learner (ADR 0008), so staff carry STUDY too.
  permissions: ["STUDY", "CONTENT_AUTHOR"],
};

export const reviewer = {
  id: "88888888-8888-4888-8888-888888888888",
  email: "reviewer@example.com",
  enabled: true,
  roles: ["REVIEWER"],
  permissions: ["STUDY", "CONTENT_REVIEW"],
};

export const admin = {
  id: "77777777-7777-4777-8777-777777777777",
  email: "admin@example.com",
  enabled: true,
  roles: ["ADMINISTRATOR"],
  // What Role.ADMINISTRATOR really grants, plus STUDY, which every account has (ADR 0008).
  permissions: [
    "STUDY",
    "CATALOG_MANAGE",
    "CONTENT_AUTHOR",
    "CONTENT_REVIEW",
    "CONTENT_PUBLISH",
    "ACCOUNT_MANAGE",
    "AUDIT_READ",
    "OPERATIONS_VIEW",
  ],
};

export const javaTrack = {
  id: "22222222-2222-4222-8222-222222222222",
  slug: "java-certification",
  name: "Java Certification",
  kind: "CERTIFICATION" as const,
  provider: "Oracle",
  certificationName: "Oracle Certified Professional Java SE 21 Developer",
  examVersion: {
    id: "33333333-3333-4333-8333-333333333333",
    label: "Java SE 21 (1Z0-830)",
    examCode: "1Z0-830",
    examName: "Java SE 21 Developer Professional",
    javaRelease: 21,
    objectivesUrl: "https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830",
  },
  topics: [
    {
      id: "44444444-4444-4444-8444-444444444444",
      slug: "exceptions",
      name: "Handling exceptions",
      objectiveRef: "Handling exceptions",
      subtopics: [
        {
          id: "55555555-5555-4555-8555-555555555555",
          slug: "try-with-resources",
          name: "try-with-resources",
          objectiveRef: "Using try-with-resources",
          subtopics: [],
        },
      ],
    },
    {
      id: "66666666-6666-4666-8666-666666666666",
      slug: "concurrency",
      name: "Managing concurrent code execution",
      objectiveRef: "Managing concurrent code execution",
      subtopics: [],
    },
  ],
};

export interface Rendered {
  fetch: FakeFetch;
  container: HTMLElement;
  rendered: ReturnType<typeof render>;
}

/**
 * Renders the whole application against a fake backend. By default the learner is signed in; pass
 * `signedIn: false` for an anonymous visitor.
 */
export function renderApp(
  routes: Record<string, Handler> = {},
  options: { path?: string; signedIn?: boolean; as?: typeof account; locale?: LocaleCode } = {},
): Rendered {
  const signedIn = options.signedIn ?? true;
  const fetch = fakeFetch({
    "GET /api/auth/me": signedIn
      ? { body: options.as ?? account }
      : { status: 401, body: { code: "unauthenticated", status: 401, title: "Unauthorized" } },
    "GET /api/auth/csrf": { body: { headerName: "X-XSRF-TOKEN", token: "test-csrf-token" } },
    ...routes,
  });
  const api = createApi({ fetch });
  const queryClient = createQueryClient(() => queryClient.setQueryData(ME_KEY, null));
  queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 0 } });

  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: (
          <AuthProvider>
            <App />
          </AuthProvider>
        ),
      },
    ],
    { initialEntries: [options.path ?? "/"] },
  );

  const rendered = render(
    // Pinned to English unless a test asks otherwise, so the existing suites keep asserting the
    // literal English wording and a locale is something a test opts into.
    <TextProvider locale={options.locale ?? "en"}>
      <ApiProvider api={api}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ApiProvider>
    </TextProvider>,
  );
  return {
    fetch,
    container: rendered.container,
    rendered,
  };
}
