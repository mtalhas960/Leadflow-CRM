"use client";

import type { ProjectTask } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Status Options ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { parent: "To Do" as const, name: "Not Started", color: "#DDDDDD" },
  { parent: "In Progress" as const, name: "In Progress", color: "#CFE6F5" },
  { parent: "Complete" as const, name: "Complete", color: "#D1F5CF" },
  { parent: "On Hold" as const, name: "On Hold", color: "#FFE0B2" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: ProjectTask;
  memberMap?: Map<string, { displayName: string; photoURL?: string | null }>;
  onToggleComplete?: (task: ProjectTask) => void;
  onStatusChange?: (task: ProjectTask, newStatus: { parent: string; name: string; color: string }) => void;
  onClick?: (task: ProjectTask) => void;
  onDelete?: (task: ProjectTask) => void;
  showSubtasks?: boolean;
  onToggleSubtasks?: (task: ProjectTask) => void;
  isSubtask?: boolean;
  /** HTML5 drag event handlers */
  onDragStart?: (e: React.DragEvent, task: ProjectTask) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, task: ProjectTask) => void;
  isDragging?: boolean;
  saving?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TaskCard({
  task,
  memberMap,
  onToggleComplete,
  onStatusChange,
  onClick,
  onDelete,
  showSubtasks,
  onToggleSubtasks,
  isSubtask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  saving,
  className,
}: TaskCardProps) {
  const isComplete = task.status.parent === "Complete";
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const statusBg = task.status.color || "#DDDDDD";
  const statusLabel = task.status.name || task.status.parent;

  const assignee = task.assigneeId ? memberMap?.get(task.assigneeId) : null;
  const hasSubtasks = task.hasSubtasks && !isSubtask;

  const dueDateValue =
    task.dueDate && typeof (task.dueDate as any).toDate === "function"
      ? (task.dueDate as any).toDate()
      : task.dueDate
        ? new Date(task.dueDate as unknown as string)
        : null;

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart?.(e, task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, task);
  };

  return (
    <div
      draggable={!!onDragStart && !isSubtask}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border p-3 transition-colors",
        "hover:bg-accent/50",
        isComplete && "opacity-70",
        isSubtask && "ml-8 border-dashed",
        saving && "pointer-events-none opacity-60",
        isDragging && "opacity-30 scale-95",
        className
      )}
    >
      {/* Drag handle */}
      {!isSubtask && onDragStart && (
        <button
          className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          tabIndex={-1}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {/* Completion checkbox */}
      <Checkbox
        checked={isComplete}
        onCheckedChange={() => onToggleComplete?.(task)}
        className="mt-0.5 shrink-0"
        aria-label={isComplete ? "Mark incomplete" : "Mark complete"}
      />

      {/* Main content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onClick?.(task)}
        role="button"
        tabIndex={0}
      >
        {/* Title + Status badge row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn("text-sm font-medium leading-tight", isComplete && "line-through text-muted-foreground")}>
            {task.taskName}
          </span>

          {/* Status dropdown trigger */}
          <div className="relative inline-flex">
            <button
              onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium hover:opacity-80 transition-opacity"
              style={{ backgroundColor: statusBg, color: "#374151" }}
            >
              {statusLabel}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showStatusDropdown && (
              <div className="absolute left-0 top-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 py-1 min-w-[130px]">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStatusDropdown(false);
                      onStatusChange?.(task, opt);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs flex items-center gap-2 hover:bg-accent"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
                    {opt.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Due date + Assignee row */}
        <div className="flex items-center gap-3 mt-1.5">
          {dueDateValue && (
            <span className={cn("inline-flex items-center gap-1 text-xs", isComplete ? "text-muted-foreground" : dueDateValue < new Date() ? "text-red-600 font-medium" : "text-muted-foreground")}>
              <Calendar className="h-3 w-3" />
              {formatDate(dueDateValue)}
              {dueDateValue < new Date() && !isComplete && " (overdue)"}
            </span>
          )}
          {assignee && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              {assignee.photoURL ? (
                <Avatar className="h-4 w-4">
                  <AvatarFallback className="text-[8px]">{getInitials(assignee.displayName)}</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-3 w-3" />
              )}
              {assignee.displayName}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {hasSubtasks && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleSubtasks?.(task)} aria-label={showSubtasks ? "Hide subtasks" : "Show subtasks"}>
            {showSubtasks ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Task actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onClick?.(task)}>View details</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(task)}>
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );
}
