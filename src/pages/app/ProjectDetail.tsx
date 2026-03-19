import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FolderKanban, Target } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SectionCard, SectionHeader } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type LinkedCase = {
  id: string;
  title: string | null;
  status: string | null;
  current_stage: number | null;
  project_id: string | null;
};

type Project = {
  id: string;
  title: string;
  objective: string | null;
  status: string | null;
  description?: string | null;
  sponsor?: string | null;
  risk_level?: string | null;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [cases, setCases] = useState<LinkedCase[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("projects").select("*").eq("id", id).single();
      setProject((data as Project | null) ?? null);

      const casesResponse = await (supabase as any)
        .from("cases")
        .select("id, title, status, current_stage, project_id")
        .eq("project_id", id as string);

      setCases((casesResponse?.data ?? []) as LinkedCase[]);
    }

    if (id) {
      load();
    }
  }, [id]);

  if (!project) {
    return (
      <div className="flex justify-center py-16">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Button variant="outline" asChild>
        <Link to="/app/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <PageHeader
        eyebrow="Project Detail"
        title={project.title}
        description={project.objective || "No objective defined yet for this project."}
        actions={<StatusBadge value={project.status || "active"} className="text-sm" />}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard as="div">
          <SectionHeader
            eyebrow="Overview"
            title="Project summary"
            description="The primary objective, descriptive context, and execution framing for the initiative."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="surface-muted p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Target className="h-4 w-4" />
                <p className="text-sm font-semibold">Objective</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{project.objective || "No objective defined"}</p>
            </div>
            <div className="surface-muted p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <FolderKanban className="h-4 w-4" />
                <p className="text-sm font-semibold">Status</p>
              </div>
              <div className="mt-2">
                <StatusBadge value={project.status || "active"} />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            {project.description ? <p>{project.description}</p> : <p>No detailed description has been added yet.</p>}
            {project.sponsor ? <p><span className="font-semibold text-slate-950">Sponsor:</span> {project.sponsor}</p> : null}
            {project.risk_level ? <p><span className="font-semibold text-slate-950">Risk level:</span> {project.risk_level}</p> : null}
          </div>
        </SectionCard>

        <SectionCard as="div">
          <SectionHeader
            eyebrow="Execution"
            title="Linked cases"
            description="Problem-solving workspaces connected to this initiative."
          />

          <div className="mt-6 space-y-3">
            {cases.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                No cases linked yet.
              </div>
            ) : (
              cases.map((item) => (
                <Link key={item.id} to={`/app/problems/${item.id}`}>
                  <Card className="transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-950">{item.title || "Untitled case"}</p>
                          <StatusBadge value={item.status || "draft"} />
                        </div>
                        <p className="mt-1 text-xs text-slate-500">Stage {item.current_stage || 1}/12</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
