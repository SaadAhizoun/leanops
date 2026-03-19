import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { User, Settings, Shield, LogOut } from "lucide-react";

export default function UserMenu() {
  const { user, profile, role, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-11 rounded-2xl border border-slate-200/80 bg-white/80 px-2.5 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),rgba(14,165,233,0.92))] text-xs font-bold text-primary-foreground shadow-sm">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-slate-900">
                {profile?.full_name || "LeanOps User"}
              </p>
              <p className="text-xs capitalize text-slate-500">{role}</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-3 py-2">
          <p className="text-sm font-semibold text-slate-950">{profile?.full_name || "LeanOps User"}</p>
          <p className="text-xs text-slate-500">{user?.email || "Workspace member"}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/app/profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => navigate("/app/settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        {(role === "admin" || role === "super_admin") && (
          <DropdownMenuItem onClick={() => navigate("/admin")}>
            <Shield className="mr-2 h-4 w-4" />
            Admin Panel
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
