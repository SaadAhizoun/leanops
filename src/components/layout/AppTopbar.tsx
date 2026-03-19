import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Plus, Search, Sparkles } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

import UserMenu from "./UserMenu";

function getPageTitle(pathname: string) {
  if (pathname === "/app") return "Dashboard";
  if (pathname.startsWith("/app/problems/new")) return "New Case";
  if (pathname.startsWith("/app/problems/")) return "Case Workspace";
  if (pathname.startsWith("/app/problems")) return "Problem Solving";
  if (pathname.startsWith("/app/my-work")) return "My Work";
  if (pathname.startsWith("/app/knowledge/")) return "Knowledge Topic";
  if (pathname.startsWith("/app/knowledge")) return "Knowledge Hub";
  if (pathname.startsWith("/app/toolkits/")) return "Toolkit Detail";
  if (pathname.startsWith("/app/toolkits")) return "Toolkits";
  if (pathname.startsWith("/app/projects/")) return "Project Detail";
  if (pathname.startsWith("/app/projects")) return "Projects";
  if (pathname.startsWith("/app/action-plans")) return "Action Plans";
  if (pathname.startsWith("/app/assessments/")) return "Assessment Detail";
  if (pathname.startsWith("/app/assessments")) return "Assessments";
  if (pathname.startsWith("/app/favorites")) return "Favorites";
  if (pathname.startsWith("/app/notifications")) return "Notifications";
  if (pathname.startsWith("/app/profile")) return "Profile";
  if (pathname.startsWith("/app/settings")) return "Settings";
  if (pathname.startsWith("/admin/users")) return "User Management";
  if (pathname.startsWith("/admin/content")) return "Content Library";
  if (pathname.startsWith("/admin/system")) return "System Control";
  if (pathname.startsWith("/admin")) return "Admin Overview";
  return "LeanOps";
}

function getPageSubtitle(pathname: string) {
  if (pathname === "/app") return "Your operational excellence workspace";
  if (pathname.startsWith("/app/problems")) return "Structure cases, investigate root causes, and keep execution moving.";
  if (pathname.startsWith("/app/my-work")) return "Resume current work with cleaner visibility across drafts and active cases.";
  if (pathname.startsWith("/app/knowledge")) return "Organized Lean and operational excellence guidance for faster learning.";
  if (pathname.startsWith("/app/projects")) return "Manage initiatives, objectives, and linked execution work.";
  if (pathname.startsWith("/app/action-plans")) return "Track owners, deadlines, and follow-up with less clutter.";
  if (pathname.startsWith("/app/settings")) return "Manage workspace preferences, notifications, and account controls.";
  if (pathname.startsWith("/admin")) return "Monitor users, content, and platform governance in one control center.";
  return "Built for practical operations";
}

const crumbLabelMap: Record<string, string> = {
  app: "Workspace",
  admin: "Admin",
  problems: "Problem Solving",
  new: "New Case",
  "my-work": "My Work",
  knowledge: "Knowledge Hub",
  toolkits: "Toolkits",
  projects: "Projects",
  "action-plans": "Action Plans",
  assessments: "Assessments",
  favorites: "Favorites",
  notifications: "Notifications",
  profile: "Profile",
  settings: "Settings",
  users: "Users",
  content: "Content",
  system: "System",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const previous = segments[index - 1];

    let label = crumbLabelMap[segment];

    if (!label) {
      if (previous === "problems") label = "Case";
      else if (previous === "projects") label = "Project";
      else if (previous === "knowledge") label = "Topic";
      else if (previous === "toolkits") label = "Toolkit";
      else if (previous === "assessments") label = "Assessment";
      else label = segment.replace(/-/g, " ");
    }

    return { href, label };
  });
}

export default function AppTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const crumbs = getBreadcrumbs(location.pathname);
  const areaLabel = location.pathname.startsWith("/admin") ? "Admin control" : "Workspace";

  return (
    <header className="overflow-hidden rounded-[1.75rem] border border-white/75 bg-white/80 shadow-[0_18px_44px_rgba(15,23,42,0.08)] ring-1 ring-slate-950/5 backdrop-blur-xl">
      <div className="flex min-h-[92px] items-center justify-between gap-4 px-5 py-4 md:px-6">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.92))] shadow-sm">
            <SidebarTrigger className="h-4 w-4 text-slate-700" />
          </div>

          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {areaLabel}
              </span>
            </div>

            <Breadcrumb>
              <BreadcrumbList className="text-xs text-slate-400">
                {crumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {index === crumbs.length - 1 ? (
                      <BreadcrumbPage className="text-slate-500">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                    {index < crumbs.length - 1 ? <BreadcrumbSeparator /> : null}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-2 flex items-center gap-2">
              <h1 className="truncate text-[1.25rem] font-semibold tracking-tight text-slate-950 md:text-[1.45rem]">
                {getPageTitle(location.pathname)}
              </h1>
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 lg:inline-flex">
                LeanOps
              </span>
            </div>

            <p className="mt-1 hidden max-w-2xl truncate text-sm text-slate-500 md:block">
              {getPageSubtitle(location.pathname)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-[1.25rem] border border-slate-200/80 bg-slate-50/90 px-2 py-2 lg:flex">
            <Button
              variant="outline"
              className="border-white bg-white shadow-sm"
              onClick={() => navigate("/app/knowledge")}
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>

            <Button onClick={() => navigate("/app/problems/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative border border-slate-200/80 bg-white/80 shadow-sm"
              onClick={() => navigate("/app/notifications")}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-900" />
            </Button>
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 xl:flex">
            <Sparkles className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-semibold text-slate-600">Practical Lean workspace</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="relative border border-slate-200/80 bg-white/80 shadow-sm lg:hidden"
            onClick={() => navigate("/app/notifications")}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white bg-slate-900" />
          </Button>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
