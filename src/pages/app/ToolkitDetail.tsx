import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Lightbulb,
  AlertTriangle,
  Eye,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ToolDefinition = {
  title: string;
  intro: string;
  category: string;
  bestUse: string;
  steps: string[];
  mistakes: string[];
  visual: string;
};

type ToolFormData = Record<string, string>;

const TOOL_DETAILS: Record<string, ToolDefinition> = {
  "5-why": {
    title: "5 Why",
    intro:
      "A simple but powerful method to identify root causes by repeatedly asking why a problem happens.",
    category: "Root Cause Analysis",
    bestUse: "Best when you need to move from symptoms to root cause quickly and logically.",
    steps: [
      "Start with a clear and factual problem statement.",
      "Ask why the problem happens.",
      "Use the answer as the basis for the next why.",
      "Repeat until you reach a meaningful and controllable cause.",
      "Validate the result with facts, not assumptions.",
    ],
    mistakes: [
      "Starting from a vague problem statement.",
      "Stopping at a symptom instead of the root cause.",
      "Writing assumptions without evidence.",
      "Confusing blame with analysis.",
    ],
    visual:
      "Use a vertical chain: Problem → Why 1 → Why 2 → Why 3 → Why 4 → Why 5 → Root Cause.",
  },
  ishikawa: {
    title: "Ishikawa",
    intro:
      "A visual cause analysis method used to structure possible causes around one problem.",
    category: "Root Cause Analysis",
    bestUse: "Best when the issue may come from multiple categories and needs a structured visual review.",
    steps: [
      "Define the problem clearly.",
      "Create major cause categories.",
      "List possible causes under each category.",
      "Challenge and validate the most likely causes.",
      "Use it to prepare deeper analysis such as 5 Why or verification tests.",
    ],
    mistakes: [
      "Mixing symptoms and causes.",
      "Adding too many vague ideas without validation.",
      "Ignoring categories that seem less obvious.",
      "Using it as a brainstorming dump without prioritization.",
    ],
    visual:
      "Use a fishbone structure with branches for People, Machine, Method, Material, Measurement, and Environment.",
  },
  "action-plan": {
    title: "Action Plan",
    intro:
      "A practical execution tool to convert decisions into clear actions with owners, deadlines, and status.",
    category: "Execution",
    bestUse: "Best when the team needs clear follow-up and visible accountability.",
    steps: [
      "Define the action clearly.",
      "Assign one responsible owner.",
      "Set a realistic deadline.",
      "Track the current status.",
      "Review blockers and update progress regularly.",
    ],
    mistakes: [
      "Actions without owners.",
      "Deadlines that are missing or unrealistic.",
      "No follow-up rhythm.",
      "Vague action wording.",
    ],
    visual:
      "Use a table with Action | Owner | Deadline | Status | Notes.",
  },
};

function buildInitialData(slug: string): ToolFormData {
  if (slug === "5-why") {
    return {
      problemStatement: "",
      why1: "",
      why2: "",
      why3: "",
      why4: "",
      why5: "",
      rootCause: "",
    };
  }

  if (slug === "ishikawa") {
    return {
      problemStatement: "",
      people: "",
      machine: "",
      method: "",
      material: "",
      measurement: "",
      environment: "",
      validatedCause: "",
    };
  }

  if (slug === "action-plan") {
    return {
      action1: "",
      owner1: "",
      deadline1: "",
      status1: "",
      notes1: "",
      action2: "",
      owner2: "",
      deadline2: "",
      status2: "",
      notes2: "",
      action3: "",
      owner3: "",
      deadline3: "",
      status3: "",
      notes3: "",
    };
  }

  return {
    notes: "",
  };
}

export default function ToolkitDetail() {
  const { slug = "" } = useParams();
  const { toast } = useToast();

  const tool = TOOL_DETAILS[slug];
  const storageKey = `leanops_toolkit_${slug}`;

  const [formData, setFormData] = useState<ToolFormData>(buildInitialData(slug));
  const [lastSaved, setLastSaved] = useState<string>("");

  useEffect(() => {
    if (!slug) return;

    const initial = buildInitialData(slug);
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ToolFormData;
        setFormData({ ...initial, ...parsed });
      } catch {
        setFormData(initial);
      }
    } else {
      setFormData(initial);
    }
  }, [slug, storageKey]);

  useEffect(() => {
    if (!slug) return;

    const timer = window.setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(formData));
      const now = new Date().toLocaleTimeString();
      setLastSaved(now);
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [formData, slug, storageKey]);

  const handleSave = () => {
    localStorage.setItem(storageKey, JSON.stringify(formData));
    const now = new Date().toLocaleTimeString();
    setLastSaved(now);
    toast({
      title: "Toolkit saved",
      description: "Your work has been saved locally.",
    });
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const workingArea = useMemo(() => {
    if (slug === "5-why") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Problem statement</Label>
            <Input
              value={formData.problemStatement || ""}
              onChange={(e) => updateField("problemStatement", e.target.value)}
              placeholder="Describe the problem clearly and factually"
            />
          </div>

          {[1, 2, 3, 4, 5].map((n) => (
            <div className="space-y-2" key={n}>
              <Label>{`Why ${n}`}</Label>
              <Textarea
                value={formData[`why${n}`] || ""}
                onChange={(e) => updateField(`why${n}`, e.target.value)}
                placeholder={`Write the answer for Why ${n}`}
                rows={3}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label>Root cause conclusion</Label>
            <Textarea
              value={formData.rootCause || ""}
              onChange={(e) => updateField("rootCause", e.target.value)}
              placeholder="Summarize the validated root cause"
              rows={4}
            />
          </div>
        </div>
      );
    }

    if (slug === "ishikawa") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Problem statement</Label>
            <Input
              value={formData.problemStatement || ""}
              onChange={(e) => updateField("problemStatement", e.target.value)}
              placeholder="Describe the problem at the head of the fishbone"
            />
          </div>

          {[
            ["people", "People / Man"],
            ["machine", "Machine"],
            ["method", "Method"],
            ["material", "Material"],
            ["measurement", "Measurement"],
            ["environment", "Environment"],
          ].map(([key, label]) => (
            <div className="space-y-2" key={key}>
              <Label>{label}</Label>
              <Textarea
                value={formData[key] || ""}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder={`Possible causes related to ${label}`}
                rows={3}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label>Validated likely cause(s)</Label>
            <Textarea
              value={formData.validatedCause || ""}
              onChange={(e) => updateField("validatedCause", e.target.value)}
              placeholder="Write the most likely or validated causes"
              rows={4}
            />
          </div>
        </div>
      );
    }

    if (slug === "action-plan") {
      return (
        <div className="space-y-5">
          {[1, 2, 3].map((row) => (
            <div key={row} className="rounded-2xl border border-slate-200 p-4">
              <p className="mb-4 text-sm font-medium text-slate-900">
                Action {row}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Action</Label>
                  <Input
                    value={formData[`action${row}`] || ""}
                    onChange={(e) => updateField(`action${row}`, e.target.value)}
                    placeholder="Describe the action clearly"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Owner</Label>
                  <Input
                    value={formData[`owner${row}`] || ""}
                    onChange={(e) => updateField(`owner${row}`, e.target.value)}
                    placeholder="Who owns this action?"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Deadline</Label>
                  <Input
                    value={formData[`deadline${row}`] || ""}
                    onChange={(e) => updateField(`deadline${row}`, e.target.value)}
                    placeholder="e.g. 2026-03-30"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input
                    value={formData[`status${row}`] || ""}
                    onChange={(e) => updateField(`status${row}`, e.target.value)}
                    placeholder="Not started / In progress / Done"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={formData[`notes${row}`] || ""}
                    onChange={(e) => updateField(`notes${row}`, e.target.value)}
                    placeholder="Add blockers, dependencies, or follow-up notes"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={formData.notes || ""}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Write your notes here..."
          rows={8}
        />
      </div>
    );
  }, [slug, formData]);

  if (!tool) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Tool not found</p>
        <Button className="mt-4" asChild>
          <Link to="/app/toolkits">Back to toolkits</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/app/toolkits">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">{tool.category}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {tool.title}
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">{tool.intro}</p>
            <p className="mt-3 text-sm text-slate-500">
              <span className="font-medium text-slate-700">Best use:</span> {tool.bestUse}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {lastSaved && (
              <span className="text-xs text-slate-500">Last saved: {lastSaved}</span>
            )}

            <Button variant="outline" className="rounded-xl" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save my work
            </Button>

            <Button className="rounded-xl" asChild>
              <Link to="/app/problems/new">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Use in a case
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
                How to use it
              </h3>
              <ul className="space-y-3">
                {tool.steps.map((step) => (
                  <li key={step} className="flex gap-3 text-sm leading-6 text-slate-600">
                    <span className="mt-1 h-2 w-2 rounded-full bg-slate-300" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
                Working area
              </h3>
              {workingArea}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Visual Aid</h3>
              </div>
              <p className="text-sm leading-6 text-slate-600">{tool.visual}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Common Mistakes</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                {tool.mistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-300" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Next Step</h3>
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Use this tool to structure your analysis, then carry the conclusions back into your case workspace.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}