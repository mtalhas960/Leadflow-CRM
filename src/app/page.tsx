"use client";

import {
  AnimatedSection,
  FeatureSection,
  MockupInbox,
  MockupInsights,
  MockupPipeline,
  MockupTime,
} from "@/components/landing";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import {
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const highlights = [
  { label: "Setup time", value: "10 min" },
  { label: "Avg response lift", value: "26%" },
  { label: "Active teams", value: "1,200+" },
];

const outcomes = [
  {
    title: "Pipeline visibility",
    description: "Every stage, next step, and owner stays visible without spreadsheet drift.",
  },
  {
    title: "Shared execution",
    description: "Align sales, ops, and services in one workspace with clear handoffs.",
  },
  {
    title: "Revenue signals",
    description: "Get forecasts and conversion signals that stay readable at scale.",
  },
];

const proof = [
  {
    quote:
      "We went from a messy spreadsheet to a pipeline that updates itself in every standup.",
    name: "Ariana Holt",
    role: "Growth Lead, Fieldstack",
  },
  {
    quote:
      "The shared inbox and time tracking cut response time in half for our team.",
    name: "Marcus Lee",
    role: "RevOps Manager, Harbor",
  },
  {
    quote:
      "Analytics finally match our workflow. We track value and effort in the same view.",
    name: "Priya Das",
    role: "Founder, Sunpath Studio",
  },
];

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
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute left-1/2 top-20 h-48 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-sm">
              LF
            </div>
            <span className="text-lg font-semibold tracking-tight">LeadFlow</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex" aria-label="Primary">
            <a className="hover:text-foreground" href="#platform">Platform</a>
            <a className="hover:text-foreground" href="#features">Features</a>
            <a className="hover:text-foreground" href="#security">Security</a>
            <a className="hover:text-foreground" href="#cta">Get started</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Start free</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section id="hero" className="mx-auto w-full max-w-6xl px-6 pb-14 pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Built for teams that move fast
              </div>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                LeadFlow keeps every lead visible, every handoff clean, and every team aligned.
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Replace spreadsheets with a shared command center. Track pipeline, messages, and time in one place without the noise.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/register">Create account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Open app</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Secure workspace access
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  No credit card required
                </div>
              </div>
            </div>
            <div className="glass-card p-6 shadow-xl shadow-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Command center</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground">
                  Updated live
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "New inbound", value: "34", trend: "+12%" },
                  { label: "Qualified", value: "18", trend: "+6%" },
                  { label: "Closing", value: "7", trend: "+3%" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.label}</p>
                      <p className="text-xs text-muted-foreground">Leads in stage</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-foreground">{row.value}</p>
                      <p className="text-xs text-primary">{row.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {highlights.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                  >
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                    <p className="text-sm font-semibold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="mx-auto w-full max-w-6xl px-6 py-12">
          <AnimatedSection className="grid gap-6 lg:grid-cols-3" variant="up">
            {outcomes.map((item) => (
              <div key={item.title} className="glass-card p-6">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </AnimatedSection>
        </section>

        <div id="features" className="scroll-mt-24">
          <AnimatedSection variant="right" className="bg-white/5">
            <FeatureSection
              badge="Pipeline"
              title="Keep deals moving with absolute stage clarity."
              description="LeadFlow keeps every stage visible so your team can act on the next best move, not chase updates."
              bullets={[
                "Stage ownership and next-step reminders stay attached to every lead.",
                "Spot stalled deals with real-time stage movement.",
                "Share pipeline snapshots instantly with leadership.",
              ]}
              linkText="See the pipeline"
              linkHref="/pipeline"
              imageSide="right"
            >
              <MockupPipeline />
            </FeatureSection>
          </AnimatedSection>

          <AnimatedSection variant="left">
            <FeatureSection
              badge="Messaging"
              badgeTone="warning"
              title="Run outreach like a shared inbox, not a guessing game."
              description="Bring team conversations, lead messages, and meeting follow-ups into a single, accountable view."
              bullets={[
                "Shared threads keep your team aligned on every reply.",
                "Surface urgent leads with status and follow-up cues.",
                "Keep response times fast without losing context.",
              ]}
              linkText="Open messages"
              linkHref="/messages"
              imageSide="left"
              bulletIcon="arrow"
            >
              <MockupInbox />
            </FeatureSection>
          </AnimatedSection>

          <AnimatedSection variant="right" className="bg-white/5">
            <FeatureSection
              badge="Insights"
              title="Forecast with confidence using metrics that stay readable."
              description="Track revenue, win rates, and cycle times in one analytics layer so teams stay focused on priorities."
              bullets={[
                "Live KPI cards for leadership updates.",
                "Date ranges and exports for investor-ready reporting.",
                "Alignment between pipeline value and workload.",
              ]}
              linkText="View analytics"
              linkHref="/analytics"
              imageSide="right"
            >
              <MockupInsights />
            </FeatureSection>
          </AnimatedSection>

          <AnimatedSection variant="left">
            <FeatureSection
              badge="Time"
              badgeTone="warning"
              title="Connect time, effort, and revenue in the same view."
              description="Track billable work and operational effort so your team can protect margins and spot delivery risks early."
              bullets={[
                "Timer and manual entries keep delivery on track.",
                "See billable effort alongside pipeline value.",
                "Quickly translate effort into forecasts.",
              ]}
              linkText="Track time"
              linkHref="/time-tracker"
              imageSide="left"
            >
              <MockupTime />
            </FeatureSection>
          </AnimatedSection>
        </div>

        <section id="security" className="scroll-mt-24 border-t border-border/60 bg-background/70">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <AnimatedSection className="grid gap-8 lg:grid-cols-[1fr_1.2fr]" variant="up">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Security and control
                </p>
                <h3 className="font-display text-2xl font-semibold tracking-tight">
                  Permissioned access, audit trails, and predictable compliance.
                </h3>
                <p className="text-sm text-muted-foreground">
                  Workspace roles, audit logs, and export tooling keep admins confident and teams aligned.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Role-based module access",
                  "Audit log for lead actions",
                  "Workspace member governance",
                  "Flexible exports for reporting",
                ].map((item) => (
                  <div key={item} className="glass-card p-4 text-sm text-muted-foreground flex items-center justify-center">
                    {item}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section id="proof" className="mx-auto w-full max-w-6xl px-6 py-16">
          <AnimatedSection className="text-center" variant="fade">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5" />
              Trusted by growth teams
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              Teams switching to LeadFlow ship faster, together.
            </h3>
          </AnimatedSection>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {proof.map((item) => (
              <AnimatedSection key={item.name} className="glass-card p-6" variant="up">
                <p className="text-sm text-muted-foreground">&quot;{item.quote}&quot;</p>
                <div className="mt-4 text-sm font-semibold text-foreground">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.role}</div>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section id="cta" className="mx-auto w-full max-w-6xl px-6 pb-20">
          <AnimatedSection className="glass-card p-8 text-center" variant="up">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Users className="h-4 w-4" />
              Start with your team today
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
              Ready to build a pipeline your whole team trusts?
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Create your workspace, invite teammates, and see your first pipeline in minutes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">Start free</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Average setup time under 10 minutes.
            </div>
          </AnimatedSection>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>LeadFlow</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <a
              href="mailto:contact@tabishbinishfaq.dev"
              className="hover:text-foreground"
            >
              contact@tabishbinishfaq.dev
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
