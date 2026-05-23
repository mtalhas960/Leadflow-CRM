"use client";

import { useEffect, useState } from "react";
import { useWorkspace } from "@/contexts/workspace-context";
import { getLeadStats } from "@/lib/firebase/firestore";
import { StatCard } from "@/components/shared/stat-card";
import { SkeletonCardGrid } from "@/components/skeletons/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, DollarSign, Target, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { RequireModuleAccess } from "@/components/shared/require-module-access";
import { usePermissions } from "@/lib/hooks/use-permissions";

interface Stats {
  total: number;
  totalValue: number;
  byStatus: Record<string, number>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspace();
  const { canAccess } = usePermissions();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activeWorkspace) return;
    getLeadStats(activeWorkspace.id)
      .then((data) => {
        setStats(data);
      })
      .finally(() => setLoading(false));
  }, [activeWorkspace?.id, activeWorkspace]);

  const activeDeals = stats
    ? (stats.byStatus["new"] || 0) +
      (stats.byStatus["contacted"] || 0) +
      (stats.byStatus["qualified"] || 0) +
      (stats.byStatus["proposal"] || 0) +
      (stats.byStatus["negotiation"] || 0)
    : 0;

  const conversionRate =
    stats && stats.total > 0
      ? Math.round(((stats.byStatus["won"] || 0) / stats.total) * 100)
      : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-48 skeleton rounded-md" />
          <div className="h-4 w-72 skeleton rounded-md" />
        </div>
        <SkeletonCardGrid count={4} />
      </div>
    );
  }

  return (
    <RequireModuleAccess moduleId="dashboard">
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here&apos;s an overview of your CRM."
        actions={
          <Button onClick={() => router.push("/leads")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        }
      />

      {/* KPI Cards — filtered by module access */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {canAccess("leads") && (
          <StatCard
            title="Total Leads"
            value={stats?.total ?? 0}
            icon={<Users className="h-5 w-5" />}
            accentColor="info"
          />
        )}
        {canAccess("pipeline") && (
          <StatCard
            title="Active Deals"
            value={activeDeals}
            icon={<Target className="h-5 w-5" />}
            accentColor="primary"
          />
        )}
        {canAccess("pipeline") && (
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(stats?.totalValue ?? 0)}
            icon={<DollarSign className="h-5 w-5" />}
            accentColor="success"
          />
        )}
        {canAccess("analytics") && (
          <StatCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            icon={<TrendingUp className="h-5 w-5" />}
            accentColor="warning"
          />
        )}
      </div>

      {/* Upcoming Events — only if time tracker access */}
      {canAccess("time_tracker") && <UpcomingEvents />}

      {/* Empty State / Getting Started — only if leads access */}
      {stats?.total === 0 && canAccess("leads") && (
        <EmptyState
          icon={<Users className="h-6 w-6" />}
          title="No leads yet"
          description="Start building your pipeline by adding your first lead. Track deals, manage contacts, and close more sales."
          actionLabel="Add Your First Lead"
          onAction={() => router.push("/leads")}
        />
      )}
      {/* Show info when no accessible modules have data */}
      {stats?.total === 0 && !canAccess("leads") && (
        <EmptyState
          icon={<Target className="h-6 w-6" />}
          title="Welcome to LeadFlow"
          description="Your workspace admin has configured module access. Contact them to adjust your permissions."
        />
      )}
    </div>
    </RequireModuleAccess>
  );
}
