import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Lightbulb,
  Wrench,
  Eye,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Target,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StageDataMap = Record<string, any>;

type CaseRecord = {
  id: string;
  title: string | null;
  problem_type: string | null;
  sector: string | null;
  priority: string | null;
  impacted_kpi: string | null;
  status: string | null;
  current_stage: number | null;
  stage_data: unknown;
  updated_at?: string | null;
};

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
};

const TOOL_SLUGS: Record<string, string> = {
  "Problem statement": "problem-statement",
  VOC: "voc-ctq",
  "KPI clarification": "kpi-clarification",
  "Baseline vs target": "baseline-target",
  "Observation notes": "observation-notes",
  "Stakeholder mapping": "stakeholder-matrix",
  CTQ: "voc-ctq",
  VSM: "vsm",
  "Waste analysis": "waste-analysis",
  "Standard work review": "standard-work",
  "Metric log": "metric-log",
  "Trend review": "pareto",
  "Operational definition": "operational-definition",
  "5 Why": "5-why",
  Ishikawa: "ishikawa",
  Pareto: "pareto",
  "Countermeasure list": "countermeasures",
  "Impact review": "impact-effort",
  "Owner assignment": "action-plan",
  "Impact / effort matrix": "impact-effort",
  "Action selection": "action-plan",
  "Action plan": "action-plan",
  "Owner tracking": "action-plan",
  "Milestone view": "action-plan",
  "Control plan": "control-plan",
  "Visual management": "visual-management",
  "KPI review": "kpi-review",
  "Standard work update": "standard-work",
  "Training plan": "training-plan",
  "Lessons learned": "lessons-learned",
  "Before/after summary": "before-after-summary",
  "Benefit review": "benefit-review",
  "Closure notes": "closure-notes",
};

const STAGES = [
  "Intake",
  "Clarify Problem",
  "Define Scope",
  "Current State",
  "Data & Evidence",
  "Root Cause Analysis",
  "Countermeasures",
  "Prioritization",
  "Action Plan",
  "Control & Follow-up",
  "Standardization",
  "Closure",
];

const STAGE_GUIDES = [
  {
    objective:
      "Capture the issue clearly without jumping too early to causes or solutions.",
    prompts: [
      "What is happening?",
      "Where is it happening?",
      "What is the immediate impact?",
      "Which KPI is affected?",
    ],
    whyItMatters:
      "A weak intake creates confusion later. A clear intake creates alignment and speed.",
    tools: ["Problem statement", "VOC", "KPI clarification"],
    visualAid:
      "Use a simple intake board with problem, location, urgency, impact, and KPI affected.",
    mistake:
      "Do not mix symptoms, assumptions, and causes in the first description.",
  },
  {
    objective:
      "Turn the issue into a precise and observable problem statement.",
    prompts: [
      "What exactly is wrong?",
      "Since when has it been happening?",
      "How often does it happen?",
      "What is the gap between baseline and target?",
    ],
    whyItMatters:
      "A vague problem leads to vague actions. A clarified problem leads to focused analysis.",
    tools: ["Problem statement", "Baseline vs target", "Observation notes"],
    visualAid:
      "Display a before-now-target view with frequency, magnitude, and scope of the problem.",
    mistake:
      "Do not write a problem statement that already contains the assumed cause.",
  },
  {
    objective:
      "Define what is in scope, out of scope, and who is involved.",
    prompts: [
      "What area is included?",
      "What is outside the scope?",
      "Who are the key stakeholders?",
      "Who is the customer or internal user affected?",
    ],
    whyItMatters:
      "Good scope prevents wasted effort and keeps the case manageable.",
    tools: ["Stakeholder mapping", "VOC", "CTQ"],
    visualAid:
      "Use a simple scope frame showing in scope, out of scope, owner, and stakeholders.",
    mistake:
      "Do not let the case grow too large before the current issue is understood.",
  },
  {
    objective:
      "Describe how the process works today and where friction appears.",
    prompts: [
      "What are the main steps today?",
      "Where does waiting, rework, or looping happen?",
      "What controls already exist?",
      "What are the visible pain points?",
    ],
    whyItMatters:
      "The current state reveals waste, instability, bottlenecks, and missing controls.",
    tools: ["VSM", "Waste analysis", "Standard work review"],
    visualAid:
      "Map the current process and highlight delays, handoffs, rework, and unstable points.",
    mistake:
      "Do not start redesigning before you understand how the current flow really behaves.",
  },
  {
    objective:
      "Collect the facts, data, and evidence needed to support sound analysis.",
    prompts: [
      "What data confirms the issue?",
      "What is the baseline value?",
      "What is the target value?",
      "What evidence supports the problem statement?",
    ],
    whyItMatters:
      "Data gives credibility and helps avoid opinion-driven problem solving.",
    tools: ["Metric log", "Trend review", "Operational definition"],
    visualAid:
      "Use a KPI board with baseline, target, trend, evidence source, and date.",
    mistake:
      "Do not rely only on perception when the issue can be measured.",
  },
  {
    objective:
      "Separate symptoms from causes and validate the most likely root causes.",
    prompts: [
      "What are the strongest cause hypotheses?",
      "What facts support them?",
      "What is only a symptom?",
      "Which cause is validated versus assumed?",
    ],
    whyItMatters:
      "Without root cause discipline, teams treat symptoms and repeat the same issue later.",
    tools: ["5 Why", "Ishikawa", "Pareto"],
    visualAid:
      "Use a cause tree or fishbone summary showing suspected causes and validated causes.",
    mistake:
      "Do not confuse repeated symptoms with true root causes.",
  },
  {
    objective:
      "Generate actions that directly address the validated causes.",
    prompts: [
      "What can reduce or eliminate the cause?",
      "Which actions are containment versus permanent?",
      "What impact is expected?",
      "Who should own each countermeasure?",
    ],
    whyItMatters:
      "Strong countermeasures create real change instead of superficial corrections.",
    tools: ["Countermeasure list", "Impact review", "Owner assignment"],
    visualAid:
      "Display each cause next to the chosen countermeasure, expected effect, and owner.",
    mistake:
      "Do not propose generic actions that are not linked to validated causes.",
  },
  {
    objective:
      "Choose the best actions based on value, impact, effort, and practicality.",
    prompts: [
      "Which actions create the biggest benefit?",
      "Which actions are easiest to execute now?",
      "What should be done first?",
      "What should be deferred or removed?",
    ],
    whyItMatters:
      "Prioritization protects the team from trying to do everything at once.",
    tools: ["Impact / effort matrix", "Action selection"],
    visualAid:
      "Use a simple impact-effort visual with chosen actions clearly marked.",
    mistake:
      "Do not treat all actions as equally urgent or equally valuable.",
  },
  {
    objective:
      "Turn selected actions into a real executable plan with owners and dates.",
    prompts: [
      "What exactly will be done?",
      "Who owns it?",
      "When does it start and when is it due?",
      "What blockers could delay execution?",
    ],
    whyItMatters:
      "Without an action plan, good analysis does not become operational progress.",
    tools: ["Action plan", "Owner tracking", "Milestone view"],
    visualAid:
      "Use a visual action tracker with owner, due date, status, and blocker visibility.",
    mistake:
      "Do not leave actions without owners, due dates, or status visibility.",
  },
  {
    objective:
      "Define how results will be monitored and how the gains will be protected.",
    prompts: [
      "How will the process be monitored?",
      "Who checks performance and how often?",
      "What triggers escalation?",
      "What visual management is needed?",
    ],
    whyItMatters:
      "Control prevents the problem from returning once the first energy fades.",
    tools: ["Control plan", "Visual management", "KPI review"],
    visualAid:
      "Create a control board with indicator, frequency, owner, escalation rule, and review point.",
    mistake:
      "Do not close the case just because actions were completed once.",
  },
  {
    objective:
      "Capture what needs to be standardized, trained, documented, and replicated.",
    prompts: [
      "What standard work must change?",
      "What training is needed?",
      "What documentation must be updated?",
      "Where else can this learning be replicated?",
    ],
    whyItMatters:
      "Standardization turns isolated improvement into organizational discipline.",
    tools: ["Standard work update", "Training plan", "Lessons learned"],
    visualAid:
      "Use a sustainment board showing what changed, who is trained, and where replication applies.",
    mistake:
      "Do not leave the improvement only in people’s heads.",
  },
  {
    objective:
      "Summarize the results, confirm benefits, and formally close the case.",
    prompts: [
      "What changed from before to after?",
      "What benefit was achieved?",
      "What KPI result was reached?",
      "What sustainment note should remain visible?",
    ],
    whyItMatters:
      "Closure makes the improvement visible, credible, and reusable later.",
    tools: ["Before/after summary", "Benefit review", "Closure notes"],
    visualAid:
      "Show a closure board with baseline, final result, achieved benefit, and sustainment note.",
    mistake:
      "Do not close without confirming what really improved and what still needs monitoring.",
  },
];

const STAGE_FIELDS: Record<number, FieldDef[]> = {
  1: [
    { key: "problemSummary", label: "Problem summary", type: "textarea", placeholder: "Describe the issue in simple operational terms." },
    { key: "location", label: "Where is it happening?", placeholder: "Plant, area, process, service unit..." },
    { key: "urgency", label: "Urgency", placeholder: "High / medium / low, and why" },
    { key: "impactType", label: "Impact type", placeholder: "Quality / cost / delivery / safety / people / customer" },
  ],
  2: [
    { key: "problemStatement", label: "Problem statement", type: "textarea", placeholder: "Write a precise and observable problem statement." },
    { key: "baseline", label: "Baseline", placeholder: "Current baseline value" },
    { key: "target", label: "Target", placeholder: "Expected target value" },
    { key: "frequency", label: "Frequency", placeholder: "How often does it happen?" },
  ],
  3: [
    { key: "inScope", label: "In scope", type: "textarea", placeholder: "What is included in this case?" },
    { key: "outOfScope", label: "Out of scope", type: "textarea", placeholder: "What is excluded from this case?" },
    { key: "stakeholders", label: "Stakeholders", type: "textarea", placeholder: "Who is involved or impacted?" },
    { key: "customer", label: "Customer / internal customer", placeholder: "Who receives the result of this process?" },
  ],
  4: [
    { key: "processSteps", label: "Main process steps", type: "textarea", placeholder: "List the key steps of the current process." },
    { key: "wastePoints", label: "Waste / friction points", type: "textarea", placeholder: "Waiting, motion, defects, rework, loops..." },
    { key: "controls", label: "Current controls", type: "textarea", placeholder: "What controls or standards exist today?" },
  ],
  5: [
    { key: "baselineValue", label: "Baseline value", placeholder: "Current measurable value" },
    { key: "targetValue", label: "Target value", placeholder: "Desired measurable value" },
    { key: "evidence", label: "Evidence log", type: "textarea", placeholder: "Observations, data sources, timestamps, facts..." },
    { key: "definitions", label: "Operational definitions", type: "textarea", placeholder: "How is the metric defined and measured?" },
  ],
  6: [
    { key: "symptoms", label: "Symptoms", type: "textarea", placeholder: "List what is observable but not root cause." },
    { key: "hypotheses", label: "Cause hypotheses", type: "textarea", placeholder: "What could be causing the problem?" },
    { key: "validatedCauses", label: "Validated root causes", type: "textarea", placeholder: "Which causes are supported by facts?" },
  ],
  7: [
    { key: "countermeasures", label: "Countermeasures", type: "textarea", placeholder: "List actions that directly address validated causes." },
    { key: "expectedImpact", label: "Expected impact", type: "textarea", placeholder: "What result should these actions create?" },
    { key: "owners", label: "Owners", type: "textarea", placeholder: "Who should own each countermeasure?" },
  ],
  8: [
    { key: "highImpactActions", label: "High-impact actions", type: "textarea", placeholder: "What creates the biggest operational benefit?" },
    { key: "quickWins", label: "Quick wins", type: "textarea", placeholder: "What can be executed quickly?" },
    { key: "deferredActions", label: "Deferred / removed actions", type: "textarea", placeholder: "What should wait or be dropped?" },
  ],
  9: [
    { key: "actionOwnerMap", label: "Owner assignment", type: "textarea", placeholder: "Map actions to owners." },
    { key: "keyDates", label: "Deadlines and milestones", type: "textarea", placeholder: "List due dates and milestones." },
    { key: "blockers", label: "Blockers", type: "textarea", placeholder: "What may delay execution?" },
  ],
  10: [
    { key: "monitoringPlan", label: "Monitoring plan", type: "textarea", placeholder: "How will the result be tracked?" },
    { key: "reviewFrequency", label: "Review frequency", placeholder: "Daily / weekly / monthly..." },
    { key: "escalationRules", label: "Escalation rules", type: "textarea", placeholder: "When should the issue be escalated?" },
  ],
  11: [
    { key: "standardWorkChanges", label: "Standard work changes", type: "textarea", placeholder: "What must be updated in standard work?" },
    { key: "trainingNeeded", label: "Training needed", type: "textarea", placeholder: "Who needs training and on what?" },
    { key: "replication", label: "Replication opportunities", type: "textarea", placeholder: "Where else can this learning be applied?" },
  ],
  12: [
    { key: "beforeAfter", label: "Before / after summary", type: "textarea", placeholder: "Summarize the change before and after." },
    { key: "benefits", label: "Benefits achieved", type: "textarea", placeholder: "What benefits were realized?" },
    { key: "finalResult", label: "Final KPI result", placeholder: "Final measured result" },
    { key: "sustainmentNote", label: "Sustainment note", type: "textarea", placeholder: "What must remain visible after closure?" },
  ],
};

function toStageDataMap(value: unknown): StageDataMap {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, any>) };
}

function getStageForm(stageData: StageDataMap, stageNumber: number): Record<string, string> {
  const raw = stageData[`stage_${stageNumber}_form`];
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const obj = raw as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, typeof v === "string" ? v : String(v ?? "")])
  );
}

function hasMeaningfulStageContent(
  notes: string,
  formData: Record<string, string>
): boolean {
  if (notes.trim().length > 0) return true;
  return Object.values(formData).some((v) => (v || "").trim().length > 0);
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [caseData, setCaseData] = useState<CaseRecord | null>(null);
  const [stageData, setStageData] = useState<StageDataMap>({});
  const [activeStage, setActiveStage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchCase() {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", id)
        .single();

      if (!mounted) return;

      if (error || !data) {
        toast({
          title: "Case not found",
          description: "Unable to load this case.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const typedData = data as unknown as CaseRecord;
      setCaseData(typedData);
      setStageData(toStageDataMap(typedData.stage_data));
      setActiveStage(typedData.current_stage || 1);
      setLoading(false);
    }

    fetchCase();

    return () => {
      mounted = false;
    };
  }, [id, toast]);

  const currentGuide = useMemo(() => STAGE_GUIDES[activeStage - 1], [activeStage]);
  const currentFields = useMemo(() => STAGE_FIELDS[activeStage] || [], [activeStage]);

  const currentNotes = useMemo(() => {
    const raw = stageData[`stage_${activeStage}`];
    return typeof raw === "string" ? raw : "";
  }, [stageData, activeStage]);

  const currentForm = useMemo(() => {
    return getStageForm(stageData, activeStage);
  }, [stageData, activeStage]);

  const progress = caseData ? ((caseData.current_stage || 1) / 12) * 100 : 0;

  const updateNotes = (value: string) => {
    setStageData((prev) => ({
      ...prev,
      [`stage_${activeStage}`]: value,
    }));
  };

  const updateFormField = (key: string, value: string) => {
    setStageData((prev) => {
      const existing = getStageForm(prev, activeStage);
      return {
        ...prev,
        [`stage_${activeStage}_form`]: {
          ...existing,
          [key]: value,
        },
      };
    });
  };

  const save = useCallback(async () => {
    if (!caseData) return;

    setSaving(true);

    const { error } = await supabase
      .from("cases")
      .update({
        stage_data: stageData,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", caseData.id);

    setSaving(false);

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setLastSaved(new Date());
  }, [caseData, stageData, toast]);

  useEffect(() => {
    if (!caseData) return;

    const timer = window.setTimeout(() => {
      void save();
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [stageData, caseData, save]);

  const completeStage = async () => {
    if (!caseData) return;

    const notes = typeof stageData[`stage_${activeStage}`] === "string"
      ? stageData[`stage_${activeStage}`]
      : "";
    const form = getStageForm(stageData, activeStage);

    if (!hasMeaningfulStageContent(notes, form)) {
      toast({
        title: "Add some content first",
        description: "Fill at least one field or write notes before completing this stage.",
        variant: "destructive",
      });
      return;
    }

    if (activeStage < (caseData.current_stage || 1)) {
      toast({
        title: "Stage already completed",
        description: "You can still edit the content, but progression is already ahead.",
      });
      return;
    }

    if ((caseData.current_stage || 1) >= 12) {
      toast({
        title: "Final stage reached",
        description: "You can now close the case when ready.",
      });
      return;
    }

    const nextStage = (caseData.current_stage || 1) + 1;

    const { error } = await supabase
      .from("cases")
      .update({
        current_stage: nextStage,
        status: "active",
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", caseData.id);

    if (error) {
      toast({
        title: "Unable to complete stage",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCaseData((prev) =>
      prev
        ? {
            ...prev,
            current_stage: nextStage,
            status: "active",
          }
        : prev
    );
    setActiveStage(nextStage);

    toast({
      title: "Stage completed",
      description: `Moved to Stage ${nextStage}: ${STAGES[nextStage - 1]}`,
    });
  };

  const closeCase = async () => {
    if (!caseData) return;

    const { error } = await supabase
      .from("cases")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", caseData.id);

    if (error) {
      toast({
        title: "Unable to close case",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCaseData((prev) => (prev ? { ...prev, status: "completed" } : prev));
    toast({
      title: "Case completed",
      description: "The case has been closed successfully.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate-500">Case not found.</p>
        <Button className="mt-4" asChild>
          <Link to="/app/problems">Back to problems</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/problems">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={caseData.status === "completed" ? "outline" : "default"}>
            {caseData.status || "draft"}
          </Badge>
          <Badge variant="secondary">
            Stage {caseData.current_stage || 1}/12
          </Badge>

          {lastSaved && (
            <span className="text-xs text-slate-500">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}

          <Button size="sm" variant="outline" onClick={() => void save()} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">Case Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {caseData.title || "Untitled case"}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Structure the issue, build the analysis, and guide the team toward a sustainable solution.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Problem type</p>
              <p className="mt-1 font-medium text-slate-900">{caseData.problem_type || "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Sector</p>
              <p className="mt-1 font-medium capitalize text-slate-900">{caseData.sector || "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Priority</p>
              <p className="mt-1 font-medium capitalize text-slate-900">{caseData.priority || "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Impacted KPI</p>
              <p className="mt-1 font-medium text-slate-900">{caseData.impacted_kpi || "—"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Current stage</p>
              <p className="mt-1 font-medium text-slate-900">{STAGES[activeStage - 1]}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-1 font-medium capitalize text-slate-900">{caseData.status || "draft"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-slate-500">Case progress</span>
            <span className="font-medium text-slate-900">{Math.round(progress)}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100">
            <div
              className="h-2.5 rounded-full bg-slate-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[260px_1fr_340px]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-4 text-sm font-semibold tracking-tight text-slate-900">
            Stages
          </p>

          <div className="space-y-2">
            {STAGES.map((stage, index) => {
              const stageNumber = index + 1;
              const currentStage = caseData.current_stage || 1;
              const isCompleted = stageNumber < currentStage;
              const isCurrent = stageNumber === activeStage;
              const isLocked = stageNumber > currentStage;

              return (
                <button
                  key={stage}
                  onClick={() => {
                    if (!isLocked) setActiveStage(stageNumber);
                  }}
                  disabled={isLocked}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    isCurrent
                      ? "border-slate-900 bg-slate-900 text-white"
                      : isCompleted
                      ? "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100"
                      : isLocked
                      ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
                      : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isCurrent
                          ? "bg-white text-slate-900"
                          : isCompleted
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : stageNumber}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">{stage}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">Active stage</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    {activeStage}. {STAGES[activeStage - 1]}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    {currentGuide.objective}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Prompt ideas for this stage
                </p>
                <ul className="mt-3 space-y-2">
                  {currentGuide.prompts.map((prompt) => (
                    <li key={prompt} className="flex gap-2 text-sm text-slate-700">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-4 w-4 text-slate-500" />
                  <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                    Structured stage form
                  </h3>
                </div>

                <div className="grid gap-4">
                  {currentFields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label>{field.label}</Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          rows={4}
                          value={currentForm[field.key] || ""}
                          onChange={(e) => updateFormField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <Input
                          value={currentForm[field.key] || ""}
                          onChange={(e) => updateFormField(field.key, e.target.value)}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Label>Stage notes</Label>
                <Textarea
                  placeholder={`Write your notes for ${STAGES[activeStage - 1]} here...`}
                  value={currentNotes}
                  onChange={(e) => updateNotes(e.target.value)}
                  rows={10}
                  className="min-h-[240px] resize-y"
                />
                <p className="text-xs text-slate-500">
                  Tip: use notes for synthesis, decisions, observations, and follow-up comments.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button onClick={() => void completeStage()} className="rounded-xl">
                  {activeStage < 12 ? "Mark complete & advance" : "Stage completed"}
                </Button>

                {activeStage === 12 && caseData.status !== "completed" && (
                  <Button variant="outline" className="rounded-xl" onClick={() => void closeCase()}>
                    Close case
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => void save()}
                  disabled={saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        <aside className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Guidance
                </h3>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {currentGuide.whyItMatters}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Recommended tools
                </h3>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentGuide.tools.map((tool) => {
                  const slug = TOOL_SLUGS[tool];

                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => slug && navigate(`/app/toolkits/${slug}`)}
                      className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                        slug
                          ? "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                          : "cursor-default border-slate-100 bg-slate-50 text-slate-400"
                      }`}
                    >
                      {tool}
                    </button>
                  );
                })}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Click a tool to open its practical guide and working template.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Visual aid
                </h3>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-700">
                  {currentGuide.visualAid}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-slate-600" />
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  Common mistake
                </h3>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {currentGuide.mistake}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}