import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  active: "border-sky-200 bg-sky-50 text-sky-700",
  draft: "border-slate-200 bg-slate-100 text-slate-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  open: "border-amber-200 bg-amber-50 text-amber-700",
  "in-progress": "border-violet-200 bg-violet-50 text-violet-700",
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  medium: "border-slate-200 bg-slate-100 text-slate-700",
  low: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function humanize(value: string) {
  return value.replace(/[-_]/g, " ");
}

export function getStatusTone(value?: string | null) {
  if (!value) {
    return toneMap.draft;
  }

  return toneMap[value.toLowerCase()] ?? "border-slate-200 bg-slate-100 text-slate-700";
}

export function StatusBadge({
  value,
  className,
  children,
}: {
  value?: string | null;
  className?: string;
  children?: ReactNode;
}) {
  const label = children ?? humanize(value || "draft");

  return (
    <Badge className={cn("capitalize", getStatusTone(value), className)} variant="outline">
      {label}
    </Badge>
  );
}
