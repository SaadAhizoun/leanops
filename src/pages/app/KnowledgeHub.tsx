import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Library,
  Search,
  Sparkles,
} from "lucide-react";

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
  SectionHeader,
  StatsGrid,
  StatCard,
} from "@/components/ui/page";

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
        supabase.from("knowledge_topics").select("*").eq("published", true).order("title"),
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

      return matchesSearch && (activeCategory === "all" || topic.category_id === activeCategory);
    });
  }, [topics, search, activeCategory]);

  const stats = useMemo(
    () => ({
      totalTopics: topics.length,
      totalCategories: categories.length,
      visibleResults: filteredTopics.length,
    }),
    [topics, categories, filteredTopics],
  );

  const getTopicCount = (categoryId: string) => topics.filter((topic) => topic.category_id === categoryId).length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Knowledge Hub"
        title="Lean and operational excellence knowledge library"
        description="Browse structured topics, understand when to use each method, and connect knowledge directly to your cases and toolkits."
        actions={
          <div className="glass-strip hidden items-center gap-2 px-4 py-3 lg:flex">
            <Sparkles className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Practical learning workspace</p>
              <p className="text-xs text-slate-500">Learn methods, then apply them directly.</p>
            </div>
          </div>
        }
      >
        <StatsGrid>
          <StatCard label="Topics" value={stats.totalTopics} icon={BookOpen} />
          <StatCard label="Categories" value={stats.totalCategories} icon={Layers3} />
          <StatCard label="Visible results" value={stats.visibleResults} icon={Library} />
          <StatCard label="Purpose" value="Learn and apply" icon={GraduationCap} />
        </StatsGrid>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search topics, methods, or concepts..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-toggle-group">
          <ChipToggle active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>
            All topics
          </ChipToggle>
          {categories.map((category) => (
            <ChipToggle
              key={category.id}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </ChipToggle>
          ))}
        </div>
      </FilterBar>

      {!search && activeCategory === "all" ? (
        <section className="section-stack">
          <SectionHeader
            eyebrow="Browse"
            title="Browse by category"
            description="Navigate the knowledge base through structured operational excellence themes."
          />

          <div className="cards-grid-3">
            {categories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)} className="text-left">
                <Card className="h-full hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-950">{category.name}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {category.description || "Explore related Lean and operational excellence topics."}
                    </p>

                    <div className="mt-5 stat-tile">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Topics available</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">{getTopicCount(category.id)}</p>
                    </div>

                    <div className="section-divider mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                      <span>Category</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section-stack">
        <SectionHeader
          eyebrow="Library"
          title={search || activeCategory !== "all" ? `Results (${filteredTopics.length})` : "All topics"}
          description="Open a topic to explore method, usage, common mistakes, and practical examples."
        />

        {loading ? (
          <LoadingState />
        ) : filteredTopics.length === 0 ? (
          <EmptyState icon={BookOpen} title="No topics found" description="Try another keyword or choose a different category." />
        ) : (
          <div className="cards-grid-3">
            {filteredTopics.map((topic) => (
              <Link key={topic.id} to={`/app/knowledge/${topic.slug}`}>
                <Card className="h-full hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                  <CardContent className="p-5">
                    <h3 className="text-base font-semibold tracking-tight text-slate-950">{topic.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                      {topic.overview || "Open this topic to learn how and when to use it."}
                    </p>

                    <div className="mt-5 stat-tile">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Learning intent</p>
                      <p className="mt-2 text-sm font-semibold text-slate-950">Practical understanding</p>
                    </div>

                    <div className="section-divider mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                      <span>Knowledge topic</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </PageShell>
  );
}
