import { Link, Outlet, useLocation } from "react-router-dom";
import {
  BookOpen,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  Search,
  Shield,
  Star,
  Wrench,
} from "lucide-react";

import AppSidebarBrand from "@/components/layout/AppSidebarBrand";
import AppTopbar from "@/components/layout/AppTopbar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

const mainNav = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard },
  { title: "Problem Solving", url: "/app/problems", icon: Search },
  { title: "My Work", url: "/app/my-work", icon: FolderKanban },
  { title: "Knowledge Hub", url: "/app/knowledge", icon: BookOpen },
  { title: "Toolkits", url: "/app/toolkits", icon: Wrench },
  { title: "Projects", url: "/app/projects", icon: FolderKanban },
  { title: "Action Plans", url: "/app/action-plans", icon: ListChecks },
  { title: "Assessments", url: "/app/assessments", icon: ClipboardCheck },
  { title: "Favorites", url: "/app/favorites", icon: Star },
];

function AppSidebarContent() {
  const location = useLocation();
  const { role } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 bg-transparent text-[hsl(var(--sidebar-foreground))] md:p-3"
    >
      <SidebarContent className="rounded-[1.9rem] border border-white/5 bg-[linear-gradient(180deg,rgba(12,19,33,0.98),rgba(15,23,42,0.94))] shadow-[0_28px_84px_rgba(2,6,23,0.36)]">
        <AppSidebarBrand collapsed={collapsed} />

        <div className="px-3 pb-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Main
            </SidebarGroupLabel>

            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1.5">
                {mainNav.map((item) => {
                  const active =
                    item.url === "/app" ? location.pathname === "/app" : location.pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={collapsed ? item.title : undefined}
                        className={
                          active
                            ? "relative h-11 rounded-2xl border border-white/80 bg-white text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.2)] before:absolute before:bottom-2 before:left-2 before:top-2 before:w-1 before:rounded-full before:bg-slate-950"
                            : "h-11 rounded-2xl border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                        }
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 transition-transform duration-200">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed ? <span>{item.title}</span> : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {role === "admin" || role === "super_admin" ? (
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Admin
              </SidebarGroupLabel>

              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith("/admin")}
                      tooltip={collapsed ? "Admin Panel" : undefined}
                      className={
                        location.pathname.startsWith("/admin")
                          ? "relative h-11 rounded-2xl border border-white/80 bg-white text-slate-950 shadow-[0_12px_24px_rgba(15,23,42,0.2)] before:absolute before:bottom-2 before:left-2 before:top-2 before:w-1 before:rounded-full before:bg-slate-950"
                          : "h-11 rounded-2xl border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                      }
                    >
                      <Link to="/admin" className="flex items-center gap-3 px-3 transition-transform duration-200">
                        <Shield className="h-4 w-4 shrink-0" />
                        {!collapsed ? <span>Admin Panel</span> : null}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}
        </div>

        {!collapsed ? (
          <div className="mt-auto px-4 pb-5">
            <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Workspace status</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Premium operational workspace for practical Lean, structured problem solving, and execution control.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-slate-500">Developed by Saad AHIZOUN</p>
            </div>
          </div>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[linear-gradient(180deg,rgba(255,255,255,0.65),rgba(248,250,252,0.96))]">
        <div className="relative flex min-h-screen">
          <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.1),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.08),transparent_18%)]" />
          <div className="absolute right-0 top-24 -z-10 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />

          <AppSidebarContent />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="sticky top-0 z-20 px-4 pt-4 md:px-6">
              <div className="app-shell">
                <AppTopbar />
              </div>
            </div>

            <main className="flex-1 overflow-auto px-4 pb-6 pt-5 md:px-6 md:pb-8">
              <div className="app-shell">
                <div className="space-y-8">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
