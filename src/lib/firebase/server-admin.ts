/**
 * Server-side Admin SDK helpers for Firestore operations.
 * Use these in API routes instead of the client SDK to avoid
 * "Missing or insufficient permissions" errors.
 */
import { adminDb } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import type { MeetingTypeAvailability } from "@/lib/availability";

/* ── Timestamp (re-export for convenience) ─────────────────────────── */
export { Timestamp };

/* ── Workspace helpers ─────────────────────────────────────────────── */

export async function getWorkspace(workspaceId: string) {
  const snap = await adminDb.collection("workspaces").doc(workspaceId).get();
  return snap.exists ? snap.data() : null;
}

/* ── Meeting helpers ───────────────────────────────────────────────── */

export interface CreateMeetingInput {
  workspaceId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  attendees: { email: string; name: string }[];
  conferencingTool: "google_meet";
  googleMeetLink: string;
  calendarEventId: string;
  calendarEventUrl?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  meetingType: "instant" | "scheduled";
  createdBy: string;
  leadId?: string;
  conversationId?: string;
}

export async function createMeeting(data: CreateMeetingInput): Promise<string> {
  const docData: Record<string, unknown> = {
    workspaceId: data.workspaceId,
    title: data.title,
    startTime: Timestamp.fromDate(data.startTime),
    endTime: Timestamp.fromDate(data.endTime),
    timezone: data.timezone,
    attendees: data.attendees,
    conferencingTool: data.conferencingTool,
    googleMeetLink: data.googleMeetLink,
    calendarEventId: data.calendarEventId,
    status: data.status,
    meetingType: data.meetingType,
    createdBy: data.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  if (data.leadId) docData.leadId = data.leadId;
  if (data.conversationId) docData.conversationId = data.conversationId;
  if (data.description) docData.description = data.description;
  if (data.calendarEventUrl) docData.calendarEventUrl = data.calendarEventUrl;

  const docRef = await adminDb.collection("meetings").add(docData);
  return docRef.id;
}

/* ── Activity helpers ──────────────────────────────────────────────── */

/* ── Meeting type helpers ─────────────────────────────────────────── */

export interface ServerMeetingType {
  id: string;
  workspaceId: string;
  name: string;
  duration: number;
  bufferTime: number;
  videoTool: "google_meet" | "none";
  description: string;
  bookingToken: string;
  availability?: MeetingTypeAvailability;
  active: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

function generateBookingToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function getMeetingTypeByToken(token: string): Promise<ServerMeetingType | null> {
  const q = adminDb
    .collection("meeting_types")
    .where("bookingToken", "==", token)
    .where("active", "==", true)
    .limit(1);
  const snapshot = await q.get();
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as ServerMeetingType;
}

export async function getMeetingType(id: string) {
  const snap = await adminDb.collection("meeting_types").doc(id).get();
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() };
}

export async function getMeetingTypes(workspaceId: string) {
  const q = adminDb
    .collection("meeting_types")
    .where("workspaceId", "==", workspaceId)
    .orderBy("name", "asc");
  const snapshot = await q.get();
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createMeetingType(data: {
  workspaceId: string;
  name: string;
  duration: number;
  bufferTime: number;
  videoTool: "google_meet" | "none";
  description: string;
  availability?: MeetingTypeAvailability;
  active: boolean;
  createdBy: string;
}): Promise<string> {
  const docData: Record<string, unknown> = {
    workspaceId: data.workspaceId,
    name: data.name,
    duration: data.duration,
    bufferTime: data.bufferTime,
    videoTool: data.videoTool,
    description: data.description,
    bookingToken: generateBookingToken(),
    active: data.active ?? true,
    createdBy: data.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  if (data.availability) {
    docData.availability = data.availability;
  }

  const docRef = await adminDb.collection("meeting_types").add(docData);
  return docRef.id;
}

export async function updateMeetingType(id: string, data: Record<string, unknown>): Promise<void> {
  await adminDb.collection("meeting_types").doc(id).update({
    ...data,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteMeetingType(id: string): Promise<void> {
  await adminDb.collection("meeting_types").doc(id).delete();
}

/* ── Activity helpers ──────────────────────────────────────────────── */

export async function logMeeting(
  leadId: string,
  workspaceId: string,
  createdBy: string,
  subject: string,
  body: string | null,
  duration?: number
): Promise<void> {
  await adminDb.collection("activities").add({
    workspaceId,
    leadId,
    type: "meeting",
    subject,
    body,
    duration: duration || null,
    createdBy,
    createdAt: Timestamp.now(),
  });
}
