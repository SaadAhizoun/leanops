export default function AppSidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="px-4 py-5">
      {collapsed ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] border border-white/10 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.25)]">
          <img src="/logo.png" alt="LeanOps" className="h-7 w-7 object-contain" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
              <img src="/logo.png" alt="LeanOps" className="h-7 w-7 object-contain" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">LeanOps</span>
              <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Operational Excellence</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-300">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-sky-100/70">
              Demo-ready
            </span>
            Cleaner execution workspace
          </div>

          <div className="mt-4 h-px bg-white/10" />

          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            Practical Lean tools, structured problem solving, and sharper execution visibility.
          </p>
        </div>
      )}
    </div>
  );
}
