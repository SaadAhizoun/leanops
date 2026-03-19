import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-leanops.png";

export default function PublicHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-950/5">
            <img src={logo} alt="LeanOps" className="h-7 w-7 object-contain" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">LeanOps</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Operational Excellence</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/75 bg-white/75 px-3 py-2 shadow-sm ring-1 ring-slate-950/5 md:flex">
          <Link
            to="/about"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
          >
            Contact
          </Link>

          {user ? (
            <Button onClick={() => navigate("/app")} size="sm">
              Go to App
            </Button>
          ) : (
            <div className="flex gap-2 pl-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth/login")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth/signup")}>
                Get Started
              </Button>
            </div>
          )}
        </nav>

        <button
          className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/60 bg-background/95 p-4 md:hidden">
          <div className="space-y-2 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm">
            <Link to="/about" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block rounded-xl px-3 py-2 text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>
              Contact
            </Link>

            {user ? (
              <Button
                className="mt-2 w-full"
                size="sm"
                onClick={() => {
                  navigate("/app");
                  setOpen(false);
                }}
              >
                Go to App
              </Button>
            ) : (
              <div className="mt-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate("/auth/login");
                    setOpen(false);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    navigate("/auth/signup");
                    setOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
