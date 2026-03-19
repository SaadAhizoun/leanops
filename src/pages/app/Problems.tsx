import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ArrowRight,
  FolderOpen,
  Activity,
  FileText,
  CheckCircle2,
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
    return cases.filter((c) => {
      const haystack =
        `${c.title || ""} ${c.problem_type || ""} ${c.sector || ""} ${c.impacted_kpi || ""}`.toLowerCase();

      return haystack.includes(search.toLowerCase());
    });
  }, [cases, search]);

  const stats = useMemo(() => {
    return {
      total: cases.length,
      active: cases.filter((c) => c.status === "active").length,
      draft: cases.filter((c) => c.status === "draft").length,
      completed: cases.filter((c) => c.status === "completed").length,
    };
  }, [cases]);

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">Problem Solving</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Structured problem-solving cases
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Create, review, and continue operational problem-solving work across your cases.
            </p>
          </div>

          <Button asChild className="h-11 rounded-xl px-5 shadow-sm">
            <Link to="/app/problems/new">
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total cases</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <FolderOpen className="h-5 w-5 text-slate-700" />
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
      </section>

      <section className="surface-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search cases..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="text-sm text-slate-500">
            {filtered.length} case{filtered.length > 1 ? "s" : ""} found
          </p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No cases found</p>
          <p className="mt-2 text-sm text-slate-500">
            Start your first structured case or refine your search.
          </p>
          <Button asChild className="mt-6 h-11 rounded-xl px-5">
            <Link to="/app/problems/new">
              <Plus className="mr-2 h-4 w-4" />
              Start First Case
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filtered.map((c) => (
            <Link key={c.id} to={`/app/problems/${c.id}`}>
              <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
                          {c.title || "Untitled case"}
                        </h3>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            c.status
                          )}`}
                        >
                          {c.status || "draft"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        {c.problem_type || "Case"} • {c.sector || "—"}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Stage
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {c.current_stage || 1}/12
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Priority
                      </p>
                      <p className="mt-1 text-sm font-medium capitalize text-slate-900">
                        {c.priority || "medium"}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        KPI
                      </p>
                      <p className="mt-1 truncate text-sm font-medium text-slate-900">
                        {c.impacted_kpi || "—"}
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
                          width: `${Math.round(((c.current_stage || 1) / 12) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Updated:{" "}
                      {c.updated_at
                        ? new Date(c.updated_at).toLocaleDateString()
                        : "—"}
                    </span>
                    <span className="font-medium text-slate-700">Open case</span>
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