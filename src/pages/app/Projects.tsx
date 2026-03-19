import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ArrowRight,
  FolderKanban,
  Activity,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Project = {
  id: string;
  title: string;
  objective: string | null;
  status: string | null;
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
    async function load() {
      if (!user) return;
      setLoading(true);

      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      setProjects((data as Project[]) || []);
      setLoading(false);
    }

    load();
  }, [user]);

  const create = async () => {
    if (!user || !form.title.trim()) {
      toast({
        title: "Project title is required",
        variant: "destructive",
      });
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
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setOpen(false);
    setForm({ title: "", objective: "" });
    navigate(`/app/projects/${data.id}`);
  };

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const haystack = `${p.title} ${p.objective || ""}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [projects, search]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === "active").length,
      draft: projects.filter((p) => p.status === "draft").length,
      completed: projects.filter((p) => p.status === "completed").length,
    };
  }, [projects]);

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">Projects</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Improvement initiatives & programs
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Manage structured improvement projects and track execution across multiple cases and actions.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl px-5 shadow-sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  placeholder="Project title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200"
                />

                <Input
                  placeholder="Objective"
                  value={form.objective}
                  onChange={(e) =>
                    setForm({ ...form, objective: e.target.value })
                  }
                  className="h-11 rounded-xl border-slate-200"
                />

                <Button
                  onClick={create}
                  className="h-11 w-full rounded-xl"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Project"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total projects</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <FolderKanban className="h-5 w-5 text-slate-700" />
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search projects..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <p className="text-sm text-slate-500">
            {filtered.length} project{filtered.length > 1 ? "s" : ""} found
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
          <p className="text-base font-medium text-slate-900">No projects found</p>
          <p className="mt-2 text-sm text-slate-500">
            Create your first improvement project or refine your search.
          </p>
          <Button
            className="mt-6 h-11 rounded-xl px-5"
            onClick={() => setOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Link key={p.id} to={`/app/projects/${p.id}`}>
              <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
                          {p.title}
                        </h3>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClass(
                            p.status
                          )}`}
                        >
                          {p.status || "active"}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                        {p.objective || "No objective defined"}
                      </p>
                    </div>

                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Last update
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {p.updated_at
                        ? new Date(p.updated_at).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Open project</span>
                    <span className="font-medium text-slate-700">View details</span>
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