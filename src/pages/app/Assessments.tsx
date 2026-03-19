import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, ArrowRight } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  EmptyState,
  LoadingState,
  PageHeader,
  PageShell,
  SectionHeader,
  StatCard,
} from "@/components/ui/page";

export default function Assessments() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("assessments")
      .select("*")
      .eq("published", true)
      .order("title")
      .then(({ data }) => {
        setAssessments(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Assessments"
        title="Operational maturity self-assessments"
        description="Use guided assessments to evaluate current maturity, identify gaps, and create clearer next-step priorities."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Published assessments" value={assessments.length} icon={ClipboardCheck} />
          <StatCard label="Purpose" value="Maturity" hint="Evaluate current operational capability" />
          <StatCard label="Format" value="Self-guided" hint="Fast structured scoring" />
        </div>
      </PageHeader>

      {loading ? (
        <LoadingState />
      ) : assessments.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No assessments available"
          description="Publish assessments to give teams a clearer maturity baseline and improvement starting point."
        />
      ) : (
        <div className="space-y-4">
          <SectionHeader
            eyebrow="Library"
            title="Available assessments"
            description="Each assessment is presented as a clean entry point so teams can quickly choose the right evaluation."
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {assessments.map((assessment) => (
              <Link key={assessment.id} to={`/app/assessments/${assessment.id}`}>
                <Card className="h-full cursor-pointer transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(15,23,42,0.1)]">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-xl bg-slate-100 p-2.5">
                        <ClipboardCheck className="h-5 w-5 text-slate-700" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-950">
                      {assessment.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {assessment.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
