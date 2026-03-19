import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, BookOpen, Wrench, ArrowRight } from "lucide-react";

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

    load();
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
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Favorites</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Your saved resources
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Keep your most useful knowledge topics and toolkits close for faster reuse.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Total favorites</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{favoriteItems.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Knowledge topics</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{knowledgeCount}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Toolkits</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{toolkitCount}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search favorites..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <Star className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No favorites yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Favorite topics and toolkits to build your own working library.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => {
            const Icon = getIcon(item.type);

            return (
              <Link key={item.id} to={item.href}>
                <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
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

                    <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {item.created_at
                          ? `Saved ${new Date(item.created_at).toLocaleDateString()}`
                          : "Saved item"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}