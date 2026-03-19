import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ListChecks, ArrowRight, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";

type CaseItem = {
  id: string;
  title: string | null;
  status: string | null;
  priority: string | null;
  current_stage: number | null;
  updated_at: string | null;
  stage_data: unknown;
};

type ActionItem = {
  id: string;
  caseId: string;
  caseTitle: string;
  action: string;
  owner: string;
  deadline: string;
  status: string;
  notes: string;
  priority: string;
};

function extractActionsFromStageData(cases: CaseItem[]): ActionItem[] {
  const result: ActionItem[] = [];

  cases.forEach((caseItem) => {
    const raw = caseItem.stage_data;

    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;

    const stageData = raw as Record<string, unknown>;
    const actionPlanText = typeof stageData["stage_9"] === "string" ? stageData["stage_9"] : "";

    if (!actionPlanText.trim()) return;

    result.push({
      id: `${caseItem.id}-stage9`,
      caseId: caseItem.id,
      caseTitle: caseItem.title || "Untitled case",
      action: actionPlanText,
      owner: "Not assigned",
      deadline: "",
      status: caseItem.status === "completed" ? "done" : "open",
      notes: "",
      priority: caseItem.priority || "medium",
    });
  });

  return result;
}

export default function ActionPlans() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadCases() {
      setLoading(true);

      const { data } = await supabase
        .from("cases")
        .select("id, title, status, priority, current_stage, updated_at, stage_data")
        .order("updated_at", { ascending: false });

      setCases((data as CaseItem[]) || []);
      setLoading(false);
    }

    loadCases();
  }, []);

  const actions = useMemo(() => extractActionsFromStageData(cases), [cases]);

  const filteredActions = useMemo(() => {
    return actions.filter((item) => {
      const matchesSearch =
        item.caseTitle.toLowerCase().includes(search.toLowerCase()) ||
        item.action.toLowerCase().includes(search.toLowerCase()) ||
        item.priority.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [actions, search, statusFilter]);

  const openCount = actions.filter((a) => a.status === "open").length;
  const doneCount = actions.filter((a) => a.status === "done").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">Action Plans</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            Execution and follow-up center
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Review actions coming from your cases, monitor progress, and keep follow-up visible.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total actions</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{actions.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Open</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{openCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Done</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{doneCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Source</p>
            <p className="mt-2 text-sm font-medium text-slate-900">
              Case Stage 9
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search action plans..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["all", "open", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  statusFilter === status
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredActions.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <ListChecks className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No action plans found</p>
          <p className="mt-2 text-sm text-slate-500">
            Action plans will appear here when Stage 9 is filled in your cases.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActions.map((item) => (
            <Card key={item.id} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-slate-900">
                        {item.caseTitle}
                      </h3>
                      <Badge variant={item.status === "done" ? "outline" : "secondary"}>
                        {item.status}
                      </Badge>
                      <Badge variant="secondary">{item.priority}</Badge>
                    </div>

                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                      {item.action}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.deadline || "No deadline"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {item.owner || "No owner"}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Source: Stage 9
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/app/problems/${item.caseId}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
                  >
                    Open case
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}