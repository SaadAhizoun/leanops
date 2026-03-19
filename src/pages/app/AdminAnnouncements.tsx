import { useEffect, useMemo, useState } from "react";
import { Search, Megaphone, Save, Trash2, Plus } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  EmptyState,
  FilterBar,
  LoadingState,
  PageHeader,
  PageShell,
  SectionCard,
  SectionHeader,
} from "@/components/ui/page";
import { useToast } from "@/hooks/use-toast";

type Announcement = {
  id: string;
  title: string;
  content: string;
  active: boolean;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
};

export default function AdminAnnouncements() {
  const { toast } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [newItem, setNewItem] = useState({
    title: "",
    content: "",
    active: true,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);

      const response: any = await (supabase as any)
        .from("announcements")
        .select("*")
        .order("updated_at", { ascending: false });

      setAnnouncements((response?.data ?? []) as Announcement[]);
      setLoading(false);
    }

    void load();
  }, []);

  const filtered = useMemo(() => {
    return announcements.filter((item) =>
      `${item.title} ${item.content}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [announcements, search]);

  const createAnnouncement = async () => {
    if (!newItem.title.trim() || !newItem.content.trim()) {
      toast({
        title: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const response: any = await (supabase as any)
      .from("announcements")
      .insert({
        title: newItem.title.trim(),
        content: newItem.content.trim(),
        active: newItem.active,
      })
      .select()
      .single();

    if (response?.error) {
      toast({
        title: "Unable to create announcement",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    if (response?.data) {
      setAnnouncements((prev) => [response.data as Announcement, ...prev]);
    }

    setNewItem({ title: "", content: "", active: true });

    toast({ title: "Announcement created" });
  };

  const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
    setSavingId(id);

    const response: any = await (supabase as any)
      .from("announcements")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    setSavingId(null);

    if (response?.error) {
      toast({
        title: "Unable to save announcement",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updates, updated_at: new Date().toISOString() }
          : item
      )
    );

    toast({ title: "Announcement updated" });
  };

  const deleteAnnouncement = async (id: string) => {
    const response: any = await (supabase as any)
      .from("announcements")
      .delete()
      .eq("id", id);

    if (response?.error) {
      toast({
        title: "Unable to delete announcement",
        description: response.error.message,
        variant: "destructive",
      });
      return;
    }

    setAnnouncements((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Announcement deleted" });
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin Announcements"
        title="Announcement management"
        description="Create, update, activate, and remove platform announcements shown across LeanOps."
      />

      <FilterBar>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search announcements..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
          {filtered.length} visible
        </span>
      </FilterBar>

      <SectionCard>
        <SectionHeader
          eyebrow="Create"
          title="New announcement"
          description="Use the shared input layout below to add a new platform-wide communication item."
        />

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Title</label>
            <Input
              value={newItem.title}
              onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Announcement title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-900">Content</label>
            <Textarea
              rows={4}
              value={newItem.content}
              onChange={(e) => setNewItem((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Announcement content"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant={newItem.active ? "default" : "outline"}
              onClick={() => setNewItem((prev) => ({ ...prev, active: !prev.active }))}
            >
              {newItem.active ? "Active" : "Inactive"}
            </Button>

            <Button onClick={() => void createAnnouncement()}>
              <Plus className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </div>
      </SectionCard>

      {loading ? (
        <LoadingState />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements found"
          description="Create your first announcement or adjust the search to reveal existing communication items."
        />
      ) : (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Library"
            title="Published and draft announcements"
            description="Each item is grouped into a cleaner editor card so review and updates are easier to scan."
          />

          {filtered.map((item) => (
            <Card key={item.id} className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-4 w-4 text-slate-500" />
                    <Badge variant={item.active ? "secondary" : "outline"}>
                      {item.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void deleteAnnouncement(item.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>

                <Input
                  value={item.title}
                  onChange={(e) =>
                    setAnnouncements((prev) =>
                      prev.map((a) =>
                        a.id === item.id ? { ...a, title: e.target.value } : a
                      )
                    )
                  }
                />

                <Textarea
                  rows={4}
                  value={item.content}
                  onChange={(e) =>
                    setAnnouncements((prev) =>
                      prev.map((a) =>
                        a.id === item.id ? { ...a, content: e.target.value } : a
                      )
                    )
                  }
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button
                    variant={item.active ? "default" : "outline"}
                    onClick={() =>
                      setAnnouncements((prev) =>
                        prev.map((a) =>
                          a.id === item.id ? { ...a, active: !a.active } : a
                        )
                      )
                    }
                  >
                    {item.active ? "Active" : "Inactive"}
                  </Button>

                  <Button
                    onClick={() =>
                      void updateAnnouncement(item.id, {
                        title: item.title,
                        content: item.content,
                        active: item.active,
                      })
                    }
                    disabled={savingId === item.id}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {savingId === item.id ? "Saving..." : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
