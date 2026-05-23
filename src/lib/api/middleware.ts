import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";
import type { ModuleId } from "@/types";
import { canAccessModule } from "@/lib/permissions";

export interface AuthContext {
  userId: string;
  workspaceId: string;
  role: string;
}

/**
 * Verifies that the request comes from an authenticated user who belongs
 * to the specified workspace. Optionally checks module-level permissions.
 *
 * Returns `AuthContext` on success or a `NextResponse` error on failure.
 * The caller should check with `instanceof NextResponse` or check for `.status`.
 */
export async function requireAuth(
  req: NextRequest,
  moduleId?: ModuleId
): Promise<AuthContext | NextResponse> {
  const userId = req.headers.get("x-user-id");
  const workspaceId = req.headers.get("x-workspace-id");

  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required. Provide x-user-id header." },
      { status: 401 }
    );
  }
  if (!workspaceId) {
    return NextResponse.json(
      { error: "Workspace ID required. Provide x-workspace-id header." },
      { status: 400 }
    );
  }

  // Verify user exists and belongs to workspace
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return NextResponse.json(
      { error: "User account not found." },
      { status: 403 }
    );
  }

  const userData = userSnap.data();
  const workspaceRoles: Record<string, string> =
    userData.workspaceRoles || {};
  const role = workspaceRoles[workspaceId] || null;

  if (!role) {
    return NextResponse.json(
      { error: "You are not a member of this workspace." },
      { status: 403 }
    );
  }

  // Owner and admin bypass module checks
  if (moduleId && role !== "owner" && role !== "admin") {
    const workspaceRef = doc(db, "workspaces", workspaceId);
    const workspaceSnap = await getDoc(workspaceRef);

    if (workspaceSnap.exists()) {
      const workspaceData = workspaceSnap.data();
      const modulePermissions = workspaceData.modulePermissions || null;

      if (!canAccessModule(modulePermissions, role, moduleId)) {
        return NextResponse.json(
          { error: `Access denied. Your role does not have access to ${moduleId}.` },
          { status: 403 }
        );
      }
    }
  }

  return { userId, workspaceId, role };
}

/**
 * Wrapper: extracts auth context or returns the error response directly.
 * Throws nothing — always returns either AuthContext or NextResponse.
 */
export async function withAuth(
  req: NextRequest,
  handler: (ctx: AuthContext) => Promise<NextResponse>,
  moduleId?: ModuleId
): Promise<NextResponse> {
  const auth = await requireAuth(req, moduleId);
  if (auth instanceof NextResponse) return auth;
  return handler(auth);
}
