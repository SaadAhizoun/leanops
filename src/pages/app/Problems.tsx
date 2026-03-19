import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  FolderOpen,
  Plus,
  Search,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, FilterBar, PageHeader, StatCard } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

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

export default function Problems() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      if (!user) return;

      setLoading(true);

      const { data } = await supabase
        .from("cases")
        .select("id, title, problem_type, sector, status, current_stage, priority, impacted_kpi, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      setCases((data as CaseItem[]) || []);
      setLoading(false);
    }

    loadCases();
  }, [user]);

  const filtered = useMemo(() => {
    return cases.filter((item) => {
      const haystack =
        `${item.title || ""} ${item.problem_type || ""} ${item.sector || ""} ${item.impacted_kpi || ""}`.toLowerCase();

      return haystack.includes(search.toLowerCase());
    });
  }, [cases, search]);

  const stats = useMemo(
    () => ({
      total: cases.length,
      active: cases.filter((item) => item.status === "active").length,
      draft: cases.filter((item) => item.status === "draft").length,
      completed: cases.filter((item) => item.status === "completed").length,
    }),
    [cases],
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Problem Solving"
        title="Structured problem-solving cases"
        description="Create, review, and continue operational problem-solving work with cleaner hierarchy and easier scanning."
        actions={
          <Button asChild>
            <Link to="/app/problems/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total cases" value={stats.total} icon={FolderOpen} />
          <StatCard label="Active" value={stats.active} icon={Activity} />
          <StatCard label="Drafts" value={stats.draft} icon={FileText} />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        </div>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by title, type, sector, or KPI..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700">
            {filtered.length} found
          </span>
          <span>Structured case library</span>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No cases found"
          description="Start your first structured case or refine your search to uncover active problem-solving work."
          action={
            <Button asChild>
              <Link to="/app/problems/new">
                <Plus className="mr-2 h-4 w-4" />
                Start First Case
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((item) => (
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
                        {item.problem_type || "Case"} - {item.sector || "Not assigned"}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="surface-muted px-3 py-3">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Stage</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{item.current_stage || 1}/12</p>
                    </div>
                    <div className="surface-muted px-3 py-3">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Priority</p>
                      <div className="mt-2">
                        <StatusBadge value={item.priority} />
                      </div>
                    </div>
                    <div className="surface-muted px-3 py-3">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">KPI</p>
                      <p className="mt-2 truncate text-sm font-semibold text-slate-950">{item.impacted_kpi || "Not set"}</p>
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
                    <span>{item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "No recent update"}</span>
                    <span className="font-semibold text-slate-700">Open case</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
