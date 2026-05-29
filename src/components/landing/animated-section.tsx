"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useRef } from "react";

type AnimVariant = "up" | "left" | "right" | "fade";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variant?: AnimVariant;
  delay?: number;
  threshold?: number;
  as?: ElementType;
}

const VARIANT_CLASS: Record<AnimVariant, string> = {
  up: "anim-fade-up",
  left: "anim-fade-left",
  right: "anim-fade-right",
  fade: "anim-fade",
};

export default function AnimatedSection({
  children,
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.12,
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (delay > 0) el.style.animationDelay = `${delay}ms`;
        el.classList.remove("anim-hidden");
        el.classList.add(VARIANT_CLASS[variant]);
        observer.disconnect();
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, delay, threshold]);

  return (
    <Tag ref={ref} className={`anim-hidden ${className}`}>
      {children}
    </Tag>
  );
}
