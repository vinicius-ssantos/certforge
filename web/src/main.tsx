import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { ApiProvider } from "./api/ApiProvider";
import { AuthProvider, ME_KEY } from "./auth/AuthContext";
import { createQueryClient } from "./queryClient";
import "./styles.css";

const queryClient = createQueryClient(() => queryClient.setQueryData(ME_KEY, null));

const root = document.getElementById("root");
if (!root) {
  throw new Error("The root element is missing from index.html");
}

createRoot(root).render(
  <StrictMode>
    <ApiProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ApiProvider>
  </StrictMode>,
);
