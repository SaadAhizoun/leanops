import { Briefcase, CheckCircle2, GraduationCap, Wrench } from "lucide-react";

const principles = [
  "Practical before theoretical",
  "Structured before rushed",
  "Visible before hidden",
  "Sustainable before temporary",
];

const credentials = [
  "Certified Trainer - Train the Trainers Program",
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
          <div className="page-shell">
            <section className="page-header">
              <p className="page-eyebrow">About LeanOps</p>
              <h1 className="page-title">A practical platform for Lean and operational excellence.</h1>
              <p className="page-description">
                LeanOps exists to help professionals structure operational problems, apply the right methods, and turn improvement work into something practical, guided, and reusable.
              </p>
            </section>

            <div className="cards-grid-3">
              {[
                {
                  icon: Wrench,
                  title: "What it is",
                  body: "LeanOps combines structured case work, toolkits, knowledge content, and execution tracking in one operational platform.",
                },
                {
                  icon: Briefcase,
                  title: "Why it exists",
                  body: "Too often, Lean and operational excellence stay fragmented across slides, notes, and disconnected templates. LeanOps brings them into a single guided workspace.",
                },
                {
                  icon: GraduationCap,
                  title: "How it helps",
                  body: "It helps users learn methods, structure cases, apply tools, track projects, and keep improvement efforts visible and actionable.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-card p-6 md:p-7">
                  <div className="icon-tile">
                    <item.icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <h2 className="section-title">{item.title}</h2>
                  <p className="section-subtitle">{item.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="surface-card p-6 md:p-7">
                <p className="section-eyebrow">Principles</p>
                <h2 className="section-title">Practical philosophy</h2>
                <p className="section-subtitle">
                  LeanOps is built around one belief: operational excellence should be understandable, guided, and usable in real work.
                </p>

                <div className="mt-6 space-y-3">
                  {principles.map((item) => (
                    <div key={item} className="surface-muted flex items-center gap-3 px-4 py-3">
                      <CheckCircle2 className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="surface-card p-6 md:p-7">
                <p className="section-eyebrow">Developer</p>
                <h2 className="section-title">Saad AHIZOUN</h2>
                <p className="section-subtitle">
                  Saad AHIZOUN is an Industrial Engineer focused on Lean, operational excellence, industrial performance, and transformation.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  He has built hands-on experience across production, plant performance, digital transformation, and continuous improvement through roles in companies such as COFICAB, Fujikura Automotive Morocco, FORVIA Faurecia, Mondelez International, and OCP.
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  His background includes leading Lean and Hoshin initiatives, deploying excellence systems, improving KPIs, supporting industrialization, structuring action plans, training teams, and driving cost and process performance improvements.
                </p>
              </section>
            </div>

            <section className="surface-card p-6 md:p-7">
              <p className="section-eyebrow">Credentials</p>
              <h2 className="section-title">Credential highlights</h2>
              <p className="section-subtitle">A curated shortlist of relevant credentials.</p>

              <div className="mt-6 cards-grid-3">
                {credentials.map((item) => (
                  <div key={item} className="surface-muted px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}
