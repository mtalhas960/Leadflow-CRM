"use client";

import { deleteProject, updateProject } from "@/lib/firebase/projects";
import type { Project } from "@/types";
import { useWorkspace } from "@/contexts/workspace-context";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { MoreVertical, Plus, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "#22c55e" },
  on_hold: { label: "On Hold", color: "#f59e0b" },
  completed: { label: "Completed", color: "#3b82f6" },
  cancelled: { label: "Cancelled", color: "#ef4444" },
};

const COLUMN_ORDER_KEY = "leadflow_kanban_column_order";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 0) {
    if (days > -7) return `Due in ${Math.abs(days)} day${Math.abs(days) > 1 ? "s" : ""}`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  if (days === 0) return "Due today";
  if (days === 1) return "Due yesterday";
  if (days <= 7) return `Due ${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Status Column Interface ──────────────────────────────────────────────────

interface StatusColumn {
  id: string;
  key: string;
  label: string;
  color: string;
}

// ─── Droppable Column ─────────────────────────────────────────────────────────

function DroppableColumn({
  column,
  children,
}: {
  column: StatusColumn;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: { columnKey: column.key },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-[120px] h-full rounded-lg transition-colors p-3 flex flex-col overflow-hidden ${
        isOver ? "bg-accent/50 ring-2 ring-primary/30" : "bg-muted/30"
      }`}
    >
      {children}
    </div>
  );
}

// ─── Draggable Project Card ───────────────────────────────────────────────────

function DraggableProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `project-${project.id}`,
    data: { projectId: project.id },
  });

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayProgress = project.isManualProgress
    ? project.manualProgress ?? project.progress
    : project.progress;

  const clientNames = useMemo(() => {
    if (!project.projectClients || project.projectClients.length === 0) {
      return project.clients?.length ? `${project.clients.length} client(s)` : "No clients";
    }
    return project.projectClients.length === 1
      ? "1 client"
      : `${project.projectClients.length} clients`;
  }, [project.projectClients, project.clients]);

  useEffect(() => {
    if (!showMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-kanban-menu]")) return;
    window.location.href = `/projects/${project.id}`;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(project.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-50 z-50" : ""}
    >
      <div
        className="bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        {/* Header: Title + Menu */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-foreground truncate leading-tight">
              {project.name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Users className="h-3 w-3 shrink-0" />
              <span className="truncate">{clientNames}</span>
            </div>
          </div>
          <div className="relative shrink-0" data-kanban-menu ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted"
              aria-label="Project options"
            >
              <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-popover border border-border rounded-md shadow-lg z-50 py-1 min-w-[120px]">
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-3 py-1.5 text-left text-xs text-destructive hover:bg-destructive/10 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.min(displayProgress, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">{displayProgress}%</span>
        </div>

        {/* Footer: Task count + Due date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0/0 tasks</span>
          {project.dueDate && (
            <span className={project.dueDate.toDate() < new Date() ? "text-destructive font-medium" : ""}>
              {formatDate(project.dueDate.toDate())}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ProjectKanbanBoard ───────────────────────────────────────────────────────

interface ProjectKanbanBoardProps {
  projects: Project[];
  statusFilter: string;
  onRefresh: () => void;
}

export default function ProjectKanbanBoard({
  projects,
  statusFilter,
  onRefresh,
}: ProjectKanbanBoardProps) {
  const { activeWorkspace } = useWorkspace();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Column ordering
  const [orderedColumnKeys, setOrderedColumnKeys] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(COLUMN_ORDER_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as string[];
          // Validate all keys exist
          const validKeys = Object.keys(STATUS_CONFIG).filter(
            (k) => statusFilter === "all" || k === statusFilter
          );
          if (parsed.some((k) => validKeys.includes(k))) return parsed;
        }
      } catch {
        // ignore
      }
    }
    return Object.keys(STATUS_CONFIG).filter(
      (k) => statusFilter === "all" || k === statusFilter
    );
  });

  // Build column list respecting order
  const columns = useMemo((): StatusColumn[] => {
    const configKeys = Object.keys(STATUS_CONFIG).filter(
      (k) => statusFilter === "all" || k === statusFilter
    );
    const ordered = orderedColumnKeys.filter((k) => configKeys.includes(k));
    const missing = configKeys.filter((k) => !ordered.includes(k));
    const merged = [...ordered, ...missing];
    return merged.map((key) => ({
      id: key,
      key,
      label: STATUS_CONFIG[key].label,
      color: STATUS_CONFIG[key].color,
    }));
  }, [orderedColumnKeys, statusFilter]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Map projects to their status column
  const projectsByColumn = useMemo(() => {
    const map: Record<string, Project[]> = {};
    for (const col of columns) {
      map[col.key] = [];
    }
    for (const project of projects) {
      if (map[project.status]) {
        map[project.status].push(project);
      }
    }
    return map;
  }, [projects, columns]);

  // ── Drag Handlers ─────────────────────────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    const projectId = event.active.data.current?.projectId as string;
    setActiveProjectId(projectId);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveProjectId(null);
    const { active, over } = event;
    if (!over) return;

    const projectId = active.data.current?.projectId as string;
    const targetColumnKey = over.data.current?.columnKey as string;
    if (!targetColumnKey) return;

    const targetColumn = columns.find((c) => c.key === targetColumnKey);
    if (!targetColumn) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project || project.status === targetColumnKey) return;

    // Optimistic update: status changed in parent via refresh
    try {
      await updateProject(projectId, {
        status: targetColumnKey as Project["status"],
      });
      toast.success(`Moved to ${targetColumn.label}`);
      onRefresh();
    } catch {
      toast.error("Failed to update project status");
      onRefresh();
    }
  };

  // ── Column Reorder (native HTML5 drag) ───────────────────────────────────

  const handleColumnDragStart = (
    e: React.DragEvent,
    column: StatusColumn
  ) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", column.key);
  };

  const handleColumnDrop = (e: React.DragEvent, overColumnKey: string) => {
    e.preventDefault();
    const activeKey = e.dataTransfer.getData("text/plain");
    if (!activeKey || activeKey === overColumnKey) return;

    setOrderedColumnKeys((prev) => {
      const activeIdx = prev.indexOf(activeKey);
      const overIdx = prev.indexOf(overColumnKey);
      if (activeIdx < 0 || overIdx < 0) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(activeIdx, 1);
      updated.splice(overIdx, 0, moved);

      // Persist to localStorage
      try {
        localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // ── Delete Project ───────────────────────────────────────────────────────

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProject(projectId);
      toast.success("Project deleted");
      onRefresh();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  // ── Active project for DragOverlay ───────────────────────────────────────

  const activeProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId)
    : null;

  const isLockedColumn = (index: number) => index === 0;

  return (
    <div className="pt-6 flex flex-col" style={{ height: "calc(100vh - 280px)" }}>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-3 overflow-x-auto flex-1 pb-4">
          {columns.map((column, index) => {
            const colProjects = projectsByColumn[column.key] || [];

            return (
              <div
                key={column.id}
                className={`min-w-[280px] w-[280px] flex-shrink-0 group/column flex flex-col h-full ${
                  !isLockedColumn(index) ? "cursor-grab active:cursor-grabbing" : ""
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleColumnDrop(e, column.key)}
                draggable={!isLockedColumn(index)}
                onDragStart={(e) => handleColumnDragStart(e, column)}
                onDragEnd={() => {}}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: column.color }}
                  />
                  <h3 className="text-sm font-semibold text-foreground truncate !mb-0">
                    {column.label}
                  </h3>
                  <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-medium ml-auto tabular-nums">
                    {colProjects.length}
                  </span>
                </div>

                {/* Droppable Column Body */}
                <DroppableColumn column={column}>
                  {/* Cards */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                    {colProjects.map((project) => (
                      <DraggableProjectCard
                        key={project.id}
                        project={project}
                        onDelete={handleDeleteProject}
                      />
                    ))}

                    {colProjects.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <p className="text-xs text-muted-foreground">No projects</p>
                      </div>
                    )}
                  </div>

                  {/* New Project Button */}
                  <div className="pt-2 sticky bottom-0 bg-muted/30">
                    <Link
                      href={`/projects/new?status=${column.key}`}
                      className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-md border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Project
                    </Link>
                  </div>
                </DroppableColumn>
              </div>
            );
          })}

          {/* Add Status placeholder (disabled - uses built-in statuses) */}
          {statusFilter === "all" && (
            <div className="min-w-[180px] w-[180px] flex-shrink-0 self-start">
              <div className="min-h-[45px] w-full rounded-lg p-2 bg-muted/20 flex items-center justify-center border-2 border-dashed border-border opacity-50">
                <span className="text-xs text-muted-foreground">Built-in statuses</span>
              </div>
            </div>
          )}
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeProject ? (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg rotate-2 opacity-90 w-[240px]">
              <h4 className="text-xs font-semibold text-foreground truncate">
                {activeProject.name}
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Moving...</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
