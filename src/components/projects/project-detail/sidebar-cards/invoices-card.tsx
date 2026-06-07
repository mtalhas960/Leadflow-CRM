"use client";

import { getInvoices } from "@/lib/firebase/invoices";
import type { Invoice } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FileText, Plus, Receipt } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ─── Status styles (mirrors invoices list page) ─────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  cancelled: "bg-muted text-muted-foreground",
  partial: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  pending_review: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

const STATUS_LABELS: Record<string, string> = {
  pending_review: "Pending Review",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface InvoicesCardProps {
  projectId: string;
  workspaceId: string;
  /** First client ID — used to pre-fill the new invoice link */
  clientId?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InvoicesCard({ projectId, workspaceId, clientId }: InvoicesCardProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workspaceId || !projectId) return;
    setLoading(true);
    getInvoices(workspaceId, { max: 50 })
      .then((all) => all.filter((inv) => inv.projectId === projectId))
      .then(setInvoices)
      .catch(() => setInvoices([]))
      .finally(() => setLoading(false));
  }, [workspaceId, projectId]);

  // Build the new-invoice link with pre-filled params
  const newInvoiceParams = new URLSearchParams();
  if (projectId) newInvoiceParams.set("projectId", projectId);
  if (clientId) newInvoiceParams.set("clientId", clientId);
  const newInvoiceHref = `/invoices/new?${newInvoiceParams.toString()}`;

  return (
    <div
      style={{ borderRadius: "8px" }}
      className="flex flex-col p-5 w-full bg-card border border-border hover:border-foreground/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Invoices</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
          <Link href={newInvoiceHref}>
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2 py-1">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-3">
          <p className="text-xs text-muted-foreground mb-2">
            No invoices linked to this project
          </p>
          <Button variant="outline" size="sm" className="gap-1" asChild>
            <Link href={newInvoiceHref}>
              <Plus className="h-3 w-3" />
              New Invoice
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-1.5">
          {invoices.map((inv) => {
            const statusStyle = STATUS_STYLES[inv.status] || STATUS_STYLES.draft;
            const isOverdue = inv.status === "sent" && inv.dueDate?.toDate() < new Date();
            return (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-xs font-medium">
                    {inv.invoiceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold">
                    {formatCurrency(inv.total, inv.currency)}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] px-1.5 py-0", statusStyle)}
                  >
                    {isOverdue
                      ? "Overdue"
                      : STATUS_LABELS[inv.status] ||
                        inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                  </Badge>
                </div>
              </Link>
            );
          })}
          <Button variant="outline" size="sm" className="w-full mt-1 gap-1" asChild>
            <Link href={newInvoiceHref}>
              <Plus className="h-3 w-3" />
              New Invoice
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
