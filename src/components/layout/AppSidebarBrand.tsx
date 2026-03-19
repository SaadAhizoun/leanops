export default function AppSidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className="px-4 py-5">
      {collapsed ? (
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img
            src="/logo.png"
            alt="LeanOps"
            className="h-6 w-6 object-contain"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              <img
                src="/logo.png"
                alt="LeanOps"
                className="h-6 w-6 object-contain"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white">
                LeanOps
              </span>
              <span className="text-xs text-slate-400">
                Operational Excellence
              </span>
            </div>
          </div>

          <div className="mt-4 h-px bg-white/10" />

          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            Practical Lean tools, structured problem solving, and execution tracking.
          </p>
        </div>
      )}
    </div>
  );
}