import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
};

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

type SectionCardProps = HTMLAttributes<HTMLElement> & {
  as?: "section" | "div";
};

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  className?: string;
};

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: PageHeaderProps) {
  return (
    <section className={cn("page-header motion-safe:animate-fade-in", className)}>
      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? <p className="page-eyebrow">{eyebrow}</p> : null}
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-description">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3 xl:justify-end">{actions}</div> : null}
      </div>
      {children ? <div className="relative z-10 mt-7">{children}</div> : null}
    </section>
  );
}

export function PageShell({ children, className }: PageShellProps) {
  return <div className={cn("page-shell", className)}>{children}</div>;
}

export function SectionCard({ as = "section", className, ...props }: SectionCardProps) {
  const Comp = as;

  return <Comp className={cn("surface-card p-6 motion-safe:animate-fade-in md:p-7 lg:p-8", className)} {...props} />;
}

export function StatsGrid({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("stats-grid", className)} {...props} />;
}

export function FilterBar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("filter-bar motion-safe:animate-fade-in", className)} {...props} />;
}

export function ChipToggle({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn("chip-toggle", active ? "chip-toggle-active" : "chip-toggle-idle", className)}
      type="button"
      {...props}
    />
  );
}

export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}>
      <div className="loading-spinner" />
      <div className="space-y-2">
        <Skeleton className="mx-auto h-2.5 w-24 rounded-full" />
        <Skeleton className="mx-auto h-2.5 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="max-w-2xl">
        {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-subtitle">{description}</p> : null}
      </div>
      {action ? <div className="flex items-center gap-3">{action}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <div className={cn("metric-card motion-safe:animate-fade-in", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.92))] shadow-sm">
            <Icon className="h-5 w-5 text-slate-700" />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("empty-state motion-safe:animate-fade-in", className)}>
      {Icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.92))] shadow-sm">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      ) : null}
      <div>
        <p className="mt-5 text-base font-semibold text-slate-950">{title}</p>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
