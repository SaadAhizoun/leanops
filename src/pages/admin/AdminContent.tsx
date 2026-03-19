import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Wrench, Megaphone, FileText } from "lucide-react";

type ContentRow = {
  id: string;
  title?: string | null;
  name?: string | null;
  updated_at?: string | null;
};

type ContentItem = {
  id: string;
  type: "topic" | "toolkit" | "announcement";
  title: string;
  updated_at: string | null;
};

export default function AdminContent() {
  const [topics, setTopics] = useState<ContentRow[]>([]);
  const [toolkits, setToolkits] = useState<ContentRow[]>([]);
  const [announcements, setAnnouncements] = useState<ContentRow[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "topic" | "toolkit" | "announcement">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const [topicsRes, toolkitsRes, announcementsRes] = await Promise.all([
        supabase.from("knowledge_topics").select("id, title, updated_at").order("updated_at", { ascending: false }),
        supabase.from("toolkits").select("id, title, updated_at").order("updated_at", { ascending: false }),
        supabase.from("announcements").select("id, title, updated_at").order("updated_at", { ascending: false }),
      ]);

      setTopics((topicsRes.data as ContentRow[]) || []);
      setToolkits((toolkitsRes.data as ContentRow[]) || []);
      setAnnouncements((announcementsRes.data as ContentRow[]) || []);
      setLoading(false);
    }

    load();
  }, []);

  const contentItems = useMemo<ContentItem[]>(() => {
    const topicItems = topics.map((item) => ({
      id: item.id,
      type: "topic" as const,
      title: item.title || "Untitled topic",
      updated_at: item.updated_at || null,
    }));

    const toolkitItems = toolkits.map((item) => ({
      id: item.id,
      type: "toolkit" as const,
      title: item.title || "Untitled toolkit",
      updated_at: item.updated_at || null,
    }));

    const announcementItems = announcements.map((item) => ({
      id: item.id,
      type: "announcement" as const,
      title: item.title || "Untitled announcement",
      updated_at: item.updated_at || null,
    }));

    return [...topicItems, ...toolkitItems, ...announcementItems].sort(
      (a, b) =>
        new Date(b.updated_at || "").getTime() -
        new Date(a.updated_at || "").getTime()
    );
  }, [topics, toolkits, announcements]);

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" || item.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [contentItems, search, filter]);

  const getIcon = (type: ContentItem["type"]) => {
    if (type === "topic") return BookOpen;
    if (type === "toolkit") return Wrench;
    return Megaphone;
  };

  const getLabel = (type: ContentItem["type"]) => {
    if (type === "topic") return "Topic";
    if (type === "toolkit") return "Toolkit";
    return "Announcement";
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Admin Content</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Content management center
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Review and manage published knowledge topics, toolkits, and announcements across LeanOps.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Topics</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{topics.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Toolkits</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{toolkits.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Announcements</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{announcements.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total items</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{contentItems.length}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search content..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "topic", label: "Topics" },
              { value: "toolkit", label: "Toolkits" },
              { value: "announcement", label: "Announcements" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value as typeof filter)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  filter === item.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <FileText className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No content found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try another search term or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <Card key={`${item.type}-${item.id}`} className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="rounded-xl bg-slate-100 p-2.5">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <Badge variant="secondary">{getLabel(item.type)}</Badge>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Updated:{" "}
                          {item.updated_at
                            ? new Date(item.updated_at).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm text-slate-400">Managed content</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}