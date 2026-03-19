import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star, BookOpen, Wrench, ArrowRight } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  EmptyState,
  FilterBar,
  PageHeader,
  PageShell,
  SectionHeader,
  StatCard,
} from "@/components/ui/page";

type FavoriteRow = {
  id: string;
  item_type: string;
  item_id: string;
  created_at?: string | null;
};

type KnowledgeTopic = {
  id: string;
  slug: string;
  title: string;
  overview?: string | null;
};

type Toolkit = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
};

type FavoriteItem = {
  id: string;
  type: "knowledge_topic" | "toolkit";
  title: string;
  description: string;
  href: string;
  created_at?: string | null;
};

export default function Favorites() {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<FavoriteRow[]>([]);
  const [topics, setTopics] = useState<KnowledgeTopic[]>([]);
  const [toolkits, setToolkits] = useState<Toolkit[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "knowledge_topic" | "toolkit">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;

      setLoading(true);

      const [favoritesRes, topicsRes, toolkitsRes] = await Promise.all([
        supabase
          .from("favorites")
          .select("id, item_type, item_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("knowledge_topics")
          .select("id, slug, title, overview")
          .eq("published", true),
        supabase
          .from("toolkits")
          .select("id, slug, title, description")
          .eq("published", true),
      ]);

      setFavorites((favoritesRes.data as FavoriteRow[]) || []);
      setTopics((topicsRes.data as KnowledgeTopic[]) || []);
      setToolkits((toolkitsRes.data as Toolkit[]) || []);
      setLoading(false);
    }

    void load();
  }, [user]);

  const favoriteItems = useMemo<FavoriteItem[]>(() => {
    const topicMap = new Map(topics.map((t) => [t.id, t]));
    const toolkitMap = new Map(toolkits.map((t) => [t.id, t]));

    return favorites
      .map((fav) => {
        if (fav.item_type === "knowledge_topic") {
          const topic = topicMap.get(fav.item_id);
          if (!topic) return null;

          return {
            id: fav.id,
            type: "knowledge_topic" as const,
            title: topic.title,
            description:
              topic.overview || "Open this topic to continue learning and applying the method.",
            href: `/app/knowledge/${topic.slug}`,
            created_at: fav.created_at || null,
          };
        }

        if (fav.item_type === "toolkit") {
          const toolkit = toolkitMap.get(fav.item_id);
          if (!toolkit) return null;

          return {
            id: fav.id,
            type: "toolkit" as const,
            title: toolkit.title,
            description:
              toolkit.description || "Open this toolkit to continue structured work.",
            href: `/app/toolkits/${toolkit.slug}`,
            created_at: fav.created_at || null,
          };
        }

        return null;
      })
      .filter(Boolean) as FavoriteItem[];
  }, [favorites, topics, toolkits]);

  const filteredItems = useMemo(() => {
    return favoriteItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter = filter === "all" || item.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [favoriteItems, search, filter]);

  const knowledgeCount = favoriteItems.filter((item) => item.type === "knowledge_topic").length;
  const toolkitCount = favoriteItems.filter((item) => item.type === "toolkit").length;

  const getIcon = (type: FavoriteItem["type"]) => {
    return type === "knowledge_topic" ? BookOpen : Wrench;
  };

  const getLabel = (type: FavoriteItem["type"]) => {
    return type === "knowledge_topic" ? "Knowledge Topic" : "Toolkit";
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Favorites"
        title="Your saved resources"
        description="Keep your most useful knowledge topics and toolkits close so you can return to the right methods faster."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Total favorites" value={favoriteItems.length} icon={Star} />
          <StatCard label="Knowledge topics" value={knowledgeCount} icon={BookOpen} />
          <StatCard label="Toolkits" value={toolkitCount} icon={Wrench} />
        </div>
      </PageHeader>

      <FilterBar>
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search favorites..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "all", label: "All" },
              { value: "knowledge_topic", label: "Knowledge" },
              { value: "toolkit", label: "Toolkits" },
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

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
              {filteredItems.length} visible
            </span>
          </div>
        </div>
      </FilterBar>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading-spinner" />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="Favorite topics and toolkits to build your own working library and reduce search time later."
        />
      ) : (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Library"
            title="Saved knowledge and tools"
            description="A cleaner saved-items view with clearer type labels and faster scan paths."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => {
              const Icon = getIcon(item.type);

              return (
                <Link key={item.id} to={item.href}>
                  <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-slate-100 p-2.5">
                          <Icon className="h-5 w-5 text-slate-700" />
                        </div>

                        <Badge variant="secondary">{getLabel(item.type)}</Badge>
                      </div>

                      <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>

                      <div className="mt-5 surface-muted px-4 py-4">
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Saved
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-950">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleDateString()
                            : "Recently added"}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                        <span>Open resource</span>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </PageShell>
  );
}
