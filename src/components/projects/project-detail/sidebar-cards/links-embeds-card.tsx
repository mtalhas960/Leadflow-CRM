"use client";

import { useState } from "react";
import { Link as LinkIcon, Code, Plus, Trash2 } from "lucide-react";
import type { Project, LinkEmbed } from "@/types";
import { updateProject } from "@/lib/firebase/projects";
import { toast } from "@/lib/toast";
import { EmbedViewerModal } from "@/components/projects/shared/embed-viewer-modal";
import { AddLinkEmbedModal } from "@/components/projects/shared/add-link-embed-modal";

interface LinksEmbedsCardProps {
  project: Project;
  onProjectUpdated?: () => void;
  canEdit?: boolean;
}

export default function LinksEmbedsCard({ project, onProjectUpdated, canEdit = true }: LinksEmbedsCardProps) {
  const [saving, setSaving] = useState(false);
  // Add link/embed modal
  const [showAddModal, setShowAddModal] = useState(false);
  // Embed viewer
  const [viewingEmbed, setViewingEmbed] = useState<LinkEmbed | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);

  const handleAdd = async (data: { type: "link" | "embed"; title: string; url?: string; embedCode?: string }) => {
    setSaving(true);
    try {
      const newItem: LinkEmbed = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        title: data.title,
        addedBy: "",
        addedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as import("firebase/firestore").Timestamp,
        // Only include url/embedCode if defined — Firestore rejects undefined values
        ...(data.url !== undefined ? { url: data.url } : {}),
        ...(data.embedCode !== undefined ? { embedCode: data.embedCode } : {}),
      };
      await updateProject(project.id, {
        linksAndEmbeds: [...(project.linksAndEmbeds || []), newItem],
      });
      toast.success(data.type === "link" ? "Link added" : "Embed added");
      onProjectUpdated?.();
    } catch {
      toast.error("Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await updateProject(project.id, {
        linksAndEmbeds: (project.linksAndEmbeds || []).filter((l) => l.id !== itemId),
      });
      toast.success("Removed");
      onProjectUpdated?.();
    } catch {
      toast.error("Failed to remove");
    }
  };

  const items = project.linksAndEmbeds || [];

  return (
    <>
      <div className="flex flex-col p-5 w-full bg-card border border-border hover:border-foreground/20 transition-colors" style={{ borderRadius: "8px" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Links &amp; Embeds</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowAddModal(true)}
              className="h-6 w-6 rounded-full border border-border bg-card flex items-center justify-center hover:bg-accent"
              title="Add link or embed"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="space-y-1.5 max-h-[250px] overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            canEdit ? (
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full py-3 border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                <Plus className="h-4 w-4 mx-auto mb-1" />
                Add Link or Embed
              </button>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-3">No links or embeds</p>
            )
          ) : (
            items.map((item) => (
              <div key={item.id} className="group flex items-center gap-2 p-2 rounded-lg hover:bg-accent/30 transition-colors">
                {item.type === "embed" ? (
                  <Code className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                ) : (
                  <LinkIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                {item.type === "link" ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 text-xs font-medium text-foreground truncate hover:underline"
                  >
                    {item.title}
                  </a>
                ) : (
                  <button
                    onClick={() => { setViewingEmbed(item); setShowEmbedModal(true); }}
                    className="flex-1 min-w-0 text-xs font-medium text-foreground truncate text-left hover:underline"
                  >
                    {item.title}
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded hover:bg-destructive/10 shrink-0"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <AddLinkEmbedModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAdd}
        isLoading={saving}
      />
      <EmbedViewerModal embed={viewingEmbed} isOpen={showEmbedModal} onClose={() => { setShowEmbedModal(false); setViewingEmbed(null); }} />
    </>
  );
}
