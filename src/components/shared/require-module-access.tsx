"use client";

import { usePermissions } from "@/lib/hooks/use-permissions";
import type { ModuleId } from "@/types";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MODULE_LABELS } from "@/types";

interface RequireModuleAccessProps {
  moduleId: ModuleId;
  children: React.ReactNode;
}

export function RequireModuleAccess({ moduleId, children }: RequireModuleAccessProps) {
  const { canAccess, role } = usePermissions();

  if (!canAccess(moduleId)) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <div className="rounded-full bg-destructive/10 p-4 mb-6">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Access Denied
        </h2>
        <p className="text-muted-foreground text-center max-w-md mb-8">
          Your role ({role}) does not have access to{" "}
          <strong>{MODULE_LABELS[moduleId]}</strong>. Contact your workspace
          owner or admin to request access.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
