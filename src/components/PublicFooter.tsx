import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="border-t border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(248,250,252,0.96))]">
      <div className="container py-14">
        <div className="surface-card-strong p-8 md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-950">LeanOps</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Operational excellence, Lean thinking, and practical problem solving in one polished workspace.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Platform</h4>
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/about" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                  About
                </Link>
                <Link to="/contact" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                  Contact
                </Link>
                <Link to="/auth/signup" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                  Get Started
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Legal</h4>
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/privacy" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-slate-600 transition-colors hover:text-slate-950">
                  Terms of Service
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Developer</h4>
              <p className="mt-4 text-sm text-slate-600">Built by Saad AHIZOUN</p>
              <p className="mt-1 text-xs text-slate-500">Industrial Engineer and Lean operational excellence practitioner.</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
            <p>Copyright {new Date().getFullYear()} LeanOps. All rights reserved.</p>
            <p>Developed by Saad AHIZOUN</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
