import { Outlet, Link, useLocation } from "react-router-dom";
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
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Wrench,
  FolderKanban,
  ListChecks,
  ClipboardCheck,
  Star,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AppTopbar from "@/components/layout/AppTopbar";
import AppSidebarBrand from "@/components/layout/AppSidebarBrand";

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
  const { state } = useSidebar();
  const { role } = useAuth();
  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/10 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]"
    >
      <SidebarContent className="bg-[hsl(var(--sidebar-background))]">
        <AppSidebarBrand collapsed={collapsed} />

        <div className="px-3 pt-3">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Main
            </SidebarGroupLabel>

            <SidebarGroupContent className="mt-2">
              <SidebarMenu className="space-y-1.5">
                {mainNav.map((item) => {
                  const active =
                    item.url === "/app"
                      ? location.pathname === "/app"
                      : location.pathname.startsWith(item.url);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={collapsed ? item.title : undefined}
                        className={`h-11 rounded-2xl px-3 text-sm font-medium transition ${
                          active
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {(role === "admin" || role === "super_admin") && (
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Admin
              </SidebarGroupLabel>

              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname.startsWith("/admin")}
                      tooltip={collapsed ? "Admin Panel" : undefined}
                      className={`h-11 rounded-2xl px-3 text-sm font-medium transition ${
                        location.pathname.startsWith("/admin")
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Link to="/admin" className="flex items-center gap-3">
                        <Shield className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>Admin Panel</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </div>

        {!collapsed && (
          <div className="mt-auto px-4 pb-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs leading-5 text-slate-300">
                Built for practical Lean, structured problem solving, and operational excellence.
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                Developed by Saad AHIZOUN
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-[hsl(var(--background))]">
        <div className="flex min-h-screen w-full">
          <AppSidebarContent />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur">
              <div className="mx-auto w-full max-w-7xl">
                <AppTopbar />
              </div>
            </div>

            <main className="flex-1 overflow-auto">
              <div className="mx-auto w-full max-w-7xl p-6 md:p-8">
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