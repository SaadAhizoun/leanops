import { useNavigate, useLocation } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Plus, Search, Sparkles } from "lucide-react";
import UserMenu from "./UserMenu";

function getPageTitle(pathname: string) {
  if (pathname === "/app") return "Dashboard";
  if (pathname.startsWith("/app/problems/new")) return "New Case";
  if (pathname.startsWith("/app/problems/")) return "Case Workspace";
  if (pathname.startsWith("/app/problems")) return "Problem Solving";
  if (pathname.startsWith("/app/my-work")) return "My Work";
  if (pathname.startsWith("/app/knowledge")) return "Knowledge Hub";
  if (pathname.startsWith("/app/toolkits")) return "Toolkits";
  if (pathname.startsWith("/app/projects")) return "Projects";
  if (pathname.startsWith("/app/action-plans")) return "Action Plans";
  if (pathname.startsWith("/app/assessments")) return "Assessments";
  if (pathname.startsWith("/app/favorites")) return "Favorites";
  if (pathname.startsWith("/app/notifications")) return "Notifications";
  if (pathname.startsWith("/app/profile")) return "Profile";
  if (pathname.startsWith("/app/settings")) return "Settings";
  if (pathname.startsWith("/admin")) return "Admin";
  return "LeanOps";
}

function getPageSubtitle(pathname: string) {
  if (pathname === "/app") return "Your operational excellence workspace";
  if (pathname.startsWith("/app/problems")) return "Structure and track improvement work";
  if (pathname.startsWith("/app/knowledge")) return "Lean, OpEx, and practical problem solving";
  if (pathname.startsWith("/app/projects")) return "Projects, milestones, and execution";
  if (pathname.startsWith("/app/action-plans")) return "Execution, follow-up, and action control";
  if (pathname.startsWith("/admin")) return "Users, content, and governance";
  return "Built for practical operations";
}

export default function AppTopbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex min-h-[74px] items-center justify-between gap-4 px-6 md:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <SidebarTrigger className="h-4 w-4 text-slate-700" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-[1.15rem] font-semibold tracking-tight text-slate-900 md:text-xl">
                {getPageTitle(location.pathname)}
              </h1>

              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-500 lg:inline-flex">
                LeanOps
              </span>
            </div>

            <p className="mt-0.5 hidden truncate text-sm text-slate-500 md:block">
              {getPageSubtitle(location.pathname)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-11 rounded-xl border-slate-200 bg-white px-4 shadow-sm md:inline-flex"
            onClick={() => navigate("/app/problems/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Case
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl border border-transparent text-slate-600 hover:bg-slate-100"
            onClick={() => navigate("/app/knowledge")}
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl border border-transparent text-slate-600 hover:bg-slate-100"
            onClick={() => navigate("/app/notifications")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-slate-900" />
          </Button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
            <Sparkles className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-600">
              Practical Lean workspace
            </span>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}