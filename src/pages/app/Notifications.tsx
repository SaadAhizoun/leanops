import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Bell, CheckCircle2, Clock3, Info, Search } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, FilterBar, LoadingState, PageHeader, PageShell } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type CaseItem = {
  id: string;
  title: string | null;
  status: string | null;
  current_stage: number | null;
  updated_at: string | null;
};

type ProjectItem = {
  id: string;
  title: string | null;
  status: string | null;
  updated_at: string | null;
};

type NotificationItem = {
  id: string;
  type: "case" | "project" | "system";
  title: string;
  body: string;
  href?: string;
  level: "info" | "warning" | "success";
  date: string;
};

function daysSince(dateString: string | null): number {
  if (!dateString) return 999;
  const now = new Date().getTime();
  const then = new Date(dateString).getTime();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export default function Notifications() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [casesResponse, projectsResponse] = await Promise.all([
        supabase.from("cases").select("id, title, status, current_stage, updated_at").order("updated_at", { ascending: false }),
        supabase.from("projects").select("id, title, status, updated_at").order("updated_at", { ascending: false }),
      ]);

      setCases((casesResponse.data as CaseItem[]) || []);
      setProjects((projectsResponse.data as ProjectItem[]) || []);
      setLoading(false);
    }

    loadData();
  }, []);

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [];

    cases.forEach((item) => {
      const age = daysSince(item.updated_at);

      if (item.status === "draft" && age >= 3) {
        items.push({
          id: `draft-${item.id}`,
          type: "case",
          title: "Draft case needs attention",
          body: `${item.title || "Untitled case"} has been inactive for ${age} day(s).`,
          href: `/app/problems/${item.id}`,
          level: "warning",
          date: item.updated_at || "",
        });
      }

      if (item.status === "active" && (item.current_stage || 1) >= 9) {
        items.push({
          id: `active-${item.id}`,
          type: "case",
          title: "Case is in execution phase",
          body: `${item.title || "Untitled case"} is now in a late stage and needs follow-up.`,
          href: `/app/problems/${item.id}`,
          level: "info",
          date: item.updated_at || "",
        });
      }

      if (item.status === "completed") {
        items.push({
          id: `done-${item.id}`,
          type: "case",
          title: "Case completed",
          body: `${item.title || "Untitled case"} has been closed successfully.`,
          href: `/app/problems/${item.id}`,
          level: "success",
          date: item.updated_at || "",
        });
      }
    });

    projects.forEach((item) => {
      const age = daysSince(item.updated_at);

      if (item.status !== "completed" && age >= 7) {
        items.push({
          id: `project-${item.id}`,
          type: "project",
          title: "Project needs review",
          body: `${item.title || "Untitled project"} has not been updated for ${age} day(s).`,
          href: `/app/projects/${item.id}`,
          level: "warning",
          date: item.updated_at || "",
        });
      }
    });

    items.push({
      id: "system-1",
      type: "system",
      title: "LeanOps reminder",
      body: "Keep your cases updated so action plans and dashboards stay useful.",
      level: "info",
      date: new Date().toISOString(),
    });

    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cases, projects]);

  const filtered = useMemo(() => {
    return notifications.filter((item) => `${item.title} ${item.body}`.toLowerCase().includes(search.toLowerCase()));
  }, [notifications, search]);

  const getIcon = (level: NotificationItem["level"]) => {
    if (level === "warning") return AlertTriangle;
    if (level === "success") return CheckCircle2;
    return Info;
  };

  const getLabel = (type: NotificationItem["type"]) => {
    if (type === "case") return "Case";
    if (type === "project") return "Project";
    return "System";
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Notifications"
        title="Follow-up and activity signals"
        description="Review what needs attention across cases, projects, and system reminders."
      />

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search notifications..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </FilterBar>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="Signals and reminders will appear here as your work grows."
        />
      ) : (
        <div className="section-stack">
          {filtered.map((item) => {
            const Icon = getIcon(item.level);

            return (
              <Card key={item.id}>
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="icon-tile">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950">{item.title}</h3>
                          <StatusBadge value={item.level}>{getLabel(item.type)}</StatusBadge>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>

                        <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.date ? new Date(item.date).toLocaleString() : "No date"}
                        </div>
                      </div>
                    </div>

                    {item.href ? (
                      <button
                        onClick={() => navigate(item.href!)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
                      >
                        Open
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
