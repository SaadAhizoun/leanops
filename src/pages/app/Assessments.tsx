import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function Assessments() {
  const [assessments, setAssessments] = useState<any[]>([]);
  useEffect(() => { supabase.from("assessments").select("*").eq("published", true).order("title").then(({ data }) => setAssessments(data || [])); }, []);
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Assessments</h1><p className="text-muted-foreground">Self-assessments to evaluate your operational maturity</p></div>
      {assessments.length === 0 ? <div className="text-center py-12 text-muted-foreground"><ClipboardCheck className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>No assessments available</p></div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{assessments.map(a => (
          <Link key={a.id} to={`/app/assessments/${a.id}`}><Card className="hover:shadow-md transition-shadow cursor-pointer h-full"><CardContent className="pt-6">
            <h3 className="font-semibold mb-1">{a.title}</h3><p className="text-sm text-muted-foreground">{a.description}</p>
          </CardContent></Card></Link>
        ))}</div>
      )}
    </div>
  );
}
