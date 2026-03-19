import { CheckCircle2, GraduationCap, Briefcase, Wrench } from "lucide-react";

const principles = [
  "Practical before theoretical",
  "Structured before rushed",
  "Visible before hidden",
  "Sustainable before temporary",
];

const credentials = [
  "Certified Trainer – Train the Trainers Program",
  "VDA 6.3 Process Audit Certification",
  "Agile Project Management Certificate",
  "Managing Plant Performance Certified",
  "Excellence System Certified",
  "Six Sigma Black Belt",
  "Six Sigma Green Belt",
  "Lean in Manufacturing and Services",
  "Operational Excellence in Practice",
];

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      <section className="page-section">
        <div className="container">
          <div className="surface-card-strong p-8">
            <p className="text-sm font-medium text-slate-500">About LeanOps</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              A practical platform for Lean and operational excellence.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              LeanOps exists to help professionals structure operational problems, apply the right methods, and turn improvement work into something practical, guided, and reusable.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="surface-card p-6">
              <div className="rounded-xl bg-slate-100 p-3 w-fit">
                <Wrench className="h-5 w-5 text-slate-700" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                What it is
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                LeanOps combines structured case work, toolkits, knowledge content, and execution tracking in one operational platform.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="rounded-xl bg-slate-100 p-3 w-fit">
                <Briefcase className="h-5 w-5 text-slate-700" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                Why it exists
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Too often, Lean and operational excellence stay fragmented across slides, notes, and disconnected templates. LeanOps brings them into a single guided workspace.
              </p>
            </div>

            <div className="surface-card p-6">
              <div className="rounded-xl bg-slate-100 p-3 w-fit">
                <GraduationCap className="h-5 w-5 text-slate-700" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                How it helps
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                It helps users learn methods, structure cases, apply tools, track projects, and keep improvement efforts visible and actionable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="surface-card p-6">
              <h2 className="section-title">Practical philosophy</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                LeanOps is built around one belief: operational excellence should be understandable, guided, and usable in real work. The goal is not to collect concepts. The goal is to move from complexity to clarity, then from clarity to execution.
              </p>

              <div className="mt-6 space-y-3">
                {principles.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <p className="text-sm font-medium text-slate-500">About the developer</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                Saad AHIZOUN
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Saad AHIZOUN is an Industrial Engineer focused on Lean, operational excellence, industrial performance, and transformation. He has built hands-on experience across production, plant performance, digital transformation, and continuous improvement through roles in companies such as COFICAB, Fujikura Automotive Morocco, FORVIA Faurecia, Mondelēz International, and OCP.
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                His background includes leading Lean and Hoshin initiatives, deploying excellence systems, improving KPIs, supporting industrialization, structuring action plans, training teams, and driving cost and process performance improvements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="surface-card p-6">
            <h2 className="section-title">Credential highlights</h2>
            <p className="page-subtitle mt-2">
              A curated shortlist of relevant credentials.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {credentials.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}