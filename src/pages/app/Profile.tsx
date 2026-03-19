import { useMemo } from "react";
import { User, Building2, Briefcase, Mail, Shield } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell, SectionCard, SectionHeader } from "@/components/ui/page";

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
    <PageShell>
      <PageHeader
        eyebrow="Profile"
        title="Your account and identity"
        description="Review the account, role, and workspace identity LeanOps uses across your experience."
      />

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
          <SectionCard>
            <SectionHeader
              eyebrow="Account"
              title="Basic information"
              description="Core account details shown in your workspace and user identity."
            />

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
          </SectionCard>

          <SectionCard>
            <SectionHeader
              eyebrow="Workspace"
              title="Workspace identity"
              description="Organization and domain information tied to your current profile."
            />

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
          </SectionCard>
        </div>
      </div>
    </PageShell>
  );
}
