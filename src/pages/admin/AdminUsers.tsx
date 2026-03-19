import { useEffect, useMemo, useState } from "react";
import { Search, Shield, Users } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState, FilterBar, LoadingState, PageHeader, PageShell } from "@/components/ui/page";
import { StatusBadge } from "@/components/ui/status-badge";

type UserRow = {
  id: string;
  full_name?: string | null;
  organization?: string | null;
  sector?: string | null;
  updated_at?: string | null;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, organization, sector, updated_at")
        .order("updated_at", { ascending: false });

      setUsers((data as UserRow[]) || []);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((user) =>
      `${user.full_name || ""} ${user.organization || ""} ${user.sector || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [users, search]);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin Users"
        title="User directory"
        description="View user profiles, organizations, and workspace participation details."
      />

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            className="pl-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </FilterBar>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try another search term." />
      ) : (
        <div className="section-stack">
          {filtered.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-tight text-slate-950">
                        {user.full_name || "Unnamed user"}
                      </h3>
                      <StatusBadge value="active">User</StatusBadge>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>{user.organization || "No organization"}</span>
                      <span>{user.sector || "No sector"}</span>
                      <span>
                        Updated {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>

                  <div className="icon-tile">
                    <Shield className="h-5 w-5 text-slate-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
