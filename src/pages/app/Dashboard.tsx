import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  Plus,
  FolderOpen,
  BookOpen,
  Wrench,
  FolderKanban,
  ListChecks,
  ArrowRight,
  Clock3,
  Activity,
  CheckCircle2,
  FileText,
  AlertTriangle,
  BarChart3,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type CaseItem = {
  id: string;
  title: string | null;
  status: string | null;
  current_stage: number | null;
  problem_type: string | null;
  sector: string | null;
  updated_at: string | null;
};

type ProjectItem = {
  id: string;
  title: string | null;
  status: string | null;
  updated_at: string | null;
};

type ActionItem = {
  id: string;
  case_id: string;
  title: string;
  status: string;
  deadline: string | null;
  owner: string | null;
  updated_at: string | null;
};

type AnnouncementItem = {
  id: string;
  title: string;
  content: string;
  active: boolean;
  updated_at: string | null;
};

const quickActions = [
  {
    title: "Start New Case",
    description: "Create a structured problem-solving case",
    icon: Plus,
    href: "/app/problems/new",
  },
  {
    title: "My Work",
    description: "Continue drafts and active cases",
    icon: FolderOpen,
    href: "/app/my-work",
  },
  {
    title: "Knowledge Hub",
    description: "Browse Lean and OpEx topics",
    icon: BookOpen,
    href: "/app/knowledge",
  },
  {
    title: "Toolkits",
    description: "Use 5 Why, Ishikawa, Pareto and more",
    icon: Wrench,
    href: "/app/toolkits",
  },
  {
    title: "Projects",
    description: "Track milestones and linked actions",
    icon: FolderKanban,
    href: "/app/projects",
  },
  {
    title: "Action Plans",
    description: "Monitor execution and follow-up",
    icon: ListChecks,
    href: "/app/action-plans",
  },
];

function isOverdue(deadline: string | null, status: string) {
  if (!deadline) return false;
  if (status === "done") return false;
  const today = new Date();
  const due = new Date(deadline);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [cases, setCases] = useState<CaseItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadDashboard() {
    if (!user) return;

    setLoading(true);

    const casesResponse = await (supabase as any)
      .from("cases")
      .select("id, title, status, current_stage, problem_type, sector, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    const projectsResponse = await (supabase as any)
      .from("projects")
      .select("id, title, status, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    const actionsResponse = await (supabase as any)
      .from("actions")
      .select("id, case_id, title, status, deadline, owner, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    const announcementsResponse = await (supabase as any)
  .from("announcements")
  .select("id, title, content, active, updated_at")
  .eq("active", true)
  .order("updated_at", { ascending: false })
  .limit(3);

    setCases(((casesResponse.data ?? []) as unknown) as CaseItem[]);
    setProjects(((projectsResponse.data ?? []) as unknown) as ProjectItem[]);
    setActions(((actionsResponse.data ?? []) as unknown) as ActionItem[]);
    setAnnouncements(((announcementsResponse.data ?? []) as unknown) as AnnouncementItem[]);

    setLoading(false);
  }

  loadDashboard();
}, [user]);

  const stats = useMemo(() => {
    const activeCases = cases.filter((c) => c.status === "active").length;
    const draftCases = cases.filter((c) => c.status === "draft").length;
    const totalProjects = projects.length;
    const openActions = actions.filter((a) => a.status !== "done").length;

    return [
      { label: "Active Cases", value: activeCases, icon: Activity },
      { label: "Drafts", value: draftCases, icon: FileText },
      { label: "Projects", value: totalProjects, icon: FolderKanban },
      { label: "Open Actions", value: openActions, icon: CheckCircle2 },
    ];
  }, [cases, projects, actions]);

  const mostRecentCase = cases[0] || null;
  const overdueActions = actions.filter((a) => isOverdue(a.deadline, a.status));
  const recentActions = actions.slice(0, 3);

  const caseStatus = useMemo(() => {
    const draft = cases.filter((c) => c.status === "draft").length;
    const active = cases.filter((c) => c.status === "active").length;
    const completed = cases.filter((c) => c.status === "completed").length;
    return { draft, active, completed, total: cases.length };
  }, [cases]);

  const actionStatus = useMemo(() => {
    const open = actions.filter((a) => a.status === "open").length;
    const inProgress = actions.filter((a) => a.status === "in-progress").length;
    const done = actions.filter((a) => a.status === "done").length;
    return { open, inProgress, done, total: actions.length };
  }, [actions]);

  const sectorMix = useMemo(() => {
    return {
      manufacturing: cases.filter((c) => c.sector === "manufacturing").length,
      service: cases.filter((c) => c.sector === "service").length,
      healthcare: cases.filter((c) => c.sector === "healthcare").length,
      other: cases.filter((c) => c.sector === "other").length,
    };
  }, [cases]);

  const welcomeName =
    profile?.full_name?.trim() ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-slate-500">Dashboard</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Welcome back, {welcomeName}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Track cases, launch improvement work, explore Lean knowledge, and keep execution moving in one practical workspace.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="h-11 rounded-xl px-5 shadow-sm"
              onClick={() => navigate("/app/problems/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Start New Case
            </Button>

            <Button
              variant="outline"
              className="h-11 rounded-xl border-slate-200 px-5"
              onClick={() => navigate("/app/action-plans")}
            >
              Open Action Plans
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-2.5">
                <stat.icon className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card p-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-slate-600" />
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Case portfolio
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Visual distribution of case progression.
          </p>

          <div className="mt-6 space-y-5">
            {[
              { label: "Draft", value: caseStatus.draft, pct: percent(caseStatus.draft, caseStatus.total) },
              { label: "Active", value: caseStatus.active, pct: percent(caseStatus.active, caseStatus.total) },
              { label: "Completed", value: caseStatus.completed, pct: percent(caseStatus.completed, caseStatus.total) },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">
                    {loading ? "..." : `${item.value} (${item.pct}%)`}
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-slate-900 transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-card p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-600" />
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Execution pressure
            </h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Action urgency and follow-up picture.
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Open actions</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {loading ? "..." : actionStatus.open}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">In-progress actions</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {loading ? "..." : actionStatus.inProgress}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Overdue actions</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {loading ? "..." : overdueActions.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Sector mix
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Where your current cases are concentrated.
          </p>

          <div className="mt-6 space-y-4">
            {[
              { label: "Manufacturing", value: sectorMix.manufacturing },
              { label: "Service", value: sectorMix.service },
              { label: "Healthcare", value: sectorMix.healthcare },
              { label: "Other", value: sectorMix.other },
            ].map((item) => {
              const pct = percent(item.value, cases.length);
              return (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-medium text-slate-900">
                      {loading ? "..." : `${item.value} (${pct}%)`}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-slate-900 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Continue where you left off
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Your most recent work and next useful entry points.
          </p>

          <div className="mt-6 grid gap-4">
            {mostRecentCase ? (
              <button
                onClick={() => navigate(`/app/problems/${mostRecentCase.id}`)}
                className="interactive-card p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <Clock3 className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {mostRecentCase.title || "Untitled case"}
                    </p>
                    <p className="text-sm text-slate-500">
                      {mostRecentCase.problem_type || "Case"} • Stage {mostRecentCase.current_stage || 1}/12
                    </p>
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={() => navigate("/app/problems/new")}
                className="interactive-card p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-2.5 shadow-sm">
                    <Plus className="h-5 w-5 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Start your first case</p>
                    <p className="text-sm text-slate-500">
                      Begin with downtime, quality, flow, or a custom issue.
                    </p>
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={() =>
                navigate(overdueActions.length > 0 ? "/app/action-plans" : "/app/my-work")
              }
              className="interactive-card p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-2.5 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-slate-700" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">
                    {overdueActions.length > 0 ? "Resolve overdue actions" : "Review current work"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {overdueActions.length > 0
                      ? `${overdueActions.length} action(s) need immediate attention`
                      : "Keep active cases and actions moving"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section className="surface-card p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Quick actions
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              The fastest ways to move inside LeanOps.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <button
              key={action.title}
              onClick={() => navigate(action.href)}
              className="group interactive-card p-5 text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <action.icon className="h-5 w-5 text-slate-700" />
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
              </div>

              <h4 className="mt-4 font-medium text-slate-900">{action.title}</h4>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Recent action activity
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Recently updated execution items.
          </p>

          <div className="mt-6 space-y-3">
            {recentActions.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                No actions yet.
              </div>
            ) : (
              recentActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => navigate("/app/action-plans")}
                  className="interactive-card flex w-full items-center justify-between p-4 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 line-clamp-1">
                      {action.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {action.status} • {action.owner || "No owner"}
                    </p>
                  </div>
                  {isOverdue(action.deadline, action.status) ? (
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="surface-card p-6">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">
            Announcements
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Product updates and useful guidance.
          </p>

          <div className="mt-6 space-y-4">
            {announcements.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                No announcements published yet.
              </div>
            ) : (
              announcements.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
  {item.content}
</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}