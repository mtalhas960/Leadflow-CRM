"use client";

import type { ProjectTask } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Loader2,
  MoreHorizontal,
  Trash2,
  User,
  Copy,
  EyeOff,
} from "lucide-react";
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

const COLOR_MAPPING: Record<string, string> = {
  "#DDDDDD": "#5B5B5B",
  "#CFE6F5": "#003180",
  "#D1F5CF": "#008000",
  "#FFE0B2": "#803A00",
  "#F5EFCF": "#805500",
  "#E8F5E9": "#008000",
  "#F3E5F5": "#53026D",
  "#BDBDBD": "#5B5B5B",
  "#6b7280": "#FFFFFF",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function getStatusStyle(color: string) {
  const upper = color.toUpperCase();
  if (COLOR_MAPPING[upper]) return { backgroundColor: color, color: COLOR_MAPPING[upper] };
  const rgb = hexToRgb(color);
  if (rgb) return { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, color: `rgb(${Math.floor(rgb.r * 0.5)}, ${Math.floor(rgb.g * 0.5)}, ${Math.floor(rgb.b * 0.5)})` };
  return { backgroundColor: color, color: "#374151" };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Inline Title Edit ────────────────────────────────────────────────────────

function TitleEdit({
  title,
  isEditing,
  onStartEdit,
  onSubmit,
  onCancel,
}: {
  title: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSubmit: (newTitle: string) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(title);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { setVal(title); }, [title]);
  useEffect(() => {
    if (isEditing && ref.current) { ref.current.focus(); ref.current.select(); }
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        if (val.trim() !== title.trim()) onSubmit(val.trim());
        else onCancel();
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isEditing, val, title, onSubmit, onCancel]);

  if (isEditing) {
    return (
      <input ref={ref} value={val} onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(val.trim()); if (e.key === "Escape") onCancel(); }}
        className="w-full px-1.5 py-0.5 text-sm border border-[#060606] rounded focus:outline-none font-medium text-[#202020]"
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span onClick={(e) => { e.stopPropagation(); onStartEdit(); }}
      className="cursor-pointer hover:bg-gray-100 px-1.5 py-0.5 -ml-1.5 rounded text-sm font-medium text-[#202020] truncate"
    >
      {title}
    </span>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task: ProjectTask;
  memberMap?: Map<string, { displayName: string; photoURL?: string | null }>;
  onToggleComplete?: (task: ProjectTask) => void;
  onStatusChange?: (task: ProjectTask, newStatus: { parent: string; name: string; color: string }) => void;
  onTitleChange?: (task: ProjectTask, newTitle: string) => void;
  onDelete?: (task: ProjectTask) => void;
  showSubtasks?: boolean;
  onToggleSubtasks?: (task: ProjectTask) => void;
  isSubtask?: boolean;
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
  onTitleChange,
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const statusStyle = getStatusStyle(task.status.color || "#DDDDDD");

  const assignee = task.assigneeId ? memberMap?.get(task.assigneeId) : null;
  const hasSubtasks = task.hasSubtasks && !isSubtask;
  const dueDateValue = task.dueDate && typeof (task.dueDate as any).toDate === "function"
    ? (task.dueDate as any).toDate()
    : task.dueDate ? new Date(task.dueDate as unknown as string) : null;

  const handleDragStart = (e: React.DragEvent) => { onDragStart?.(e, task); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); onDragOver?.(e); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); onDrop?.(e, task); };

  return (
    <div className={cn("workflow-item relative group", isSubtask && "ml-8", isDragging && "opacity-30", className)}>
      {/* Non-milestone items get a border container */}
      <div className={cn(
        "transition-colors",
        !isSubtask && "border border-[#e9e9e9] rounded-md p-2 hover:bg-gray-50"
      )}>
        <div
          draggable={!!onDragStart && !isSubtask}
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex items-start pt-0.5"
        >
          <div className="flex-1 min-w-0">
            <div className="cursor-pointer transition-all">
              {/* Main row */}
              <div className="flex items-center justify-between">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  {/* Drag handle */}
                  {!isSubtask && onDragStart && (
                    <div className="text-[#DDDDDD] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <GripVertical className="h-4 w-4" />
                    </div>
                  )}

                  {/* Status icon button (quick complete toggle) */}
                  <button onClick={() => onToggleComplete?.(task)} className="shrink-0 hover:opacity-80 transition-opacity" title={isComplete ? "Mark incomplete" : "Mark complete"}>
                    {isComplete ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <rect x="1" y="1" width="18" height="18" rx="9" fill="#060606" />
                        <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="8.5" stroke="#D1D5DB" strokeWidth="1.5" fill="white" />
                      </svg>
                    )}
                  </button>

                  {/* Title (inline editable) */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <TitleEdit
                        title={task.taskName}
                        isEditing={isEditingTitle}
                        onStartEdit={() => setIsEditingTitle(true)}
                        onSubmit={(newTitle) => {
                          setIsEditingTitle(false);
                          if (newTitle !== task.taskName) onTitleChange?.(task, newTitle);
                        }}
                        onCancel={() => setIsEditingTitle(false)}
                      />
                      {/* Subtask collapse/expand */}
                      {hasSubtasks && (
                        <button onClick={() => onToggleSubtasks?.(task)} className="shrink-0 p-0.5 hover:bg-gray-200 rounded">
                          {showSubtasks ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-3 flex-1 justify-end ml-3">
                  {/* Created date */}
                  {task.createdAt && !isSubtask && (
                    <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:inline">
                      {task.createdAt.toDate ? new Date(task.createdAt.toDate()).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                    </span>
                  )}

                  {/* Status dropdown */}
                  <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(!showStatusDropdown); }}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap hover:opacity-80 transition-opacity"
                      style={statusStyle}
                    >
                      {task.status.name || task.status.parent}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    {showStatusDropdown && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowStatusDropdown(false)} />
                        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 min-w-[150px]">
                          <div className="px-3 pb-1.5 text-xs font-medium text-gray-500">Change Status</div>
                          {STATUS_OPTIONS.map((opt) => (
                            <button key={opt.name}
                              onClick={(e) => { e.stopPropagation(); setShowStatusDropdown(false); onStatusChange?.(task, opt); }}
                              className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-gray-50 transition-colors"
                            >
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                              <span style={{ fontWeight: opt.name === task.status.name ? "600" : "400" }}>{opt.name}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Context menu (3 dots) */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-all shrink-0">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                        <svg className="h-3.5 w-3.5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" /></svg>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(task)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />}
                </div>
              </div>

              {/* SECOND ROW: metadata */}
              {!isSubtask && (
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1 ml-9">
                  {/* Assignee */}
                  {assignee && (
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-[9px] font-medium">
                        {assignee.photoURL ? (
                          <Avatar className="h-5 w-5"><AvatarFallback className="text-[8px]">{getInitials(assignee.displayName)}</AvatarFallback></Avatar>
                        ) : getInitials(assignee.displayName)}
                      </div>
                      <span>{assignee.displayName}</span>
                    </div>
                  )}
                  {/* Due date */}
                  {dueDateValue && (
                    <span className={cn("flex items-center gap-1", dueDateValue < new Date() && !isComplete ? "text-red-500 font-medium" : "")}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(dueDateValue)}
                      {dueDateValue < new Date() && !isComplete && " (overdue)"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
