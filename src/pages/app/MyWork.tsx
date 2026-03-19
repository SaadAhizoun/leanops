import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  Search,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, FilterBar, PageHeader, SectionCard, StatCard } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const sectors = ["all", "manufacturing", "service", "healthcare", "other"];

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
      const { data } = await supabase.from("cases").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      setCases((data as CaseItem[]) || []);
      setLoading(false);
    }

    loadCases();
  }, [user]);

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const haystack =
        `${item.title || ""} ${item.problem_type || ""} ${item.impacted_kpi || ""} ${item.sector || ""}`.toLowerCase();

      return haystack.includes(search.toLowerCase()) && (sectorFilter === "all" || item.sector === sectorFilter);
    });
  }, [cases, search, sectorFilter]);

  const byStatus = (status: string) => filteredCases.filter((item) => item.status === status);

  const stats = useMemo(
    () => ({
      total: cases.length,
      draft: cases.filter((item) => item.status === "draft").length,
      active: cases.filter((item) => item.status === "active").length,
      completed: cases.filter((item) => item.status === "completed").length,
    }),
    [cases],
  );

  const mostRecent = filteredCases[0];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="My Work"
        title="Your cases, drafts, and ongoing work"
        description="Resume what you started, monitor active cases, and keep structured problem-solving work moving."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total cases" value={stats.total} icon={Layers3} />
          <StatCard label="Drafts" value={stats.draft} icon={FileText} />
          <StatCard label="Active" value={stats.active} icon={Activity} />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        </div>
      </PageHeader>

      {mostRecent ? (
        <SectionCard>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="page-eyebrow">Continue where you left off</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {mostRecent.title || "Untitled case"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {mostRecent.problem_type || "Case"} - Stage {mostRecent.current_stage || 1}/12
                {mostRecent.sector ? ` - ${mostRecent.sector}` : ""}
              </p>
            </div>

            <Link
              to={`/app/problems/${mostRecent.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white"
            >
              Open case
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </SectionCard>
      ) : null}

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, type, KPI, or sector..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {sectors.map((sector) => (
            <button
              key={sector}
              onClick={() => setSectorFilter(sector)}
              className={
                sectorFilter === sector
                  ? "rounded-2xl border border-slate-900 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                  : "rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              }
            >
              {sector === "all" ? "All sectors" : sector}
            </button>
          ))}
        </div>
      </FilterBar>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="draft">Drafts ({byStatus("draft").length})</TabsTrigger>
          <TabsTrigger value="active">Active ({byStatus("active").length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({byStatus("completed").length})</TabsTrigger>
        </TabsList>

        {["draft", "active", "completed"].map((status) => {
          const items = byStatus(status);
          const Icon = status === "draft" ? FileText : status === "active" ? Clock3 : CheckCircle2;

          return (
            <TabsContent key={status} value={status}>
              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="loading-spinner" />
                </div>
              ) : items.length === 0 ? (
                <EmptyState
                  icon={Icon}
                  title={`No ${status} cases`}
                  description={
                    status === "draft"
                      ? "Draft cases will appear here once you begin creating them."
                      : status === "active"
                        ? "Active cases will appear here once work has started."
                        : "Completed cases will appear here once they are closed."
                  }
                />
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {items.map((item) => (
                    <Link key={item.id} to={`/app/problems/${item.id}`}>
                      <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-base font-semibold tracking-tight text-slate-950">
                                  {item.title || "Untitled case"}
                                </h3>
                                <StatusBadge value={item.status} />
                              </div>
                              <p className="mt-2 text-sm text-slate-500">
                                {item.problem_type || "Case"} - Stage {item.current_stage || 1}/12
                                {item.sector ? ` - ${item.sector}` : ""}
                              </p>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                              <ArrowRight className="h-4 w-4 text-slate-400" />
                            </div>
                          </div>

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="surface-muted px-3 py-3">
                              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Priority</p>
                              <div className="mt-2">
                                <StatusBadge value={item.priority || "medium"} />
                              </div>
                            </div>
                            <div className="surface-muted px-3 py-3">
                              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">KPI</p>
                              <p className="mt-2 truncate text-sm font-semibold text-slate-950">{item.impacted_kpi || "Not set"}</p>
                            </div>
                            <div className="surface-muted px-3 py-3">
                              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Updated</p>
                              <p className="mt-2 text-sm font-semibold text-slate-950">
                                {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "No recent update"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                              <span>Progress</span>
                              <span>{Math.round(((item.current_stage || 1) / 12) * 100)}%</span>
                            </div>
                            <div className="h-2.5 rounded-full bg-slate-100">
                              <div
                                className="h-2.5 rounded-full bg-slate-900 transition-all"
                                style={{ width: `${Math.round(((item.current_stage || 1) / 12) * 100)}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                            <span>Open case</span>
                            <span className="font-semibold text-slate-700">Continue work</span>
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
