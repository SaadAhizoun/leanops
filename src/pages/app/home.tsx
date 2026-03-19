import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Wrench,
  FolderKanban,
  Search,
  CheckCircle2,
  Activity,
  Shield,
} from "lucide-react";

const features = [
  {
    title: "Structured Problem Solving",
    description:
      "Guide operational issues from intake to closure through a clear 12-stage workspace.",
    icon: Search,
  },
  {
    title: "Knowledge Hub",
    description:
      "Browse Lean, operational excellence, and practical problem-solving content in one place.",
    icon: BookOpen,
  },
  {
    title: "Toolkits",
    description:
      "Use practical methods such as 5 Why, Ishikawa, Pareto, and action planning with guidance.",
    icon: Wrench,
  },
  {
    title: "Projects and Execution",
    description:
      "Organize cases under initiatives and keep improvement efforts visible and connected.",
    icon: FolderKanban,
  },
];

const steps = [
  "Choose the problem or situation you want to structure",
  "Create a case and define the operational context",
  "Follow guided stages with tools, prompts, and visual aids",
  "Build actions, monitor progress, and sustain results",
];

const audiences = [
  "Industrial engineers",
  "Operations managers",
  "Continuous improvement teams",
  "Quality professionals",
  "Service and healthcare operations teams",
  "Transformation and project leaders",
];

export default function Home() {
  return (
    <div className="space-y-20 pb-16">
      <section className="page-section">
        <div className="container">
          <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
            <div>
              <p className="text-sm font-medium text-slate-500">
                LeanOps
              </p>
              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                Operational excellence, Lean thinking, and practical problem solving.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                LeanOps helps professionals learn, structure, analyze, and execute improvement work across manufacturing, services, healthcare, and transformation environments.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="h-11 rounded-xl px-5">
                  <Link to="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 px-5">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  Structured cases
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  Lean toolkits
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  Save and resume
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5">
                  Project-linked work
                </span>
              </div>
            </div>

            <div className="surface-card-strong p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">LeanOps Workspace</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">
                      From problem to sustainment
                    </p>
                  </div>
                  <Activity className="h-6 w-6 text-slate-500" />
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    "Clarify the issue",
                    "Analyze root causes",
                    "Build countermeasures",
                    "Track execution",
                    "Standardize results",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-900">
                          {item}
                        </span>
                      </div>
                      <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-500">Built for practical use</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    LeanOps combines knowledge, toolkits, case guidance, and execution follow-up in one clean workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="mb-8">
            <h2 className="section-title">What LeanOps helps you do</h2>
            <p className="page-subtitle mt-2 max-w-2xl">
              A practical operational excellence platform, not just a learning library.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="surface-card p-5">
                <div className="rounded-xl bg-slate-100 p-3 w-fit">
                  <feature.icon className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="surface-card p-6">
              <h2 className="section-title">How it works</h2>
              <div className="mt-6 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="section-title">Who it’s for</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {audiences.map((audience) => (
                  <div
                    key={audience}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    {audience}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-medium text-slate-900">
                    Practical philosophy
                  </p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  LeanOps is designed to turn Lean and operational excellence into guided action, not just theory.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="surface-card-strong p-8 text-center">
            <p className="text-sm font-medium text-slate-500">Ready to start?</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Build cleaner problem-solving and improvement workflows.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Start a case, open a toolkit, and structure improvement work with clarity.
            </p>

            <div className="mt-8 flex justify-center gap-3">
              <Button asChild className="h-11 rounded-xl px-5">
                <Link to="/auth/signup">Create your account</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-xl border-slate-200 px-5">
                <Link to="/contact">Contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}