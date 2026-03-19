import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Wrench,
  ArrowRight,
  Layers3,
  Target,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const TOOLKITS = [
  {
    slug: "5-why",
    title: "5 Why",
    description: "Identify root causes by asking why repeatedly.",
    category: "Root Cause",
    use: "When you need to understand why a problem happens",
  },
  {
    slug: "ishikawa",
    title: "Ishikawa (Fishbone)",
    description: "Structure possible causes visually by category.",
    category: "Root Cause",
    use: "When causes are multiple and complex",
  },
  {
    slug: "pareto",
    title: "Pareto Analysis",
    description: "Focus on the few causes that create most of the impact.",
    category: "Analysis",
    use: "When you need to prioritize issues",
  },
  {
    slug: "sipoc",
    title: "SIPOC",
    description: "Define Suppliers, Inputs, Process, Outputs, Customers.",
    category: "Process",
    use: "When defining scope and process boundaries",
  },
  {
    slug: "action-plan",
    title: "Action Plan",
    description: "Turn decisions into clear actions with owners and deadlines.",
    category: "Execution",
    use: "When you need structured execution",
  },
];

export default function Toolkits() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(TOOLKITS.map((t) => t.category)))];
  }, []);

  const filtered = useMemo(() => {
    return TOOLKITS.filter((t) => {
      const haystack =
        `${t.title} ${t.description} ${t.category} ${t.use}`.toLowerCase();

      const matchesSearch = haystack.includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "all" || t.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const stats = useMemo(() => {
    return {
      total: TOOLKITS.length,
      rootCause: TOOLKITS.filter((t) => t.category === "Root Cause").length,
      execution: TOOLKITS.filter((t) => t.category === "Execution").length,
      visible: filtered.length,
    };
  }, [filtered]);

  return (
    <div className="space-y-8">
      <section className="page-header">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-slate-500">Toolkits</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Practical Lean tools and structured working methods
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Explore practical methods with guidance, visual logic, and direct use inside your cases and execution workflows.
            </p>
          </div>

          <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:block">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-slate-500" />
              <p className="text-sm font-medium text-slate-900">
                Practical method library
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Learn fast, apply directly.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Total toolkits</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <Wrench className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Root cause tools</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.rootCause}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <Target className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Execution tools</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.execution}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Visible results</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {stats.visible}
                </p>
              </div>
              <div className="rounded-xl bg-slate-100 p-2.5">
                <Layers3 className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tools, categories, or usage..."
              className="h-11 rounded-xl border-slate-200 bg-white pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl border px-3 py-2 text-sm transition ${
                  activeCategory === category
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category === "all" ? "All toolkits" : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="surface-card p-12 text-center">
          <Wrench className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No tools found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try another keyword or change the selected category.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Link key={t.slug} to={`/app/toolkits/${t.slug}`}>
              <Card className="h-full rounded-2xl border-slate-200 shadow-sm transition hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t.description}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-100 p-2.5">
                      <Wrench className="h-4 w-4 text-slate-700" />
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      Best use
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {t.use}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wide text-slate-400">
                      {t.category}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
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