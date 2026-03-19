import type { ReactNode } from "react";

import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles, Workflow } from "lucide-react";

import logo from "@/assets/logo-leanops.png";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

const highlights = [
  {
    icon: Workflow,
    title: "Structured execution",
    description: "Guide teams from problem intake to sustained follow-up with clearer workflow scaffolding.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-ready polish",
    description: "A more trustworthy interface with cleaner hierarchy, stronger surfaces, and calmer visual rhythm.",
  },
];

export default function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,252,0.96))] px-4 py-6 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_40%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.1),transparent_18%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/75 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.12)] ring-1 ring-slate-950/5 backdrop-blur lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden border-r border-white/60 bg-slate-950 p-10 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_28%)]" />
          <div className="relative flex h-full flex-col">
            <Link to="/" className="inline-flex w-fit items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg">
                <img src={logo} alt="LeanOps" className="h-7 w-7 object-contain" />
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white">LeanOps</p>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-100/70">Operational Excellence</p>
              </div>
            </Link>

            <div className="mt-16 max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100">
                <Sparkles className="h-4 w-4" />
                Premium operations workspace
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white">
                Work that feels organized before the first click.
              </h1>
              <p className="mt-5 text-base leading-7 text-slate-300">
                LeanOps combines structured improvement workflows with a calmer, sharper interface built for real teams.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                      <item.icon className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <div className="flex items-center gap-2 text-white">
                <ArrowRight className="h-4 w-4 text-cyan-200" />
                Built for manufacturing, services, healthcare, and transformation teams.
              </div>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <Link to="/" className="inline-flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-slate-950/5">
                  <img src={logo} alt="LeanOps" className="h-7 w-7 object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold tracking-tight text-slate-950">LeanOps</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Operational Excellence</p>
                </div>
              </Link>
              <p className="mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-primary/70">
                Secure access
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
            </div>

            <div className="surface-card p-6 md:p-7">{children}</div>
            {footer ? <div className="mt-5 text-center text-sm text-slate-500">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
