import { useEffect, useState } from "react";
import { Award, Inbox } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  PageShell,
  SectionCard,
  SectionHeader,
} from "@/components/ui/page";

export default function AdminSystem() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setContacts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell>
      <PageHeader
        eyebrow="System"
        title="Platform control and inbound requests"
        description="Monitor operational platform signals and review external contact submissions in a cleaner administrative structure."
      />

      <SectionCard>
        <SectionHeader
          eyebrow="Inbox"
          title="Contact submissions"
          description="Recent inbound requests are grouped here so the admin team can scan new messages quickly."
        />

        {loading ? (
          <LoadingState className="py-12" />
        ) : contacts.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No submissions yet"
            description="New contact submissions will appear here once users start sending external requests."
            className="mt-6"
          />
        ) : (
          <div className="mt-6 space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="surface-muted p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{contact.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {contact.email} | {contact.subject}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{contact.message}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="icon-tile">
              <Award className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Developer</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-950">Saad AHIZOUN</h3>
              <p className="mt-1 text-sm text-slate-500">Industrial Engineer | Lean & Operational Excellence</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                LeanOps was created as a practical platform to help professionals learn, diagnose, structure, and solve operational challenges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
