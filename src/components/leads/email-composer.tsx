"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { ChevronDown, ChevronUp, Eye, FileText, Loader2, Mail, MousePointer, Save, Send } from "lucide-react";
import { useState } from "react";

const EMAIL_TEMPLATES = [
  {
    id: "cold-outreach",
    name: "Cold Outreach",
    subject: "Introduction regarding {{company}}",
    body: `Hi {{firstName}},

I am reaching out to introduce myself and see if a brief discussion about {{company}}'s priorities would be useful.

If appropriate, are you available for a short call next week?

Regards,
{{sender}}`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    subject: "Following up regarding {{company}}",
    body: `Hi {{firstName}},

Following up on my earlier note regarding {{company}}.

If this is not the right contact, please let me know who I should reach.

If a short call would be useful, I can share times.

Regards,
{{sender}}`,
  },
  {
    id: "proposal",
    name: "Proposal",
    subject: "Proposal for {{company}}",
    body: `Hi {{firstName}},

Thank you for your time. As discussed, I have prepared a proposal tailored to {{company}}.

Key highlights:
- [Point 1]
- [Point 2]
- [Point 3]

Please let me know if you would like a brief walkthrough this week.

Regards,
{{sender}}`,
  },
  {
    id: "check-in",
    name: "Check-in",
    subject: "Checking in regarding {{company}}",
    body: `Hi {{firstName}},

Checking in regarding {{company}}'s upcoming priorities.

If there is a better time to reconnect, I can adjust.

Regards,
{{sender}}`,
  },
];

interface EmailComposerProps {
  leadEmail?: string;
  leadName?: string;
  leadCompany?: string;
  onSend: (data: { to: string; subject: string; body: string; trackOpens?: boolean; trackClicks?: boolean }) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailComposer({
  leadEmail,
  leadName,
  leadCompany,
  onSend,
  open,
  onOpenChange,
}: EmailComposerProps) {
  const [to, setTo] = useState(leadEmail || "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [trackOpens, setTrackOpens] = useState(true);
  const [trackClicks, setTrackClicks] = useState(true);

  const handleTemplateSelect = (templateId: string) => {
    const template = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      let subject = template.subject;
      let body = template.body;

      subject = subject
        .replace("{{company}}", leadCompany || "your company")
        .replace("{{firstName}}", leadName?.split(" ")[0] || "there");

      body = body
        .replace("{{company}}", leadCompany || "your company")
        .replace("{{firstName}}", leadName?.split(" ")[0] || "there")
        .replace("{{sender}}", "Me");

      setSubject(subject);
      setBody(body);
      setSelectedTemplate(templateId);
    }
  };

  const handleSend = async () => {
    if (!to.trim()) {
      toast.error("Recipient email is required");
      return;
    }
    if (!subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!body.trim()) {
      toast.error("Email body is required");
      return;
    }

    setSending(true);
    try {
      await onSend({
        to: to.trim(),
        subject: subject.trim(),
        body: body.trim(),
        trackOpens,
        trackClicks,
      });
      toast.success("Email sent successfully");
      handleClose();
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = () => {
    toast.info("Draft saved (simulated)");
    handleClose();
  };

  const handleClose = () => {
    setTo(leadEmail || "");
    setSubject("");
    setBody("");
    setSelectedTemplate("");
    setTrackOpens(true);
    setTrackClicks(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Compose Email
          </DialogTitle>
          <DialogDescription>
            Send an email to this lead. Templates can be auto-filled with lead details.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Template Selector */}
          <div className="space-y-2">
            <Label>Template (optional)</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {EMAIL_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {t.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To */}
          <div className="space-y-2">
            <Label>To</Label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="lead@example.com"
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label>Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your email..."
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          {/* Tracking Options */}
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Tracking</p>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="track-opens"
                checked={trackOpens}
                onCheckedChange={(checked) => setTrackOpens(checked as boolean)}
              />
              <Label htmlFor="track-opens" className="text-sm font-normal flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                Track opens
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="track-clicks"
                checked={trackClicks}
                onCheckedChange={(checked) => setTrackClicks(checked as boolean)}
              />
              <Label htmlFor="track-clicks" className="text-sm font-normal flex items-center gap-1.5">
                <MousePointer className="h-3.5 w-3.5" />
                Track clicks
              </Label>
            </div>
          </div>

          {/* Preview */}
          {subject && body && (
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
              <p className="text-sm font-medium">{subject}</p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                {body.split("\n").slice(0, 3).join("\n")}
                {body.split("\n").length > 3 ? "..." : ""}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleSaveDraft} disabled={sending}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TrackingStats {
  openCount: number;
  lastOpenedAt?: Date;
  clickCount: number;
  clickedUrls: string[];
}

interface EmailHistoryProps {
  emails: Array<{
    id: string;
    subject: string;
    to: string;
    status: string;
    sentAt: Date | null;
    tracking?: TrackingStats | null;
  }>;
}

export function EmailHistory({ emails }: EmailHistoryProps) {
  if (emails.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No emails sent yet.</p>;
  }

  return (
    <div className="space-y-3">
      {emails.map((email) => (
        <EmailHistoryItem key={email.id} email={email} />
      ))}
    </div>
  );
}

function EmailHistoryItem({
  email,
}: {
  email: {
    id: string;
    subject: string;
    to: string;
    status: string;
    sentAt: Date | null;
    tracking?: TrackingStats | null;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const tracking = email.tracking;
  const hasTracking = tracking && (tracking.openCount > 0 || tracking.clickCount > 0);

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{email.subject}</p>
          {hasTracking && (
            <div className="flex items-center gap-1.5 shrink-0">
              {tracking.openCount > 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Eye className="h-3 w-3" />
                  {tracking.openCount}
                </Badge>
              )}
              {tracking.clickCount > 0 && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <MousePointer className="h-3 w-3" />
                  {tracking.clickCount}
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={email.status === "sent" ? "default" : "secondary"} className="text-xs">
            {email.status}
          </Badge>
          {hasTracking && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={expanded ? "Collapse details" : "Expand details"}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        To: {email.to}
        {email.sentAt && ` • ${email.sentAt.toLocaleDateString()}`}
      </p>

      {expanded && hasTracking && (
        <div className="mt-2 pt-2 border-t space-y-2 text-xs">
          {tracking.openCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>
                Opened {tracking.openCount} time{tracking.openCount !== 1 ? "s" : ""}
                {tracking.lastOpenedAt && ` • Last: ${tracking.lastOpenedAt.toLocaleString()}`}
              </span>
            </div>
          )}
          {tracking.clickCount > 0 && tracking.clickedUrls.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MousePointer className="h-3.5 w-3.5" />
                <span>
                  Clicked {tracking.clickCount} time{tracking.clickCount !== 1 ? "s" : ""}
                </span>
              </div>
              <ul className="ml-5 space-y-0.5">
                {tracking.clickedUrls.map((url, idx) => (
                  <li key={idx} className="text-primary truncate" title={url}>
                    {url}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
