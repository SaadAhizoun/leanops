import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers3, Search, ShieldCheck, Sparkles, Target, Wrench } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ChipToggle,
  EmptyState,
  FilterBar,
  PageHeader,
  PageShell,
  StatsGrid,
  StatCard,
} from "@/components/ui/page";

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

  const categories = useMemo(() => ["all", ...Array.from(new Set(TOOLKITS.map((toolkit) => toolkit.category)))], []);

  const filtered = useMemo(() => {
    return TOOLKITS.filter((toolkit) => {
      const haystack = `${toolkit.title} ${toolkit.description} ${toolkit.category} ${toolkit.use}`.toLowerCase();
      return haystack.includes(search.toLowerCase()) && (activeCategory === "all" || toolkit.category === activeCategory);
    });
  }, [search, activeCategory]);

  const stats = useMemo(
    () => ({
      total: TOOLKITS.length,
      rootCause: TOOLKITS.filter((toolkit) => toolkit.category === "Root Cause").length,
      execution: TOOLKITS.filter((toolkit) => toolkit.category === "Execution").length,
      visible: filtered.length,
    }),
    [filtered],
  );

  return (
    <PageShell>
      <PageHeader
        eyebrow="Toolkits"
        title="Practical Lean tools and working methods"
        description="Explore practical methods with guidance, visual logic, and direct use inside your cases and execution workflows."
        actions={
          <div className="glass-strip hidden items-center gap-2 px-4 py-3 lg:flex">
            <Sparkles className="h-4 w-4 text-slate-500" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Practical method library</p>
              <p className="text-xs text-slate-500">Learn fast, apply directly.</p>
            </div>
          </div>
        }
      >
        <StatsGrid>
          <StatCard label="Total toolkits" value={stats.total} icon={Wrench} />
          <StatCard label="Root cause tools" value={stats.rootCause} icon={Target} />
          <StatCard label="Execution tools" value={stats.execution} icon={ShieldCheck} />
          <StatCard label="Visible results" value={stats.visible} icon={Layers3} />
        </StatsGrid>
      </PageHeader>

      <FilterBar>
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tools, categories, or usage..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chip-toggle-group">
          {categories.map((category) => (
            <ChipToggle key={category} active={activeCategory === category} onClick={() => setActiveCategory(category)}>
              {category === "all" ? "All toolkits" : category}
            </ChipToggle>
          ))}
        </div>
      </FilterBar>

      {filtered.length === 0 ? (
        <EmptyState icon={Wrench} title="No tools found" description="Try another keyword or change the selected category." />
      ) : (
        <div className="cards-grid-3">
          {filtered.map((toolkit) => (
            <Link key={toolkit.slug} to={`/app/toolkits/${toolkit.slug}`}>
              <Card className="h-full hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{toolkit.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{toolkit.description}</p>
                    </div>

                    <div className="icon-tile">
                      <Wrench className="h-4 w-4 text-slate-700" />
                    </div>
                  </div>

                  <div className="mt-5 stat-tile">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Best use</p>
                    <p className="mt-2 text-sm font-semibold text-slate-950">{toolkit.use}</p>
                  </div>

                  <div className="section-divider mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-slate-400">
                    <span>{toolkit.category}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageShell>
  );
}
