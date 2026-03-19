import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

export default function AdminSystem() {
  const [contacts, setContacts] = useState<any[]>([]);
  useEffect(() => { supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }).then(({ data }) => setContacts(data || [])); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System</h1>
      
      <Card><CardHeader><CardTitle>Contact Submissions</CardTitle></CardHeader><CardContent>
        {contacts.length === 0 ? <p className="text-muted-foreground text-sm">No submissions yet</p> : (
          <div className="space-y-3">{contacts.map(c => (
            <div key={c.id} className="border rounded-lg p-3">
              <div className="flex justify-between"><span className="font-medium text-sm">{c.name}</span><span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span></div>
              <p className="text-xs text-muted-foreground">{c.email} • {c.subject}</p>
              <p className="text-sm mt-1">{c.message}</p>
            </div>
          ))}</div>
        )}
      </CardContent></Card>

      <Card><CardHeader><CardTitle>Developer</CardTitle></CardHeader><CardContent>
        <div className="flex items-start gap-3">
          <Award className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold">Saad AHIZOUN</h3>
            <p className="text-sm text-muted-foreground mt-1">Industrial Engineer • Lean & Operational Excellence</p>
            <p className="text-xs text-muted-foreground mt-2">LeanOps was created by Saad AHIZOUN as a practical platform to help professionals learn, diagnose, structure, and solve operational challenges.</p>
          </div>
        </div>
      </CardContent></Card>
    </div>
  );
}
