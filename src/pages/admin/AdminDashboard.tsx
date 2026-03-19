import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  FolderKanban,
  Activity,
  BookOpen,
  Wrench,
  Shield,
  ArrowRight,
} from "lucide-react";

type BasicRow = {
  id: string;
  status?: string | null;
  role?: string | null;
  title?: string | null;
  updated_at?: string | null;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<BasicRow[]>([]);
  const [cases, setCases] = useState<BasicRow[]>([]);
  const [projects, setProjects] = useState<BasicRow[]>([]);
  const [topics, setTopics] = useState<BasicRow[]>([]);
  const [toolkits, setToolkits] = useState<BasicRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [usersRes, casesRes, projectsRes, topicsRes, toolkitsRes] = await Promise.all([
        supabase.from("profiles").select("id, updated_at"),
        supabase.from("cases").select("id, status, title, updated_at"),
        supabase.from("projects").select("id, status, title, updated_at"),
        supabase.from("knowledge_topics").select("id, title, updated_at"),
        supabase.from("toolkits").select("id, title, updated_at"),
      ]);

      setUsers((usersRes.data as BasicRow[]) || []);
      setCases((casesRes.data as BasicRow[]) || []);
      setProjects((projectsRes.data as BasicRow[]) || []);
      setTopics((topicsRes.data as BasicRow[]) || []);
      setToolkits((toolkitsRes.data as BasicRow[]) || []);
      setLoading(false);
    }

    load();
  }, []);

  const stats = useMemo(() => {
    return [
      { label: "Users", value: users.length, icon: Users },
      { label: "Cases", value: cases.length, icon: Activity },
      { label: "Projects", value: projects.length, icon: FolderKanban },
      { label: "Knowledge Topics", value: topics.length, icon: BookOpen },
      { label: "Toolkits", value: toolkits.length, icon: Wrench },
      {
        label: "Active Cases",
        value: cases.filter((c) => c.status === "active").length,
        icon: Shield,
      },
    ];
  }, [users, cases, projects, topics, toolkits]);

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 5);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Platform control center
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Monitor platform activity, content volume, and operational health across LeanOps.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {loading ? "..." : stat.value}
                </p>
              </div>

              <div className="rounded-xl bg-slate-100 p-2.5">
                <stat.icon className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Recent cases
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recently updated problem-solving workspaces.
            </p>

            <div className="mt-6 space-y-3">
              {recentCases.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No cases yet.
                </div>
              ) : (
                recentCases.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.title || "Untitled case"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.status || "draft"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Recent projects
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recently updated initiatives and programs.
            </p>

            <div className="mt-6 space-y-3">
              {recentProjects.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No projects yet.
                </div>
              ) : (
                recentProjects.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {item.title || "Untitled project"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.status || "active"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}