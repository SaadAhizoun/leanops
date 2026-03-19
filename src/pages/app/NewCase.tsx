import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Eye, Lightbulb, Wrench } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, SectionCard, SectionHeader } from "@/components/ui/page";

type ProjectOption = {
  id: string;
  title: string;
};

const problemGuides = [
  {
    type: "High downtime",
    intro:
      "Best when machines, lines, or equipment lose availability and output due to repeated or long stops.",
    tools: ["Pareto", "5 Why", "Ishikawa", "TPM checks"],
    howToStart: [
      "Break downtime into categories before searching for causes.",
      "Identify the biggest loss first instead of treating all stops equally.",
      "Use 5 Why only after you have a clear problem statement and facts.",
    ],
    visualAid:
      "Create a simple downtime visual board showing category, frequency, duration, and top recurring causes.",
  },
  {
    type: "Quality defects",
    intro:
      "Best when defects, complaints, rework, or internal non-conformities keep repeating.",
    tools: ["Pareto", "5 Why", "Ishikawa", "CTQ"],
    howToStart: [
      "Separate defect types before discussing causes.",
      "Use Pareto to focus on the biggest quality loss first.",
      "Translate complaints into clear CTQs before taking action.",
    ],
    visualAid:
      "Use a defect visual board with defect type, location, frequency, containment action, and owner.",
  },
  {
    type: "Long lead time",
    intro:
      "Best when the process takes too long from request to delivery or completion.",
    tools: ["VSM", "Flow analysis", "Bottleneck review"],
    howToStart: [
      "Map the current flow from start to finish.",
      "Separate processing time from waiting time.",
      "Locate the bottleneck before proposing improvements.",
    ],
    visualAid:
      "Use a simple current-state flow map showing steps, queues, wait time, and rework loops.",
  },
  {
    type: "Poor flow",
    intro:
      "Best when work moves badly through the process because of interruptions, batching, or poor sequence.",
    tools: ["VSM", "Waste analysis", "Standard work"],
    howToStart: [
      "Observe the process and identify where work stops, waits, or loops back.",
      "Look for batching, handoff losses, and imbalance.",
      "Use standard work to stabilize critical steps.",
    ],
    visualAid:
      "Display the process steps visually and mark where waiting, motion, transport, or rework happens.",
  },
  {
    type: "Missed KPI targets",
    intro:
      "Best when an indicator is off target and the team needs a structured way to investigate and recover.",
    tools: ["KPI tree", "5 Why", "Action plan", "Daily management"],
    howToStart: [
      "Clarify the KPI, baseline, target, and gap.",
      "Break the KPI into its main drivers.",
      "Assign actions with owners and follow-up rules.",
    ],
    visualAid:
      "Use a KPI board with target, actual, trend, root cause summary, current actions, and due dates.",
  },
  {
    type: "Customer complaints",
    intro:
      "Best when recurring complaints reveal unmet expectations, poor quality, or service gaps.",
    tools: ["VOC", "CTQ", "5 Why", "Action plan"],
    howToStart: [
      "Group complaints by pattern, not by individual anecdote.",
      "Translate customer language into measurable CTQs.",
      "Separate containment from permanent corrective action.",
    ],
    visualAid:
      "Create a complaint board with complaint type, frequency, CTQ, root cause status, and action owner.",
  },
];

const problemTypes = [
  "High downtime",
  "Quality defects",
  "High scrap / rework",
  "Long lead time",
  "Poor flow",
  "Inventory too high",
  "Missed KPI targets",
  "Productivity loss",
  "Poor daily management",
  "Low OEE",
  "Capacity bottleneck",
  "Process instability",
  "Poor communication / escalation",
  "Customer complaints",
  "Service delays",
  "Patient / service flow issues",
  "Cost overrun",
  "Custom problem",
];

const sectors = ["manufacturing", "service", "healthcare", "other"];

export default function NewCase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get("type") || "";

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    problem_type: initialType,
    sector: "manufacturing",
    project_id: "none",
    site: "",
    department: "",
    business_impact: "",
    impacted_kpi: "",
    priority: "medium",
  });

  useEffect(() => {
    if (initialType) {
      setForm((prev) => ({ ...prev, problem_type: initialType }));
    }
  }, [initialType]);

  useEffect(() => {
    async function loadProjects() {
      if (!user) return;

      setLoadingProjects(true);
      const { data } = await supabase.from("projects").select("id, title").eq("user_id", user.id).order("title");
      setProjects((data as ProjectOption[]) || []);
      setLoadingProjects(false);
    }

    loadProjects();
  }, [user]);

  const selectedGuide = useMemo(
    () => problemGuides.find((guide) => guide.type.toLowerCase() === form.problem_type.toLowerCase()),
    [form.problem_type],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!form.title.trim()) {
      toast({ title: "Case title is required", variant: "destructive" });
      return;
    }

    if (!form.problem_type) {
      toast({ title: "Problem type is required", variant: "destructive" });
      return;
    }

    setLoading(true);

    const payload = {
      title: form.title.trim(),
      problem_type: form.problem_type,
      sector: form.sector,
      site: form.site.trim() || null,
      department: form.department.trim() || null,
      business_impact: form.business_impact.trim() || null,
      impacted_kpi: form.impacted_kpi.trim() || null,
      priority: form.priority,
      project_id: form.project_id === "none" ? null : form.project_id,
      user_id: user.id,
      status: "draft",
      current_stage: 1,
      stage_data: {},
    };

    const { data, error } = await supabase.from("cases").insert(payload as never).select().single();
    setLoading(false);

    if (error) {
      toast({ title: "Error creating case", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Case created", description: "Your new problem-solving case is ready." });
    navigate(`/app/problems/${data.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader
        eyebrow="New Case"
        title="Start a structured problem-solving case"
        description="Capture the key context first, then let LeanOps guide the team through clarification, analysis, countermeasures, and follow-up."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard as="div">
          <SectionHeader
            eyebrow="Case Setup"
            title="Core case information"
            description="A cleaner form structure for the details that matter most at case creation."
          />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="case-title">Case Title</Label>
              <Input
                id="case-title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Example: Repeated downtime on extrusion line 2"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Problem Type</Label>
                <Select value={form.problem_type} onValueChange={(value) => setForm((prev) => ({ ...prev, problem_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {problemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sector</Label>
                <Select value={form.sector} onValueChange={(value) => setForm((prev) => ({ ...prev, sector: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={form.project_id} onValueChange={(value) => setForm((prev) => ({ ...prev, project_id: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={loadingProjects ? "Loading projects..." : "Select a project"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Site</Label>
                <Input
                  value={form.site}
                  onChange={(e) => setForm((prev) => ({ ...prev, site: e.target.value }))}
                  placeholder="Example: Plant A / Hospital B / Service Center"
                />
              </div>

              <div className="space-y-2">
                <Label>Department / Area</Label>
                <Input
                  value={form.department}
                  onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                  placeholder="Example: Extrusion / Emergency / Customer Support"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Business Impact</Label>
              <Textarea
                value={form.business_impact}
                onChange={(e) => setForm((prev) => ({ ...prev, business_impact: e.target.value }))}
                placeholder="Describe the impact on cost, quality, delivery, safety, people, or customer experience..."
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Impacted KPI</Label>
                <Input
                  value={form.impacted_kpi}
                  onChange={(e) => setForm((prev) => ({ ...prev, impacted_kpi: e.target.value }))}
                  placeholder="Example: OEE, lead time, defect rate, waiting time"
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(value) => setForm((prev) => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Case"}
            </Button>
          </form>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard as="div">
            <SectionHeader
              eyebrow="Guidance"
              title="Recommended tools and starting moves"
              description="Choose a problem type to reveal more tailored guidance."
            />

            {selectedGuide ? (
              <div className="mt-5 space-y-5">
                <div className="surface-muted p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <Lightbulb className="h-5 w-5 text-slate-700" />
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{selectedGuide.intro}</p>
                  </div>
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">Recommended tools</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedGuide.tools.map((tool) => (
                      <span key={tool} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-slate-500">How to start</p>
                  <ul className="mt-3 space-y-3">
                    {selectedGuide.howToStart.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-5 surface-muted p-5 text-sm leading-6 text-slate-500">
                Select a problem type to see recommended tools and setup guidance before creating the case.
              </div>
            )}
          </SectionCard>

          <SectionCard as="div">
            <SectionHeader
              eyebrow="Visual Aid"
              title="Help the team picture the issue"
              description="A more visual setup prompt so the first case discussion starts with clearer context."
            />

            {selectedGuide ? (
              <div className="mt-5 surface-muted p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Eye className="h-5 w-5 text-slate-700" />
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{selectedGuide.visualAid}</p>
                </div>
              </div>
            ) : (
              <div className="mt-5 surface-muted p-5 text-sm leading-6 text-slate-500">
                Visual aids will appear here depending on the selected problem type.
              </div>
            )}

            <div className="mt-5 rounded-[1.5rem] border border-dashed border-slate-300 p-5">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-slate-500" />
                <p className="text-sm font-semibold text-slate-950">Practical flow</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create the case first, then use stage guidance, toolkit links, and knowledge pages to structure the full analysis.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
