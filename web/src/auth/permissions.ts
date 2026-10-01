import { useAuth } from "./AuthContext";

export type Permission =
  | "STUDY"
  | "CATALOG_MANAGE"
  | "CONTENT_AUTHOR"
  | "CONTENT_REVIEW"
  | "CONTENT_PUBLISH"
  | "ACCOUNT_MANAGE"
  | "AUDIT_READ"
  | "OPERATIONS_VIEW";

/**
 * Whether the signed-in account holds any of the permissions. This only decides what the interface
 * offers; the server checks every request again, so hiding a control is a courtesy and never the
 * protection.
 */
export function useHasAny(...permissions: Permission[]): boolean {
  const { state } = useAuth();
  return (
    state.status === "authenticated" &&
    permissions.some((permission) => state.account.permissions.includes(permission))
  );
}
