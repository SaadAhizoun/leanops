import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

type LinkedCase = {
  id: string;
  title: string | null;
  status: string | null;
  current_stage: number | null;
  project_id: string | null;
};

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [cases, setCases] = useState<LinkedCase[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      setProject(data);

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
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <Button variant="ghost" asChild>
        <Link to="/app/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold">{project.title}</h1>
            <p className="text-slate-600 mt-2">
              {project.objective || "No objective defined"}
            </p>
          </div>
          <Badge>{project.status || "active"}</Badge>
        </div>
      </section>

      <Card>
        <CardContent className="p-6 space-y-3 text-sm text-slate-600">
          {project.description && <p>{project.description}</p>}
          {project.sponsor && (
            <p>
              <b>Sponsor:</b> {project.sponsor}
            </p>
          )}
          {project.risk_level && (
            <p>
              <b>Risk Level:</b> {project.risk_level}
            </p>
          )}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Linked Cases</h2>

        {cases.length === 0 ? (
          <p className="text-slate-500">No cases linked yet</p>
        ) : (
          <div className="space-y-3">
            {cases.map((c) => (
              <Link key={c.id} to={`/app/problems/${c.id}`}>
                <Card className="hover:shadow-md transition">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-slate-500">
                        Stage {c.current_stage}/12
                      </p>
                    </div>
                    <Badge>{c.status}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}