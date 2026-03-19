import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  FileText,
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState, FilterBar, PageHeader, SectionHeader, StatCard } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type Project = {
  id: string;
  title: string;
  objective: string | null;
  status: string | null;
  updated_at: string | null;
};

export default function Projects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", objective: "" });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      if (!user) return;

      setLoading(true);
      const { data } = await supabase.from("projects").select("*").eq("user_id", user.id).order("updated_at", { ascending: false });
      setProjects((data as Project[]) || []);
      setLoading(false);
    }

    loadProjects();
  }, [user]);

  const filtered = useMemo(() => {
    return projects.filter((item) => `${item.title} ${item.objective || ""}`.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((item) => item.status === "active").length,
      draft: projects.filter((item) => item.status === "draft").length,
      completed: projects.filter((item) => item.status === "completed").length,
    }),
    [projects],
  );

  const create = async () => {
    if (!user || !form.title.trim()) {
      toast({ title: "Project title is required", variant: "destructive" });
      return;
    }

    setCreating(true);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: form.title.trim(),
        objective: form.objective.trim() || null,
        user_id: user.id,
      } as never)
      .select()
      .single();

    setCreating(false);

    if (error) {
      toast({ title: "Error creating project", description: error.message, variant: "destructive" });
      return;
    }

    setOpen(false);
    setForm({ title: "", objective: "" });
    navigate(`/app/projects/${data.id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Improvement initiatives and programs"
        description="Manage structured improvement projects and track execution across linked cases and outcomes."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Start with a title and objective. You can evolve the project structure after creation.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Project title"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Objective"
                    value={form.objective}
                    onChange={(e) => setForm((prev) => ({ ...prev, objective: e.target.value }))}
                  />
                </div>
                <Button onClick={create} className="w-full" disabled={creating}>
                  {creating ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total projects" value={stats.total} icon={FolderKanban} />
          <StatCard label="Active" value={stats.active} icon={Activity} />
          <StatCard label="Drafts" value={stats.draft} icon={FileText} />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} />
        </div>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search projects..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700">
            {filtered.length} found
          </span>
          <span>Project portfolio</span>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="loading-spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects found"
          description="Create your first improvement project or refine your search to uncover active initiatives."
          action={
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Portfolio"
            title="Project library"
            description="A clearer list of initiatives with better status hierarchy and summary visibility."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <Link key={project.id} to={`/app/projects/${project.id}`}>
                <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-semibold tracking-tight text-slate-950">{project.title}</h3>
                          <StatusBadge value={project.status || "active"} />
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {project.objective || "No objective defined"}
                        </p>
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="mt-5 surface-muted px-4 py-4">
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Last update</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">
                        {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : "No recent update"}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                      <span>Open project</span>
                      <span className="font-semibold text-slate-700">View details</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
