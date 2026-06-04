"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import {
  createSpreadsheet,
  deleteSpreadsheet,
  type Spreadsheet,
} from "@/lib/firebase/spreadsheets";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SpreadsheetListProps {
  spreadsheets: Spreadsheet[];
  workspaceId: string;
  userId: string;
  onRefresh: () => void;
}

export function SpreadsheetList({
  spreadsheets,
  workspaceId,
  userId,
  onRefresh,
}: SpreadsheetListProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const id = await createSpreadsheet(
        workspaceId,
        `Untitled ${spreadsheets.length + 1}`,
        userId
      );
      router.push(`/leads/spreadsheet/${id}`);
    } catch {
      toast.error("Failed to create spreadsheet");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteSpreadsheet(workspaceId, deleteId);
      toast.success("Spreadsheet deleted");
      setDeleteId(null);
      onRefresh();
    } catch {
      toast.error("Failed to delete spreadsheet");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Spreadsheets</h2>
          <p className="text-sm text-muted-foreground">
            Create and edit spreadsheets within your workspace
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Spreadsheet
        </Button>
      </div>

      {/* Empty state */}
      {spreadsheets.length === 0 && !creating && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <FileSpreadsheet className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-2 text-lg font-medium">No spreadsheets yet</p>
          <p className="mb-6 text-sm text-muted-foreground max-w-sm">
            Create your first spreadsheet to start working with data, formulas, and
            formatting right inside LeadFlow.
          </p>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Spreadsheet
          </Button>
        </div>
      )}

      {/* Spreadsheet grid */}
      {spreadsheets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spreadsheets.map((s) => (
            <Card
              key={s.id}
              className="cursor-pointer transition-colors hover:border-primary/50"
              onClick={() => router.push(`/leads/spreadsheet/${s.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <FileSpreadsheet className="h-8 w-8 text-primary/70" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(s.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base mt-2 truncate">
                  {s.name}
                </CardTitle>
                <CardDescription className="text-xs">
                  {s.updatedAt
                    ? `Modified ${formatDate(s.updatedAt.toDate())}`
                    : "Not yet saved"}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <p className="text-xs text-muted-foreground">
                  {s.snapshot ? "Has data" : "Empty"}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Spreadsheet</DialogTitle>
            <DialogDescription>
              This will permanently delete this spreadsheet and all its data. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
