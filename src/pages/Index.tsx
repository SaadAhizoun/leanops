import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Search,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Knowledge Hub",
    desc: "A beautifully organized Lean and operational excellence library your teams can learn from fast.",
  },
  {
    icon: Search,
    title: "Structured Problem Solving",
    desc: "Move from issue intake to root cause and closure with guided case workflows.",
  },
  {
    icon: Wrench,
    title: "Lean Toolkits",
    desc: "Use practical frameworks like 5 Why, Ishikawa, Pareto, SIPOC, and value stream mapping.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessments",
    desc: "Run maturity reviews and self-checks to identify gaps and prioritize the right actions.",
  },
  {
    icon: BarChart3,
    title: "Projects & KPIs",
    desc: "Track initiatives, ownership, timelines, and the metrics that matter in one place.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Align operators, managers, and improvement leaders around shared execution.",
  },
];

const steps = [
  {
    num: "01",
    title: "Discover",
    desc: "Explore best practices, methods, and proven Lean principles from the knowledge base.",
  },
  {
    num: "02",
    title: "Diagnose",
    desc: "Capture operational issues, define the problem clearly, and investigate the real causes.",
  },
  {
    num: "03",
    title: "Execute",
    desc: "Launch action plans, assign owners, and drive progress with practical improvement tools.",
  },
  {
    num: "04",
    title: "Sustain",
    desc: "Standardize wins, monitor performance, and build a culture of continuous improvement.",
  },
];

const highlights = [
  "Premium dashboard-style experience",
  "Focused workflows for real teams",
  "Clearer data storytelling and actions",
];

const metrics = [
  { label: "Case resolution flow", value: "12-stage" },
  { label: "Improvement visibility", value: "Real-time" },
  { label: "Team alignment", value: "Cross-functional" },
];

export default function Index() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))]" />
      <div className="absolute left-1/2 top-24 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/80 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Modern operational excellence workspace
              </div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 md:text-6xl md:leading-[1.05]">
                Make LeanOps feel
                <span className="block bg-gradient-to-r from-primary via-sky-500 to-cyan-400 bg-clip-text text-transparent">
                  sharper, smarter, and more visual
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                A more modern experience for learning, diagnosing, and solving operational challenges—
                designed with stronger hierarchy, richer surfaces, and cleaner data visualization.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-2xl px-6 shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link to="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 rounded-2xl px-6 bg-white/70" asChild>
                  <Link to="/about">Explore Platform</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/15 via-sky-400/10 to-cyan-300/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.14)] backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Operations overview</p>
                    <h3 className="text-xl font-semibold text-slate-950">Improvement cockpit</h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-600">Impact</p>
                    <p className="text-lg font-semibold text-emerald-700">+24%</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{metric.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{metric.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Active initiatives</p>
                      <p className="text-2xl font-semibold text-slate-950">8 strategic workstreams</p>
                    </div>
                    <Gauge className="h-9 w-9 rounded-2xl bg-primary/10 p-2 text-primary" />
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Root cause investigations", width: "78%", color: "bg-primary" },
                      { name: "Action plan completion", width: "64%", color: "bg-sky-500" },
                      { name: "Standardization rollout", width: "86%", color: "bg-emerald-500" },
                    ].map((item) => (
                      <div key={item.name}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{item.name}</span>
                          <span className="text-slate-500">{item.width}</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-slate-200">
                          <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: item.width }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
                      <BrainCircuit className="h-4 w-4 text-cyan-300" />
                      Smart workflow guidance
                    </div>
                    <p className="text-sm leading-6 text-slate-300">
                      Recommended methods and next actions based on the stage of the case.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-50 to-cyan-50 p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-medium text-sky-700">
                      <BarChart3 className="h-4 w-4" />
                      Visual progress
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Cleaner cards, stronger contrast, and more premium visual rhythm across the app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-10">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
                Platform capabilities
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Everything your teams need in one polished workspace
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                LeanOps combines structured execution with a more premium visual language so the platform
                feels easier to trust, easier to navigate, and more enjoyable to use.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-sky-100 text-primary transition group-hover:scale-105">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">
              How it works
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
              A clearer path from knowledge to sustained execution
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              The experience is now more visually guided so users can understand what to do next at a glance.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
                <div className="relative">
                  <div className="mb-5 text-5xl font-bold tracking-tight text-primary/15">{step.num}</div>
                  <h3 className="text-xl font-semibold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.24)] md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">Built for real operations</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Appealing visual design with practical business value
              </h2>
              <p className="mt-4 max-w-2xl text-slate-300 leading-7">
                Designed for manufacturing, healthcare, logistics, services, and transformation teams that need
                software to look professional while staying actionable and grounded.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Manufacturing", "Healthcare", "Services", "Logistics", "Automotive", "Transformation"].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary/70">Why it feels better</p>
              <div className="mt-6 space-y-5">
                {[
                  "More depth with soft glassmorphism and elevated cards",
                  "Better typography hierarchy for faster scanning",
                  "Stronger CTA placement and cleaner section rhythm",
                  "Dashboard-inspired visual blocks that feel premium",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-emerald-100 p-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <p className="text-sm leading-6 text-slate-600">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary via-sky-700 to-cyan-500 p-10 text-center text-white shadow-[0_25px_80px_rgba(37,99,235,0.28)] md:p-14">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">Start now</p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
              A more modern LeanOps experience starts here
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-cyan-50/90 md:text-lg">
              Bring structure, clarity, and stronger visual storytelling to your operational excellence work.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                size="lg"
                variant="secondary"
                className="h-12 rounded-2xl border-0 bg-white px-6 text-primary hover:bg-slate-100"
                asChild
              >
                <Link to="/auth/signup">
                  Create Your Free Account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-2xl border-white/30 bg-white/10 px-6 text-white hover:bg-white/20"
                asChild
              >
                <Link to="/contact">Talk to Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
