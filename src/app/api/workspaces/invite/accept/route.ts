import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { getAdminAuth } from "@/lib/firebase/admin";

const INVITES_COLLECTION = "workspace_invites";
const WORKSPACES_COLLECTION = "workspaces";
const USERS_COLLECTION = "users";

/**
 * POST /api/workspaces/invite/accept
 *
 * Accepts a workspace invitation. Uses Admin SDK to bypass Firestore security rules
 * since the accepting user is not yet a workspace member.
 *
 * Body: { inviteId: string }
 * Auth: Bearer token (required)
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.slice(7);
    let decodedToken;
    try {
      const auth = getAdminAuth();
      decodedToken = await auth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const uid = decodedToken.uid;
    const body = await req.json();
    const { inviteId } = body;

    if (!inviteId || typeof inviteId !== "string") {
      return NextResponse.json({ error: "inviteId is required" }, { status: 400 });
    }

    const db = getAdminDb();

    // Read invite document
    const inviteRef = db.collection(INVITES_COLLECTION).doc(inviteId);
    const inviteSnap = await inviteRef.get();

    if (!inviteSnap.exists) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const inviteData = inviteSnap.data()!;

    if (inviteData.status !== "pending") {
      return NextResponse.json({ error: "Invitation is no longer valid" }, { status: 400 });
    }

    const expiresAt = inviteData.expiresAt?.toDate?.() || new Date(0);
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 });
    }

    const workspaceId = inviteData.workspaceId;
    const role = inviteData.role;

    // Start atomic batch
    const batch = db.batch();

    // Update invite status
    batch.update(inviteRef, { status: "accepted", acceptedAt: new Date(), acceptedBy: uid });

    // Add user to workspace memberIds
    const workspaceRef = db.collection(WORKSPACES_COLLECTION).doc(workspaceId);
    const workspaceSnap = await workspaceRef.get();
    if (workspaceSnap.exists) {
      const workspaceData = workspaceSnap.data()!;
      const memberIds: string[] = workspaceData.memberIds || [];
      if (!memberIds.includes(uid)) {
        batch.update(workspaceRef, {
          memberIds: [...memberIds, uid],
        });
      }
    }

    // Update user document with workspace role
    const userRef = db.collection(USERS_COLLECTION).doc(uid);
    const userSnap = await userRef.get();
    if (userSnap.exists) {
      const userData = userSnap.data()!;
      const workspaceIds: string[] = userData.workspaceIds || [];
      const workspaceRoles: Record<string, string> = userData.workspaceRoles || {};

      const updates: Record<string, unknown> = {};

      if (!workspaceIds.includes(workspaceId)) {
        updates.workspaceIds = [...workspaceIds, workspaceId];
      }

      if (!userData.activeWorkspaceId) {
        updates.activeWorkspaceId = workspaceId;
      }

      if (!workspaceRoles[workspaceId]) {
        workspaceRoles[workspaceId] = role;
        updates.workspaceRoles = workspaceRoles;
      }

      if (Object.keys(updates).length > 0) {
        batch.update(userRef, updates);
      }
    }

    await batch.commit();

    return NextResponse.json({ success: true, workspaceId, role });
  } catch (error) {
    console.error("Invite accept error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to accept invitation",
      },
      { status: 500 }
    );
  }
}
