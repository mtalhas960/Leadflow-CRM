"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  FolderKanban,
  Github,
  Globe,
  KanbanSquare,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Module config ─────────────────────────────────────────────────────────

interface ModuleItem {
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
}

const MODULES: ModuleItem[] = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Real-time overview of leads, pipeline value, and team activity at a glance." },
  { icon: Users, title: "Leads", description: "Capture, qualify, and nurture leads with custom fields, stages, and activity tracking." },
  { icon: KanbanSquare, title: "Pipeline", description: "Drag-and-drop Kanban pipeline with stage probability, deal value, and forecasts." },
  { icon: FolderKanban, title: "Projects", description: "Manage client projects with progress tracking, budgets, priorities, and deadlines." },
  { icon: FileText, title: "Invoices", description: "Create, send, and track invoices with line items, tax, and status workflows." },
  { icon: MessageSquare, title: "Messages", description: "Team inbox for lead and member conversations with read receipts and search." },
  { icon: Calendar, title: "Meetings", description: "Schedule, join, and manage meetings with client attendance and calendar sync." },
  { icon: Clock, title: "Time Tracking", description: "Track billable hours per lead and project with start/stop and manual entry." },
  { icon: BarChart3, title: "Analytics", description: "Pipeline value, conversion rates, cycle times, and exportable reports." },
];

const STATS = [
  { label: "Self-hosted ready", value: "Docker" },
  { label: "Setup time", value: "<10 min" },
  { label: "Free & open source", value: "MIT" },
];

const TESTIMONIALS = [
  {
    quote: "We replaced spreadsheets and two SaaS tools with LeadFlow. Pipeline, invoices, and time tracking in one place.",
    name: "Ariana Holt",
    role: "Growth Lead, Fieldstack",
  },
  {
    quote: "Open source means we own our data. Self-hosted in 10 minutes, no vendor lock-in, no per-seat pricing surprises.",
    name: "Marcus Lee",
    role: "RevOps Manager, Harbor",
  },
  {
    quote: "The modules actually cover our workflow - leads through invoices. Clients see their own portal. It just works.",
    name: "Priya Das",
    role: "Founder, Sunpath Studio",
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
        return;
      }
      setReady(true);
    });
    return () => unsubscribe();
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
            LF
          </div>
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-muted animate-pulse" />
            <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* ── Background Effects ── */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-64 w-96 -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.03)_0%,transparent_50%)]" />
      </div>

      {/* ── Nav ── */}
      <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-xs shadow-sm">
              LF
            </div>
            <span className="text-base font-bold tracking-tight">LeadFlow</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Primary">
            <a className="hover:text-foreground transition-colors" href="#modules">Modules</a>
            <a className="hover:text-foreground transition-colors" href="#open-source">Open Source</a>
            <a className="hover:text-foreground transition-colors" href="#testimonials">Testimonials</a>
            <a
              href="https://github.com/Tabish5858/leadflow-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden lg:inline">GitHub</span>
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("leadflow_demo_mode", "true");
                  window.location.href = "/dashboard";
                }
              }}
            >
              <Zap className="h-3.5 w-3.5" />
              Try Demo
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ── Hero ── */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3.5 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Open-source CRM built for modern teams
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              The open-source CRM
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                your team will actually use
              </span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
              Pipeline, projects, invoices, time tracking, messaging, and client portals - all in one
              open-source platform. Self-host or use instantly with zero signup.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="gap-2 text-base h-12 px-6"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("leadflow_demo_mode", "true");
                    window.location.href = "/dashboard";
                  }
                }}
              >
                <Zap className="h-5 w-5" />
                Try Live Demo - No Signup
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base h-12 px-6">
                <a href="https://github.com/Tabish5858/leadflow-crm" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  View on GitHub
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No account needed
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                Self-host available
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-12">
          <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/40 bg-background/50 p-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Modules Grid ── */}
        <section id="modules" className="scroll-mt-20 mx-auto w-full max-w-6xl px-6 pb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              Everything your team needs
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Nine modules. One workspace.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              From lead capture to invoicing, every workflow lives in a single, shared workspace.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <div
                key={mod.title}
                className="group rounded-xl border border-border/40 bg-background/40 p-5 transition-all hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <mod.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 font-semibold text-sm">{mod.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {mod.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open Source ── */}
        <section id="open-source" className="scroll-mt-20 border-t border-border/40 bg-background/50">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3.5 py-1 text-xs text-muted-foreground">
                  <Github className="h-3.5 w-3.5 text-primary" />
                  Open source, forever
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Own your CRM. Own your data.
                </h2>
                <p className="text-muted-foreground">
                  LeadFlow is fully open source under the MIT license. Self-host with Docker,
                  customize every module, and never worry about vendor lock-in or surprise pricing.
                </p>
                <div className="space-y-3">
                  {[
                    "Self-host in under 10 minutes with Docker Compose",
                    "Full data ownership - no data leaves your infrastructure",
                    "MIT license - fork, modify, redistribute freely",
                    "No per-seat pricing, no feature gates, no contracts",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button asChild variant="outline" className="gap-2">
                    <a href="https://github.com/Tabish5858/leadflow-crm" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      GitHub Repository
                    </a>
                  </Button>
                  <Button asChild variant="ghost" className="gap-2">
                    <a href="https://github.com/Tabish5858/leadflow-crm/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
                      MIT License
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Globe, title: "Self-hosted", desc: "Docker Compose, your server, your data." },
                  { icon: Users, title: "Role-based access", desc: "Owner, admin, member, viewer, client - each with granular permissions." },
                  { icon: ShieldCheck, title: "Audit trail", desc: "Every mutation logged. Know who did what and when." },
                  { icon: FileText, title: "Client portal", desc: "Clients see projects, invoices, and documents in a dedicated dashboard." },
                ].map((f) => (
                  <div key={f.title} className="rounded-xl border border-border/40 bg-background/40 p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <f.icon className="h-4 w-4" />
                    </div>
                    <h4 className="mt-2 font-semibold text-sm">{f.title}</h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials" className="scroll-mt-20 mx-auto w-full max-w-6xl px-6 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/60 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <Star className="h-3.5 w-3.5 text-primary" />
              Loved by teams
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Teams switching to LeadFlow
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-border/40 bg-background/40 p-6"
              >
                <p className="text-sm text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 border-t border-border/40 pt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-20">
          <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-primary/5 via-background to-background p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Try it now. No signup needed.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Click one button and you&apos;re in a fully-loaded workspace with real demo data.
              Pipeline, invoices, projects, documents - all pre-configured.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                className="gap-2 text-base h-12 px-6"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.setItem("leadflow_demo_mode", "true");
                    window.location.href = "/dashboard";
                  }
                }}
              >
                <Zap className="h-5 w-5" />
                Launch Demo
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 text-base h-12 px-6">
                <a href="https://github.com/Tabish5858/leadflow-crm" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                  Star on GitHub
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No account. No credit card. Just click and explore.
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-[10px]">
              LF
            </div>
            <span className="font-semibold">LeadFlow</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">Open-source CRM</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <a
              href="https://github.com/Tabish5858/leadflow-crm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <a href="mailto:contact@tabishbinishfaq.dev" className="hover:text-foreground transition-colors">
              Contact
            </a>
            <span className="text-muted-foreground/60">
              MIT License
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
