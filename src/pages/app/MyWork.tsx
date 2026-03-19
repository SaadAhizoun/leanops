import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FolderOpen,
  ArrowRight,
  Clock3,
  CheckCircle2,
  FileText,
  Activity,
  Layers3,
} from "lucide-react";

type CaseItem = {
  id: string;
  title: string | null;
  problem_type: string | null;
  sector: string | null;
  status: string | null;
  current_stage: number | null;
  priority: string | null;
  impacted_kpi: string | null;
  updated_at: string | null;
};

function getStatusClass(status: string | null) {
  if (status === "completed") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (status === "active") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default function MyWork() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      if (!user) return;

      setLoading(true);

      const { data } = await supabase
        .from("cases")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      setCases((data as CaseItem[]) || []);
      setLoading(false);
    }

    loadCases();
  }, [user]);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const haystack =
        `${item.title || ""} ${item.problem_type || ""} ${item.impacted_kpi || ""} ${item.sector || ""}`.toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesSector =
        sectorFilter === "all" || item.sector === sectorFilter;

      return matchesSearch && matchesSector;
    });
  }, [cases, search, sectorFilter]);

  const byStatus = (status: string) =>
    filteredCases.filter((item) => item.status === status);

  const stats = useMemo(() => {
    return {
      total: cases.length,
      draft: cases.filter((c) => c.status === "draft").length,
      active: cases.filter((c) => c.status === "active").length,
      completed: cases.filter((c) => c.status === "completed").length,
    };
  }, [cases]);

  const mostRecent = filteredCases[0];

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">My Work</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Your cases, drafts, and ongoing work
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Resume what you started, monitor active cases, and keep structured problem-solving work moving.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="metric-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total cases</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5">
                  <Layers3 className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Drafts</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {stats.draft}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5">
                  <FileText className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Active</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {stats.active}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5">
                  <Activity className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {stats.completed}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-100 p-2.5">
                  <CheckCircle2 className="h-5 w-5 text-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {mostRecent && (
        <section className="surface-card p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Continue where you left off
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                {mostRecent.title || "Untitled case"}
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {mostRecent.problem_type || "Case"} • Stage {mostRecent.current_stage || 1}/12
                {mostRecent.sector ? ` • ${mostRecent.sector}` : ""}
              </p>
            </div>

            <Link
              to={`/app/problems/${mostRecent.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
            >
              Open case
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      <section className="surface-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by title, problem type, KPI, or sector..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "manufacturing", "service", "healthcare", "other"].map((sector) => (
              <button
                key={sector}
                onClick={() => setSectorFilter(sector)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  sectorFilter === sector
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {sector === "all" ? "All sectors" : sector}
              </button>
            ))}
          </div>
        </div>
      </section>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-slate-100 p-1">
          <TabsTrigger value="draft" className="rounded-xl">
            Drafts ({byStatus("draft").length})
          </TabsTrigger>
          <TabsTrigger value="active" className="rounded-xl">
            Active ({byStatus("active").length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl">
            Completed ({byStatus("completed").length})
          </TabsTrigger>
        </TabsList>

        {["draft", "active", "completed"].map((status) => {
          const items = byStatus(status);

          return (
            <TabsContent key={status} value={status}>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : items.length === 0 ? (
                <div className="surface-card p-12 text-center">
                  {status === "draft" && (
                    <FileText className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                  )}
                  {status === "active" && (
                    <Clock3 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                  )}
                  {status === "completed" && (
                    <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-slate-300" />
                  )}

                  <p className="text-base font-medium text-slate-900">
                    No {status} cases
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {status === "draft" &&
                      "Draft cases will appear here once you begin creating them."}
                    {status === "active" &&
                      "Active cases will appear here once work has started."}
                    {status === "completed" &&
                      "Completed cases will appear here once they are closed."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {items.map((item) => (
                    <Link key={item.id} to={`/app/problems/${item.id}`}>
                      <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
                                  {item.title || "Untitled case"}
                                </h3>

                                <span
                                  className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                    item.status
                                  )}`}
                                >
                                  {item.status || "draft"}
                                </span>
                              </div>

                              <p className="mt-2 text-sm text-slate-600">
                                {item.problem_type || "Case"} • Stage {item.current_stage || 1}/12
                                {item.sector ? ` • ${item.sector}` : ""}
                              </p>
                            </div>

                            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                Priority
                              </p>
                              <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                                {item.priority || "—"}
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                KPI
                              </p>
                              <p className="mt-1 truncate text-sm font-medium text-slate-900">
                                {item.impacted_kpi || "—"}
                              </p>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                Updated
                              </p>
                              <p className="mt-1 text-sm font-medium text-slate-900">
                                {item.updated_at
                                  ? new Date(item.updated_at).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4">
                            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                              Progress
                            </p>
                            <div className="h-2.5 w-full rounded-full bg-slate-100">
                              <div
                                className="h-2.5 rounded-full bg-slate-900 transition-all"
                                style={{
                                  width: `${Math.round(((item.current_stage || 1) / 12) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                            <span>Open case</span>
                            <span className="font-medium text-slate-700">
                              Continue work
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}