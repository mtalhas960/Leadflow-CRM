"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { RequireModuleAccess } from "@/components/shared/require-module-access";
import { StatCard } from "@/components/shared/stat-card";
import { SkeletonCardGrid } from "@/components/skeletons/skeleton-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHeaderActions } from "@/contexts/header-actions-context";
import { useWorkspace } from "@/contexts/workspace-context";
import { getLeadStats } from "@/lib/firebase/firestore";
import { getContracts } from "@/lib/firebase/contracts";
import { getInvoices } from "@/lib/firebase/invoices";
import { usePermissions } from "@/lib/hooks/use-permissions";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  DollarSign,
  FileText,
  FolderKanban,
  MessageSquare,
  PenTool,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface LeadStats {
  total: number;
  totalValue: number;
  forecastedRevenue: number;
  byStatus: Record<string, number>;
}

interface DashboardCounts {
  projects: number;
  invoices: number;
  contracts: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { activeWorkspace, user } = useWorkspace();
  const { canAccess } = usePermissions();
  const { setHeaderActions } = useHeaderActions();
  const [leadStats, setLeadStats] = useState<LeadStats | null>(null);
  const [counts, setCounts] = useState<DashboardCounts>({ projects: 0, invoices: 0, contracts: 0 });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!activeWorkspace?.id) return;
    setLoading(true);
    try {
      const [leads, invoices, contracts] = await Promise.all([
        getLeadStats(activeWorkspace.id, activeWorkspace.pipeline?.stages).catch(() => null),
        getInvoices(activeWorkspace.id, { max: 200 }).catch(() => []),
        getContracts(activeWorkspace.id, { max: 200 }).catch(() => []),
      ]);
      setLeadStats(leads);
      setCounts({
        projects: 0, // Projects count fetched separately if needed
        invoices: invoices.length,
        contracts: contracts.length,
      });
    } finally {
      setLoading(false);
    }
  }, [activeWorkspace]);

  useEffect(() => { loadData(); }, [loadData]);

  const activeDeals = leadStats
    ? (leadStats.byStatus["new"] || 0) +
      (leadStats.byStatus["contacted"] || 0) +
      (leadStats.byStatus["qualified"] || 0) +
      (leadStats.byStatus["proposal"] || 0) +
      (leadStats.byStatus["negotiation"] || 0)
    : 0;

  const conversionRate =
    leadStats && leadStats.total > 0
      ? Math.round(((leadStats.byStatus["won"] || 0) / leadStats.total) * 100)
      : 0;

  const totalLeads = leadStats?.total ?? 0;
  const statusRows = [
    { key: "new", label: "New" },
    { key: "contacted", label: "Contacted" },
    { key: "qualified", label: "Qualified" },
    { key: "proposal", label: "Proposal" },
    { key: "negotiation", label: "Negotiation" },
    { key: "won", label: "Won" },
    { key: "lost", label: "Lost" },
  ].map((row) => {
    const count = leadStats?.byStatus[row.key] || 0;
    const percent = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    return { ...row, count, percent };
  });

  const hasLeads = canAccess("leads");
  const hasPipeline = canAccess("pipeline");
  const hasProjects = canAccess("projects");
  const hasInvoices = canAccess("invoices");
  const hasContracts = canAccess("contracts");
  const hasMeetings = canAccess("meetings");
  const hasMessages = canAccess("messages");

  const userName = user?.displayName || "there";

  useEffect(() => {
    if (loading || !hasLeads) {
      setHeaderActions(null);
      return;
    }
    setHeaderActions(
      <Button size="sm" onClick={() => router.push("/leads")}>
        <Plus className="mr-2 h-4 w-4" /> Add Lead
      </Button>
    );
    return () => setHeaderActions(null);
  }, [hasLeads, loading, router, setHeaderActions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCardGrid count={6} />
      </div>
    );
  }

  const anyModules = hasLeads || hasPipeline || hasProjects || hasInvoices || hasContracts || hasMeetings || hasMessages;
  const showPipeline = hasPipeline || hasLeads;

  return (
    <RequireModuleAccess moduleId="dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{userName !== "there" ? `, ${userName.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-muted-foreground">Here&apos;s what&apos;s happening across your workspace.</p>
        </div>

        {/* KPI Cards — all modules */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {hasLeads && (
            <StatCard title="Total Leads" value={totalLeads} icon={<Users className="h-5 w-5" />} accentColor="info" />
          )}
          {hasPipeline && (
            <StatCard title="Active Deals" value={activeDeals} icon={<Target className="h-5 w-5" />} accentColor="primary" />
          )}
          {hasPipeline && (
            <StatCard title="Pipeline Value" value={formatCurrency(leadStats?.totalValue ?? 0)} icon={<DollarSign className="h-5 w-5" />} accentColor="success" />
          )}
          {hasProjects && (
            <StatCard title="Active Projects" value={counts.projects} icon={<FolderKanban className="h-5 w-5" />} accentColor="primary" />
          )}
          {hasInvoices && (
            <StatCard title="Invoices" value={counts.invoices} icon={<FileText className="h-5 w-5" />} accentColor="warning" />
          )}
          {hasContracts && (
            <StatCard title="Contracts" value={counts.contracts} icon={<PenTool className="h-5 w-5" />} accentColor="info" />
          )}
        </div>

        {/* Content row: Pipeline + Quick Actions */}
        <div className="grid gap-4 lg:grid-cols-3">
          {showPipeline && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Pipeline Breakdown</CardTitle>
                <CardDescription>Lead distribution across stages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {statusRows.map((row) => (
                  <div key={row.key} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-medium">{row.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-primary/70" style={{ width: `${row.percent}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Jump into your work.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {hasLeads && (
                <Button variant="outline" size="sm" onClick={() => router.push("/leads")} className="justify-start">
                  <Users className="mr-2 h-4 w-4" /> View Leads
                </Button>
              )}
              {hasPipeline && (
                <Button variant="outline" size="sm" onClick={() => router.push("/pipeline")} className="justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" /> View Pipeline
                </Button>
              )}
              {hasProjects && (
                <Button variant="outline" size="sm" onClick={() => router.push("/projects")} className="justify-start">
                  <FolderKanban className="mr-2 h-4 w-4" /> View Projects
                </Button>
              )}
              {hasInvoices && (
                <Button variant="outline" size="sm" onClick={() => router.push("/invoices")} className="justify-start">
                  <FileText className="mr-2 h-4 w-4" /> View Invoices
                </Button>
              )}
              {hasContracts && (
                <Button variant="outline" size="sm" onClick={() => router.push("/contracts")} className="justify-start">
                  <PenTool className="mr-2 h-4 w-4" /> View Contracts
                </Button>
              )}
              {hasMeetings && (
                <Button variant="outline" size="sm" onClick={() => router.push("/meetings")} className="justify-start">
                  <Calendar className="mr-2 h-4 w-4" /> View Meetings
                </Button>
              )}
              {hasMessages && (
                <Button variant="outline" size="sm" onClick={() => router.push("/messages")} className="justify-start">
                  <MessageSquare className="mr-2 h-4 w-4" /> Open Messages
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty state for new workspaces */}
        {(!anyModules || totalLeads === 0) && (
          <EmptyState
            icon={<Target className="h-6 w-6" />}
            title="Welcome to LeadFlow CRM"
            description={
              anyModules
                ? "Start by adding leads to your pipeline, creating projects for your clients, or inviting team members."
                : "Contact your workspace admin to adjust your module permissions."
            }
            actionLabel={hasLeads ? "Add Your First Lead" : undefined}
            onAction={hasLeads ? () => router.push("/leads") : undefined}
          />
        )}
      </div>
    </RequireModuleAccess>
  );
}
