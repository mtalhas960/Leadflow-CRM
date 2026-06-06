"use client";

import Link from "next/link";

// ─────────────────────────────────────────────────────────
// PIPELINE MODULE — Commented out (Jun 2026)
// ─────────────────────────────────────────────────────────
// Reason: Pipeline was a kanban board view of leads.
// After Spreadsheets + Analytics were merged into Leads,
// the separate Pipeline module became redundant.
//
// To restore:
//   1. Uncomment this file
//   2. Add Pipeline back to navItems in layout.tsx
//   3. Add `KanbanSquare` import from lucide-react in layout.tsx
// ─────────────────────────────────────────────────────────

export default function PipelinePage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-3">
        <h2 className="text-xl font-semibold text-muted-foreground">Pipeline Module Removed</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Pipeline was merged into the Leads module. Use{" "}
          <Link href="/leads/spreadsheet" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Leads → Spreadsheets
          </Link>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
