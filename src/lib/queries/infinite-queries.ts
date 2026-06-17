"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { collection, query, where, orderBy, limit, getDocs, startAfter, type QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { InvoiceStatus } from "@/types";

const PAGE_SIZE = 20;

/**
 * Infinite-scroll paginated invoices. Each page fetches 20 docs via cursor.
 * Use with a "Load More" button or IntersectionObserver trigger.
 */
export function useInvoicesInfinite(
  workspaceId?: string,
  statusFilter?: InvoiceStatus | "all"
) {
  return useInfiniteQuery({
    queryKey: ["invoices", workspaceId, "infinite", statusFilter],
    queryFn: async ({ pageParam }: { pageParam: QueryDocumentSnapshot | undefined }) => {
      if (!workspaceId) return { docs: [], cursor: undefined };

      const constraints: (ReturnType<typeof where> | ReturnType<typeof orderBy>)[] = [
        where("workspaceId", "==", workspaceId),
        orderBy("createdAt", "desc"),
      ];
      if (statusFilter && statusFilter !== "all") {
        constraints.splice(1, 0, where("status", "==", statusFilter));
      }

      let q = query(collection(db, "invoices"), ...constraints, limit(PAGE_SIZE));
      if (pageParam) {
        q = query(q, startAfter(pageParam));
      }

      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const lastDoc = snap.docs[snap.docs.length - 1] ?? undefined;

      return { docs, cursor: lastDoc, hasMore: snap.docs.length === PAGE_SIZE };
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
    initialPageParam: undefined as QueryDocumentSnapshot | undefined,
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Infinite-scroll paginated contracts.
 */
export function useContractsInfinite(
  workspaceId?: string,
  statusFilter?: string
) {
  return useInfiniteQuery({
    queryKey: ["contracts", workspaceId, "infinite", statusFilter],
    queryFn: async ({ pageParam }: { pageParam: QueryDocumentSnapshot | undefined }) => {
      if (!workspaceId) return { docs: [], cursor: undefined };

      const constraints: (ReturnType<typeof where> | ReturnType<typeof orderBy>)[] = [
        where("workspaceId", "==", workspaceId),
        orderBy("createdAt", "desc"),
      ];
      if (statusFilter && statusFilter !== "all") {
        constraints.splice(1, 0, where("status", "==", statusFilter));
      }

      let q = query(collection(db, "contracts"), ...constraints, limit(PAGE_SIZE));
      if (pageParam) {
        q = query(q, startAfter(pageParam));
      }

      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const lastDoc = snap.docs[snap.docs.length - 1] ?? undefined;

      return { docs, cursor: lastDoc, hasMore: snap.docs.length === PAGE_SIZE };
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
    initialPageParam: undefined as QueryDocumentSnapshot | undefined,
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
}
