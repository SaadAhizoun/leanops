import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ClipboardCheck, LineChart } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState, PageHeader, PageShell, SectionCard, SectionHeader } from "@/components/ui/page";
import { useToast } from "@/hooks/use-toast";

export default function AssessmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.from("assessments").select("*").eq("id", id).single().then(({ data }) => setAssessment(data));
    supabase.from("assessment_questions").select("*").eq("assessment_id", id).order("sort_order").then(({ data }) => setQuestions(data || []));
  }, [id]);

  const score = Object.values(answers).reduce((a, b) => a + b, 0);
  const maxScore = questions.length * 5;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  const submit = async () => {
    if (!user || !assessment) return;
    const interpretation =
      pct >= 80
        ? "Strong maturity"
        : pct >= 60
          ? "Good foundation, room for improvement"
          : pct >= 40
            ? "Developing, significant gaps to address"
            : "Early stage, foundational work needed";
    await supabase.from("assessment_results").insert({
      assessment_id: assessment.id,
      user_id: user.id,
      answers,
      total_score: score,
      max_score: maxScore,
      percentage: pct,
      interpretation,
    } as any);
    setSubmitted(true);
    toast({ title: "Assessment saved!" });
  };

  if (!assessment) return <LoadingState />;

  return (
    <PageShell className="max-w-5xl">
      <PageHeader
        eyebrow="Assessment"
        title={assessment.title}
        description={assessment.description}
        actions={
          <Button variant="outline" asChild>
            <Link to="/app/assessments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to assessments
            </Link>
          </Button>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="metric-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Questions</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{questions.length}</p>
              </div>
              <div className="icon-tile">
                <ClipboardCheck className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Progress</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  {Object.keys(answers).length}/{questions.length}
                </p>
              </div>
              <div className="icon-tile">
                <LineChart className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-slate-500">Scale</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">1-5</p>
              </div>
              <div className="icon-tile">
                <CheckCircle2 className="h-5 w-5 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </PageHeader>

      {submitted ? (
        <SectionCard className="text-center">
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-semibold text-white">
              {pct}%
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-950">{score}/{maxScore} points</p>
              <p className="mt-2 text-sm text-slate-500">
                {pct >= 80 ? "Strong maturity" : pct >= 60 ? "Good foundation" : pct >= 40 ? "Developing" : "Early stage"}
              </p>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake</Button>
            </div>
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-6">
          <SectionCard>
            <SectionHeader
              eyebrow="Instructions"
              title="Score each statement"
              description="Answer every prompt using the 1 to 5 scale. This structure keeps the assessment easy to scan and complete."
            />
            <p className="mt-4 text-sm text-slate-500">1 = Strongly Disagree, 5 = Strongly Agree</p>
          </SectionCard>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <Card key={q.id}>
                <CardContent className="p-6">
                  <p className="mb-4 text-sm font-semibold text-slate-950">
                    {i + 1}. {q.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <Button
                        key={v}
                        size="sm"
                        variant={answers[q.id] === v ? "default" : "outline"}
                        onClick={() => setAnswers({ ...answers, [q.id]: v })}
                      >
                        {v}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button onClick={submit} className="w-full" disabled={Object.keys(answers).length < questions.length}>
            Submit Assessment ({Object.keys(answers).length}/{questions.length})
          </Button>
        </div>
      )}
    </PageShell>
  );
}
