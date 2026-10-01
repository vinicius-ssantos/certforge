import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api/problem";

/**
 * Server state lives in TanStack Query. Retrying only makes sense for failures that may pass: the
 * server being unreachable or failing. A rejected request (4xx) would fail the same way again.
 * A 401 on any query or mutation means the session has ended, so the learner is treated as signed out.
 */
export function createQueryClient(onSessionEnded?: () => void): QueryClient {
  const onError = (error: unknown) => {
    if (error instanceof ApiError && error.isUnauthenticated) {
      onSessionEnded?.();
    }
  };
  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          const transient = !(error instanceof ApiError) || error.isNetworkFailure || error.status >= 500;
          return transient && failureCount < 2;
        },
      },
    },
  });
}
