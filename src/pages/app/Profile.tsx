import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Briefcase, Mail, Shield } from "lucide-react";

export default function Profile() {
  const { user, profile, role } = useAuth();

  const initials = useMemo(() => {
    if (profile?.full_name) {
      return profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  }, [profile, user]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Profile</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Your account and identity
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Review your account details, role, and profile information used across LeanOps.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-2xl font-semibold text-white">
                {initials}
              </div>

              <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                {profile?.full_name || "LeanOps User"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {user?.email || "No email available"}
              </p>

              <div className="mt-4">
                <Badge variant="secondary" className="capitalize">
                  {role || "user"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Basic information
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Full name</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">
                    {profile?.full_name || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">
                    {user?.email || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Shield className="h-4 w-4" />
                    <span className="text-sm">Role</span>
                  </div>
                  <p className="mt-2 font-medium capitalize text-slate-900">
                    {role || "user"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Professional focus</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">
                    Lean, operational excellence, and structured problem solving
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Workspace identity
              </h3>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="h-4 w-4" />
                    <span className="text-sm">Organization</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">
                    {profile?.organization || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Sector</span>
                  </div>
                  <p className="mt-2 font-medium text-slate-900">
                    {profile?.sector || "Not set"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Bio</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {profile?.bio ||
                    "No bio added yet. This space can later be used to describe your role, expertise, and improvement focus."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}