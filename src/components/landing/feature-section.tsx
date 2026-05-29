import Link from "next/link";
import type { ReactNode } from "react";

interface FeatureSectionProps {
  title: string;
  description: string;
  bullets: string[];
  linkText: string;
  linkHref: string;
  imageSide: "left" | "right";
  badge?: string;
  badgeTone?: "primary" | "warning";
  bulletIcon?: "check" | "arrow";
  children: ReactNode;
}

export function FeatureSection({
  title,
  description,
  bullets,
  linkText,
  linkHref,
  imageSide,
  badge,
  badgeTone = "primary",
  bulletIcon = "check",
  children,
}: FeatureSectionProps) {
  const badgeClasses =
    badgeTone === "warning"
      ? "bg-amber-500/15 border border-amber-400/40"
      : "bg-primary/15 border border-primary/30";
  const badgeText = badgeTone === "warning" ? "text-amber-200" : "text-primary";
  const bulletColor = badgeTone === "warning" ? "text-amber-200" : "text-primary";

  const bulletPath =
    bulletIcon === "arrow"
      ? "M5 12h14m0 0l-4-4m4 4l-4 4"
      : "M5 13l4 4L19 7";

  const textContent = (
    <div className="flex flex-col justify-center items-center text-center space-y-6 md:items-start md:text-left">
      {badge && (
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.2em] ${badgeClasses}`}>
          <span className={`text-xs font-semibold ${badgeText}`}>{badge}</span>
        </div>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
        {title}
      </h2>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
        {description}
      </p>
      <ul className="space-y-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 mx-auto md:mx-0">
            <svg
              className={`h-5 w-5 mt-0.5 flex-shrink-0 ${bulletColor}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={bulletPath} />
            </svg>
            <span className="text-sm text-muted-foreground text-left">{bullet}</span>
          </li>
        ))}
      </ul>
      <Link
        href={linkHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        {linkText}
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    </div>
  );

  return (
    <section className="py-12 md:py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={imageSide === "left" ? "order-2 lg:order-1" : "order-2"}>
            <div className="relative flex justify-center">{children}</div>
          </div>
          <div className={imageSide === "left" ? "order-1 lg:order-2" : "order-1"}>
            {textContent}
          </div>
        </div>
      </div>
    </section>
  );
}
