"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

const TIME_SLOTS_30: string[] = [];
for (let h = 0; h < 24; h++) {
  TIME_SLOTS_30.push(
    `${h.toString().padStart(2, "0")}:00`,
    `${h.toString().padStart(2, "0")}:30`
  );
}

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export function TimePicker({
  value,
  onChange,
  className,
  disabled = false,
  placeholder = "Select time",
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value || "");
  const listRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync external value
  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Scroll to selected item when opening
  React.useEffect(() => {
    if (isOpen && listRef.current && value) {
      const selected = listRef.current.querySelector(`[data-value="${value}"]`);
      if (selected) {
        selected.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [isOpen, value]);

  const handleSelect = (time: string) => {
    setInputValue(time);
    onChange(time);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    // Auto-submit valid time patterns
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(val)) {
      onChange(val);
    }
  };

  const handleBlur = () => {
    // Close dropdown on blur (with delay for click)
    setTimeout(() => {
      if (!listRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 200);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-8",
            !inputValue && "text-muted-foreground"
          )}
        />
        <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            ref={listRef}
            className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-border bg-background shadow-lg"
          >
            {TIME_SLOTS_30.map((time) => (
              <button
                key={time}
                type="button"
                data-value={time}
                onClick={() => handleSelect(time)}
                className={cn(
                  "w-full px-3 py-1.5 text-left text-sm transition-colors",
                  value === time
                    ? "bg-foreground text-background font-medium"
                    : "text-foreground hover:bg-accent"
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
