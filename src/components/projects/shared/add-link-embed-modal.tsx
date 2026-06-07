"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Code, Globe } from "lucide-react";

interface AddLinkEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: "link" | "embed";
    title: string;
    url?: string;
    embedCode?: string;
  }) => void;
  isLoading?: boolean;
  initialType?: "link" | "embed";
}

export function AddLinkEmbedModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialType,
}: AddLinkEmbedModalProps) {
  const [type, setType] = useState<"link" | "embed" | undefined>(initialType);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setTitle("");
      setUrl("");
      setEmbedCode("");
      setErrors({});
    }
  }, [isOpen, initialType]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!type) newErrors.type = "Select Link or Embed";
    if (!title.trim()) newErrors.title = "Title is required";
    if (type === "link" && !url.trim()) newErrors.url = "URL is required";
    if (type === "embed" && !embedCode.trim()) newErrors.embedCode = "Embed code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !type) return;
    onSubmit({
      type,
      title: title.trim(),
      ...(type === "link" && {
        url: url.trim().match(/^https?:\/\//i) ? url.trim() : `https://${url.trim()}`,
      }),
      ...(type === "embed" && { embedCode: embedCode.trim() }),
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setType(initialType);
    setTitle("");
    setUrl("");
    setEmbedCode("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-lg p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="text-lg font-semibold">
            {initialType === "link"
              ? "Add Link"
              : initialType === "embed"
                ? "Add Embed"
                : "Add a Link or Embed"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Selector */}
          {!initialType && (
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setType("link"); setErrors({}); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${type === "link"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                >
                  <LinkIcon className="h-4 w-4" />
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => { setType("embed"); setErrors({}); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${type === "embed"
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                >
                  <Code className="h-4 w-4" />
                  Embed
                </button>
              </div>
              {errors.type && <p className="mt-1 text-xs text-destructive">{errors.type}</p>}
            </div>
          )}

          {/* Title */}
          {type && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === "link" ? "Link title" : "Embed title"}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground ${errors.title ? "border-destructive" : "border-border"
                  }`}
                disabled={isLoading}
                autoFocus
              />
              {errors.title && (
                <p className="mt-1 text-xs text-destructive">{errors.title}</p>
              )}
            </div>
          )}

          {/* URL (for link) */}
          {type === "link" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                <Globe className="h-3.5 w-3.5 inline mr-1" />
                URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground ${errors.url ? "border-destructive" : "border-border"
                  }`}
                disabled={isLoading}
              />
              {errors.url && (
                <p className="mt-1 text-xs text-destructive">{errors.url}</p>
              )}
            </div>
          )}

          {/* Embed Code (for embed) */}
          {type === "embed" && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                <Code className="h-3.5 w-3.5 inline mr-1" />
                Embed Code
              </label>
              <textarea
                value={embedCode}
                onChange={(e) => setEmbedCode(e.target.value)}
                placeholder="Paste HTML embed code..."
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground font-mono ${errors.embedCode ? "border-destructive" : "border-border"
                  }`}
                disabled={isLoading}
              />
              {errors.embedCode && (
                <p className="mt-1 text-xs text-destructive">{errors.embedCode}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="text-xs"
              disabled={isLoading || !type}
            >
              {isLoading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
