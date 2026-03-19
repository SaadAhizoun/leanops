import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Shield } from "lucide-react";

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
    return users.filter((u) =>
      `${u.full_name || ""} ${u.organization || ""} ${u.sector || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Admin Users</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          User directory
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          View user profiles, organizations, and workspace participation details.
        </p>

        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <Users className="mx-auto mb-4 h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-900">No users found</p>
          <p className="mt-2 text-sm text-slate-500">
            Try another search term.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((user) => (
            <Card key={user.id} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {user.full_name || "Unnamed user"}
                      </h3>
                      <Badge variant="secondary">User</Badge>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>{user.organization || "No organization"}</span>
                      <span>{user.sector || "No sector"}</span>
                      <span>
                        Updated:{" "}
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-100 p-2.5">
                    <Shield className="h-5 w-5 text-slate-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}