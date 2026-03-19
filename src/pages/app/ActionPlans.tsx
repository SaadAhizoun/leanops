import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, ListChecks, Search } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChipToggle, EmptyState, FilterBar, LoadingState, PageHeader, PageShell, StatsGrid, StatCard } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

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
    const actionPlanText = typeof stageData.stage_9 === "string" ? stageData.stage_9 : "";

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

      return matchesSearch && (statusFilter === "all" || item.status === statusFilter);
    });
  }, [actions, search, statusFilter]);

  const openCount = actions.filter((item) => item.status === "open").length;
  const doneCount = actions.filter((item) => item.status === "done").length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Action Plans"
        title="Execution and follow-up center"
        description="Review actions coming from your cases, monitor progress, and keep follow-up visible."
      >
        <StatsGrid>
          <StatCard label="Total actions" value={actions.length} icon={ListChecks} />
          <StatCard label="Open" value={openCount} icon={Clock3} />
          <StatCard label="Done" value={doneCount} icon={CheckCircle2} />
          <StatCard label="Source" value="Stage 9" icon={AlertTriangle} />
        </StatsGrid>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search action plans..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-toggle-group">
          {["all", "open", "done"].map((status) => (
            <ChipToggle key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>
              {status === "all" ? "All" : status}
            </ChipToggle>
          ))}
        </div>
      </FilterBar>

      {loading ? (
        <LoadingState />
      ) : filteredActions.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No action plans found"
          description="Action plans will appear here when Stage 9 is filled in your cases."
        />
      ) : (
        <div className="section-stack">
          {filteredActions.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-slate-950">{item.caseTitle}</h3>
                      <StatusBadge value={item.status} />
                      <StatusBadge value={item.priority} />
                    </div>

                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">{item.action}</p>

                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {item.deadline || "No deadline"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {item.owner || "No owner"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Source: Stage 9
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/app/problems/${item.caseId}`}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
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
    </PageShell>
  );
}
