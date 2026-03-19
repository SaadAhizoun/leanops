import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  BookOpen,
  ArrowRight,
  Library,
  Layers3,
  GraduationCap,
  Sparkles,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number | null;
};

type Topic = {
  id: string;
  slug: string;
  title: string;
  overview: string | null;
  category_id: string | null;
  published: boolean | null;
};

export default function KnowledgeHub() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const [{ data: categoriesData }, { data: topicsData }] = await Promise.all([
        supabase.from("knowledge_categories").select("*").order("sort_order"),
        supabase
          .from("knowledge_topics")
          .select("*")
          .eq("published", true)
          .order("title"),
      ]);

      setCategories((categoriesData as Category[]) || []);
      setTopics((topicsData as Topic[]) || []);
      setLoading(false);
    }

    loadData();
  }, []);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        (topic.overview || "").toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "all" || topic.category_id === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [topics, search, activeCategory]);

  const stats = useMemo(() => {
    return {
      totalTopics: topics.length,
      totalCategories: categories.length,
      visibleResults: filteredTopics.length,
    };
  }, [topics, categories, filteredTopics]);

  const getTopicCount = (categoryId: string) =>
    topics.filter((t) => t.category_id === categoryId).length;

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">Knowledge Hub</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Lean and operational excellence knowledge library
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Browse structured topics, understand when to use each method, and connect knowledge directly to your cases and toolkits.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:block">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-medium text-slate-900">
                Practical learning workspace
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Learn methods, then apply them directly.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Topics</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.totalTopics}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <BookOpen className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Categories</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.totalCategories}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <Layers3 className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Visible results</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.visibleResults}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <Library className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Purpose</p>
                <p className="mt-3 text-base font-semibold tracking-tight text-slate-900">
                  Learn & apply
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <GraduationCap className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search topics, methods, or concepts..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                activeCategory === "all"
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All topics
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  activeCategory === category.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!search && activeCategory === "all" && (
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Browse by category
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Navigate the knowledge base through structured operational excellence themes.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="text-left"
              >
                <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                          {category.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {category.description || "Explore related Lean and operational excellence topics."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Topics available
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {getTopicCount(category.id)}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        Category
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              {search || activeCategory !== "all"
                ? `Results (${filteredTopics.length})`
                : "All Topics"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Open a topic to explore method, usage, common mistakes, and practical examples.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="surface-card p-12 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-slate-300" />
            <p className="text-base font-medium text-slate-900">No topics found</p>
            <p className="mt-2 text-sm text-slate-500">
              Try another keyword or choose a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredTopics.map((topic) => (
              <Link key={topic.id} to={`/app/knowledge/${topic.slug}`}>
                <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold tracking-tight text-slate-900">
                          {topic.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                          {topic.overview || "Open this topic to learn how and when to use it."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Learning intent
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        Practical understanding
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-slate-400">
                        Knowledge topic
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
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