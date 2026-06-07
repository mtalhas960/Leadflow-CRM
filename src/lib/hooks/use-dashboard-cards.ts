"use client";

import { useState, useCallback, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import type { DashboardCardId } from "@/types/dashboard";
import { DEFAULT_DASHBOARD_CARD_ORDER } from "@/types/dashboard";
import { useWorkspace } from "@/contexts/workspace-context";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ModuleId } from "@/types";

/**
 * Retrieves saved card order from user doc (per-user).
 * Stored as dashboardCardOrder.{workspaceId} -> DashboardCardId[]
 * This avoids Firestore workspace update restrictions (owner/admin only).
 */
async function fetchCardOrder(userId: string, workspaceId: string): Promise<DashboardCardId[] | null> {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      const data = snap.data();
      const layouts = data.dashboardCardOrder as Record<string, DashboardCardId[]> | undefined;
      const saved = layouts?.[workspaceId];
      if (Array.isArray(saved) && saved.length > 0) return saved;
    }
  } catch (err) {
    console.error("Failed to fetch card order:", err);
  }
  return null;
}

/**
 * Saves card order to user doc (per-user, per-workspace).
 * All users can write their own doc per Firestore rules.
 */
async function saveCardOrder(userId: string, workspaceId: string, order: DashboardCardId[]): Promise<void> {
  try {
    const ref = doc(db, "users", userId);
    const snap = await getDoc(ref);
    const existing = snap.data()?.dashboardCardOrder as Record<string, unknown> | undefined;
    await updateDoc(ref, {
      [`dashboardCardOrder.${workspaceId}`]: order,
    });
  } catch (err) {
    console.error("Failed to save card order:", err);
  }
}

/** ModuleId -> DashboardCardId mapping for permission checks */
const CARD_MODULE_MAP: Record<DashboardCardId, ModuleId> = {
  tasks: "projects",
  projects: "projects",
  invoices: "invoices",
  contracts: "contracts",
  meetings: "meetings",
  messages: "messages",
};

export function useDashboardCards() {
  const { activeWorkspace, user } = useWorkspace();
  const { canAccess } = usePermissions();
  // Start with default order so cards render immediately
  const [cardOrder, setCardOrder] = useState<DashboardCardId[]>(DEFAULT_DASHBOARD_CARD_ORDER);
  const [orderLoaded, setOrderLoaded] = useState(false);

  // Load saved order on mount — overwrite default if saved exists
  useEffect(() => {
    if (!activeWorkspace?.id || !user?.id) {
      setOrderLoaded(true);
      return;
    }

    (async () => {
      try {
        const saved = await fetchCardOrder(user.id, activeWorkspace.id);
        if (saved) {
          setCardOrder(saved);
        }
      } catch (err) {
        console.error("Failed to load dashboard card order:", err);
      } finally {
        setOrderLoaded(true);
      }
    })();
  }, [activeWorkspace?.id, user?.id]);

  /** Filter cards to only those the user has permission for */
  const visibleCards = cardOrder.filter((cardId) => {
    const moduleId = CARD_MODULE_MAP[cardId];
    return canAccess(moduleId);
  });

  /** Handle drag end — reorder cards and persist */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = cardOrder.indexOf(active.id as DashboardCardId);
      const newIndex = cardOrder.indexOf(over.id as DashboardCardId);

      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(cardOrder, oldIndex, newIndex);
      setCardOrder(newOrder);

      // Persist to user doc (fire-and-forget)
      if (activeWorkspace?.id && user?.id) {
        saveCardOrder(user.id, activeWorkspace.id, newOrder);
      }
    },
    [cardOrder, activeWorkspace?.id, user?.id]
  );

  /** Reset to default order */
  const resetOrder = useCallback(() => {
    if (!activeWorkspace?.id || !user?.id) return;
    setCardOrder(DEFAULT_DASHBOARD_CARD_ORDER);
    saveCardOrder(user.id, activeWorkspace.id, DEFAULT_DASHBOARD_CARD_ORDER);
  }, [activeWorkspace?.id, user?.id]);

  return {
    cardOrder,
    visibleCards,
    orderLoaded,
    handleDragEnd,
    resetOrder,
  };
}
