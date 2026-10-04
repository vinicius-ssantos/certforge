import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { App } from "./App";
import { ApiProvider } from "./api/ApiProvider";
import { AuthProvider, ME_KEY } from "./auth/AuthContext";
import { TextProvider } from "./i18n/TextProvider";
import { createQueryClient } from "./queryClient";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource-variable/source-serif-4";
import "./tokens.css";
import "./styles.css";

// A data router, which is what lets a page stop a navigation that would lose unsaved work. The
// application's own routes stay in App; this one route hands everything to it.
const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
  },
]);

const queryClient = createQueryClient(() => queryClient.setQueryData(ME_KEY, null));

const root = document.getElementById("root");
if (!root) {
  throw new Error("The root element is missing from index.html");
}

createRoot(root).render(
  <StrictMode>
    <TextProvider>
      <ApiProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ApiProvider>
    </TextProvider>
  </StrictMode>,
);
