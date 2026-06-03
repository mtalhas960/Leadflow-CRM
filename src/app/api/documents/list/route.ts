import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { cloudinary } from "@/lib/cloudinary";
import { withAuth } from "@/lib/api/middleware";

const DOCUMENTS_COLLECTION = "documents";

export async function GET(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      const { searchParams } = new URL(req.url);
      const leadId = searchParams.get("leadId");
      const projectId = searchParams.get("projectId");
      const workspaceId = searchParams.get("workspaceId");

      if (!leadId && !projectId && !workspaceId) {
        return NextResponse.json(
          { error: "leadId, projectId, or workspaceId is required" },
          { status: 400 }
        );
      }

      // Enforce workspaceId matches the authenticated user's workspace
      if (workspaceId && workspaceId !== ctx.workspaceId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const db = getAdminDb();
      let query;
      if (leadId) {
        query = db.collection(DOCUMENTS_COLLECTION).where("leadId", "==", leadId);
      } else if (projectId) {
        query = db.collection(DOCUMENTS_COLLECTION).where("projectId", "==", projectId);
      } else {
        query = db.collection(DOCUMENTS_COLLECTION).where("workspaceId", "==", workspaceId);
      }

      const snapshot = await query.get();
      interface DocData {
        createdAt?: { toMillis?: () => number; seconds?: number };
        [key: string]: unknown;
      }
      const documents: Array<{ id: string } & DocData> = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as DocData),
      }));

      // Sort by createdAt descending in-memory
      documents.sort((a, b) => {
        const aTs = a.createdAt?.toMillis?.() ?? a.createdAt?.seconds ?? 0;
        const bTs = b.createdAt?.toMillis?.() ?? b.createdAt?.seconds ?? 0;
        return (bTs as number) - (aTs as number);
      });

      return NextResponse.json({ success: true, documents });
    } catch (error) {
      console.error("Document list error:", error);
      return NextResponse.json(
        { error: "Failed to list documents" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(req: NextRequest) {
  return withAuth(req, async (ctx) => {
    try {
      const body = await req.json();
      const { documentId } = body;

      if (!documentId) {
        return NextResponse.json(
          { error: "documentId is required" },
          { status: 400 }
        );
      }

      const db = getAdminDb();

      // Get document metadata
      const docRef = db.collection(DOCUMENTS_COLLECTION).doc(documentId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        return NextResponse.json(
          { error: "Document not found or access denied" },
          { status: 404 }
        );
      }

      const docData = docSnap.data() as { workspaceId?: string; cloudinaryPublicId?: string };

      // Verify workspace ownership
      if (docData.workspaceId !== ctx.workspaceId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Delete from Cloudinary
      if (docData.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(docData.cloudinaryPublicId);
      }

      // Delete from Firestore
      await docRef.delete();

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Document delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }
  });
}
