import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { Message, Conversation } from "@/types";

const MESSAGES_COLLECTION = "messages";
const CONVERSATIONS_COLLECTION = "conversations";

// ─── Conversations (one-shot) ────────────────────────────────────────────────

export async function getConversations(
  workspaceId: string
): Promise<Conversation[]> {
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where("workspaceId", "==", workspaceId),
    orderBy("lastMessageAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Conversation
  );
}

// ─── Conversations (real-time) ───────────────────────────────────────────────

export function subscribeToConversations(
  workspaceId: string,
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, CONVERSATIONS_COLLECTION),
    where("workspaceId", "==", workspaceId),
    orderBy("lastMessageAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const conversations = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Conversation
      );
      callback(conversations);
    },
    (error) => {
      console.error("Failed to subscribe to conversations:", error);
      onError?.(error);
    }
  );
}

// ─── Messages (one-shot) ─────────────────────────────────────────────────────

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as Message
  );
}

// ─── Messages (real-time) ────────────────────────────────────────────────────

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: Message[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where("conversationId", "==", conversationId),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const messages = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Message
      );
      callback(messages);
    },
    (error) => {
      console.error("Failed to subscribe to messages:", error);
      onError?.(error);
    }
  );
}

// ─── Send Message ────────────────────────────────────────────────────────────

export async function sendMessage(data: {
  workspaceId: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  body: string;
}): Promise<string> {
  const docRef = await addDoc(collection(db, MESSAGES_COLLECTION), {
    conversationId: data.conversationId,
    workspaceId: data.workspaceId,
    senderId: data.senderId,
    senderName: data.senderName,
    body: data.body,
    createdAt: serverTimestamp(),
  });

  // Update conversation's last message preview
  try {
    const convRef = doc(db, CONVERSATIONS_COLLECTION, data.conversationId);
    await updateDoc(convRef, {
      lastMessage: data.body.slice(0, 100),
      lastMessageAt: serverTimestamp(),
    });
  } catch {
    // Non-critical — message is already saved
    console.warn("Failed to update conversation preview — conversation may not exist");
  }

  return docRef.id;
}

// ─── Edit Message ────────────────────────────────────────────────────────────

export async function editMessage(
  messageId: string,
  newBody: string
): Promise<void> {
  const msgRef = doc(db, MESSAGES_COLLECTION, messageId);
  await updateDoc(msgRef, {
    body: newBody,
    edited: true,
    editedAt: serverTimestamp(),
  });
}

// ─── Delete Message (soft) ───────────────────────────────────────────────────

export async function deleteMessage(messageId: string): Promise<void> {
  const msgRef = doc(db, MESSAGES_COLLECTION, messageId);
  await updateDoc(msgRef, {
    deleted: true,
    body: "",
    edited: false,
  });
}

// ─── Delete Conversation ─────────────────────────────────────────────────────

export async function deleteConversation(conversationId: string): Promise<void> {
  // Delete all messages in the conversation
  const msgsQuery = query(
    collection(db, MESSAGES_COLLECTION),
    where("conversationId", "==", conversationId)
  );
  const msgsSnapshot = await getDocs(msgsQuery);
  const batch: Array<Promise<void>> = [];
  msgsSnapshot.docs.forEach((d) => {
    batch.push(deleteDoc(doc(db, MESSAGES_COLLECTION, d.id)));
  });
  await Promise.all(batch);

  // Delete the conversation document
  await deleteDoc(doc(db, CONVERSATIONS_COLLECTION, conversationId));
}

// ─── Create Conversation ─────────────────────────────────────────────────────

export async function createConversation(data: {
  workspaceId: string;
  type: "lead" | "member";
  leadId?: string;
  leadName?: string;
  leadEmail?: string;
  participantIds?: string[];
  participantNames?: string[];
}): Promise<string> {
  const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), {
    workspaceId: data.workspaceId,
    type: data.type,
    leadId: data.leadId ?? "",
    leadName: data.leadName ?? "",
    leadEmail: data.leadEmail ?? "",
    participantIds: data.participantIds ?? [],
    participantNames: data.participantNames ?? [],
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    unreadCount: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// ─── Exports for backward compatibility ──────────────────────────────────────

export type { Message, Conversation };

// ─── Fix misaligned participantNames in old conversations ────────────────────

/**
 * Old conversations stored participantNames with only the invitee's name,
 * but participantIds always has both. This caused the wrong name to show
 * when the invitee views the conversation.
 *
 * This migration syncs participantNames by looking up workspace members.
 */
export async function fixConversationNames(
  conversations: Conversation[],
  memberDisplayNames: Map<string, string>
): Promise<number> {
  let fixed = 0;

  for (const conv of conversations) {
    if (conv.type !== "member") continue;
    const ids = conv.participantIds || [];
    const names = conv.participantNames || [];

    // Already aligned — skip
    if (names.length === ids.length) continue;

    // Build correct names from workspace members
    const correctNames = ids.map((id) => memberDisplayNames.get(id) || "Team Member");

    // Only update if something changed
    const changed = correctNames.some((n, i) => n !== (names[i] || ""));
    if (!changed) continue;

    try {
      const convRef = doc(db, CONVERSATIONS_COLLECTION, conv.id);
      await updateDoc(convRef, { participantNames: correctNames });
      fixed++;
    } catch {
      console.warn(`Failed to fix participantNames for conversation ${conv.id}`);
    }
  }

  return fixed;
}
