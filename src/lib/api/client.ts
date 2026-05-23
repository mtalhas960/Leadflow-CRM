/**
 * Client-side helper: builds auth headers for API requests.
 *
 * Usage:
 *   const headers = getApiAuthHeaders(userId, workspaceId);
 *   const res = await fetch("/api/...", { headers: { ...headers, "Content-Type": "application/json" } });
 */

export interface ApiAuthHeaders {
  "x-user-id": string;
  "x-workspace-id": string;
}

export function getApiAuthHeaders(
  userId: string,
  workspaceId: string
): ApiAuthHeaders {
  return {
    "x-user-id": userId,
    "x-workspace-id": workspaceId,
  };
}
