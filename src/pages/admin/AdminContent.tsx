import { useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Megaphone, Search, Wrench } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChipToggle,
  EmptyState,
  FilterBar,
  LoadingState,
  PageHeader,
  PageShell,
  StatsGrid,
  StatCard,
} from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type ContentRow = {
  id: string;
  title?: string | null;
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
      (a, b) => new Date(b.updated_at || "").getTime() - new Date(a.updated_at || "").getTime(),
    );
  }, [topics, toolkits, announcements]);

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesSearch && (filter === "all" || item.type === filter);
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
    <PageShell>
      <PageHeader
        eyebrow="Admin Content"
        title="Content management center"
        description="Review and manage published knowledge topics, toolkits, and announcements across LeanOps."
      >
        <StatsGrid>
          <StatCard label="Topics" value={topics.length} icon={BookOpen} />
          <StatCard label="Toolkits" value={toolkits.length} icon={Wrench} />
          <StatCard label="Announcements" value={announcements.length} icon={Megaphone} />
          <StatCard label="Total items" value={contentItems.length} icon={FileText} />
        </StatsGrid>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search content..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-toggle-group">
          {[
            { value: "all", label: "All" },
            { value: "topic", label: "Topics" },
            { value: "toolkit", label: "Toolkits" },
            { value: "announcement", label: "Announcements" },
          ].map((item) => (
            <ChipToggle
              key={item.value}
              active={filter === item.value}
              onClick={() => setFilter(item.value as typeof filter)}
            >
              {item.label}
            </ChipToggle>
          ))}
        </div>
      </FilterBar>

      {loading ? (
        <LoadingState />
      ) : filteredItems.length === 0 ? (
        <EmptyState icon={FileText} title="No content found" description="Try another search term or filter." />
      ) : (
        <div className="section-stack">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <Card key={`${item.type}-${item.id}`}>
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="icon-tile">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-950">{item.title}</h3>
                          <StatusBadge value="active">{getLabel(item.type)}</StatusBadge>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Updated {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="text-sm font-medium text-slate-400">Managed content</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
