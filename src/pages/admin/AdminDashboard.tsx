import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  FolderKanban,
  Shield,
  Users,
  Wrench,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, SectionCard, SectionHeader, StatCard } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type BasicRow = {
  id: string;
  status?: string | null;
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

  const stats = useMemo(
    () => [
      { label: "Users", value: users.length, icon: Users },
      { label: "Cases", value: cases.length, icon: Activity },
      { label: "Projects", value: projects.length, icon: FolderKanban },
      { label: "Knowledge Topics", value: topics.length, icon: BookOpen },
      { label: "Toolkits", value: toolkits.length, icon: Wrench },
      { label: "Active Cases", value: cases.filter((item) => item.status === "active").length, icon: Shield },
    ],
    [users, cases, projects, topics, toolkits],
  );

  const recentCases = [...cases]
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 5);

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin"
        title="Platform control center"
        description="Monitor platform activity, content volume, and operational health across LeanOps with cleaner information architecture."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={loading ? "..." : stat.value} icon={stat.icon} />
          ))}
        </div>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard as="div">
          <SectionHeader
            eyebrow="Activity"
            title="Recent cases"
            description="Recently updated problem-solving workspaces."
          />

          <div className="mt-6 space-y-3">
            {recentCases.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                No cases yet.
              </div>
            ) : (
              recentCases.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.title || "Untitled case"}</p>
                      <div className="mt-2">
                        <StatusBadge value={item.status || "draft"} />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard as="div">
          <SectionHeader
            eyebrow="Portfolio"
            title="Recent projects"
            description="Recently updated initiatives and programs."
          />

          <div className="mt-6 space-y-3">
            {recentProjects.length === 0 ? (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                No projects yet.
              </div>
            ) : (
              recentProjects.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.title || "Untitled project"}</p>
                      <div className="mt-2">
                        <StatusBadge value={item.status || "active"} />
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
