import type { ModuleId } from "./index";

/** Dashboard module cards that can be shown/reordered */
export type DashboardCardId =
  | "tasks"
  | "projects"
  | "invoices"
  | "contracts"
  | "meetings"
  | "messages";

/** Metadata for each dashboard card */
export interface DashboardCardMeta {
  id: DashboardCardId;
  title: string;
  description: string;
  moduleId: ModuleId;
}

/** Registry of all available dashboard cards */
export const DASHBOARD_CARDS: Record<DashboardCardId, DashboardCardMeta> = {
  tasks: {
    id: "tasks",
    title: "My Tasks",
    description: "Tasks assigned to you",
    moduleId: "projects",
  },
  projects: {
    id: "projects",
    title: "My Projects",
    description: "Projects you're part of",
    moduleId: "projects",
  },
  invoices: {
    id: "invoices",
    title: "Invoices",
    description: "Recent invoices",
    moduleId: "invoices",
  },
  contracts: {
    id: "contracts",
    title: "Contracts",
    description: "Recent contracts & proposals",
    moduleId: "contracts",
  },
  meetings: {
    id: "meetings",
    title: "Upcoming Meetings",
    description: "Scheduled meetings",
    moduleId: "meetings",
  },
  messages: {
    id: "messages",
    title: "Messages",
    description: "Recent conversations",
    moduleId: "messages",
  },
};

/** Default order for dashboard cards */
export const DEFAULT_DASHBOARD_CARD_ORDER: DashboardCardId[] = [
  "tasks",
  "projects",
  "invoices",
  "contracts",
  "meetings",
  "messages",
];
