import { BarChart3, Clock, MessageSquare, Target } from "lucide-react";

export function MockupPipeline() {
  return (
    <div className="glass-card w-full max-w-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Pipeline focus</p>
          <p className="text-xs text-muted-foreground">Weekly snapshot</p>
        </div>
        <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
          Live sync
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {[
          { label: "Inbound", value: 32, color: "bg-[hsl(var(--status-new))]" },
          { label: "Qualified", value: 18, color: "bg-[hsl(var(--status-qualified))]" },
          { label: "Proposal", value: 9, color: "bg-[hsl(var(--status-proposal))]" },
        ].map((row) => (
          <div key={row.label} className="rounded-xl border border-border/60 bg-background/60 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-semibold text-foreground">{row.value}</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className={`h-2 rounded-full ${row.color}`} style={{ width: `${row.value * 2}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockupInbox() {
  return (
    <div className="glass-card w-full max-w-md p-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <MessageSquare className="h-4 w-4 text-primary" />
        Shared inbox
      </div>
      <div className="mt-4 space-y-3">
        {["Acme rollout", "Design review", "Next-step proposal"].map((title, index) => (
          <div key={title} className="rounded-lg border border-border/60 bg-background/60 px-4 py-3">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">
              {index === 0 ? "Lead replied 12m ago" : index === 1 ? "Draft ready" : "Needs approval"}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
          <p className="text-xs text-muted-foreground">Median response</p>
          <p className="text-sm font-semibold">3h</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2">
          <p className="text-xs text-muted-foreground">Open threads</p>
          <p className="text-sm font-semibold">14</p>
        </div>
      </div>
    </div>
  );
}

export function MockupInsights() {
  return (
    <div className="glass-card w-full max-w-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Revenue signals</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <BarChart3 className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-5 space-y-3">
        {[
          { label: "Pipeline value", value: "$280k" },
          { label: "Win rate", value: "28%" },
          { label: "Avg cycle", value: "18 days" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockupTime() {
  return (
    <div className="glass-card w-full max-w-md p-6">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Clock className="h-4 w-4 text-primary" />
        Time + value
      </div>
      <div className="mt-4 space-y-3">
        {[
          { label: "Discovery call", value: "0:42", status: "Billable" },
          { label: "Proposal build", value: "1:15", status: "In review" },
          { label: "Follow-up", value: "0:18", status: "Scheduled" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm">
            <div>
              <p className="font-medium text-foreground">{row.label}</p>
              <p className="text-xs text-muted-foreground">{row.status}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              {row.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
