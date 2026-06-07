"use client";

import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Props for the centralized UserAvatar component.
 *
 * Works for ALL user types: owner, admin, member, client, lead, signer.
 * Priority: photoURL > fallback initials > "?".
 */
export interface UserAvatarProps {
  /** Image URL (Firebase photoURL, Cloudinary, etc.) */
  src?: string | null;
  /** Display name (used to compute initials) */
  name?: string | null;
  /** Email (fallback for initials if name is missing) */
  email?: string | null;
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Additional CSS classes */
  className?: string;
}

/** Sizes map to Tailwind classes for Avatar and Fallback text */
const sizeClasses = {
  xs: { avatar: "h-6 w-6", text: "text-[10px]" },
  sm: { avatar: "h-8 w-8", text: "text-xs" },
  md: { avatar: "h-10 w-10", text: "text-sm" },
  lg: { avatar: "h-12 w-12", text: "text-base" },
  xl: { avatar: "h-20 w-20", text: "text-2xl" },
} as const;

/**
 * Computes initials from a name string.
 * "John Doe" → "JD", "Alice" → "AL", "" → "?".
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length > 0) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "?";
}

export const UserAvatar = memo(function UserAvatar({
  src,
  name,
  email,
  size = "md",
  className,
}: UserAvatarProps) {
  const s = sizeClasses[size];
  const displayName = (name || email || "?").trim();
  const initials = getInitials(displayName);
  const hasImage = !!(src && src.trim());

  return (
    <Avatar className={cn(s.avatar, "shrink-0", className)}>
      {hasImage && <AvatarImage src={src} alt={displayName} />}
      <AvatarFallback
        className={cn(
          s.text,
          "font-medium bg-primary/10 text-primary",
          className
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
});
