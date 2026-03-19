import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
    const interpretation = pct >= 80 ? "Strong maturity" : pct >= 60 ? "Good foundation, room for improvement" : pct >= 40 ? "Developing, significant gaps to address" : "Early stage, foundational work needed";
    await supabase.from("assessment_results").insert({ assessment_id: assessment.id, user_id: user.id, answers, total_score: score, max_score: maxScore, percentage: pct, interpretation } as any);
    setSubmitted(true);
    toast({ title: "Assessment saved!" });
  };

  if (!assessment) return <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Button variant="ghost" size="sm" asChild><Link to="/app/assessments"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Link></Button>
      <h1 className="text-2xl font-bold">{assessment.title}</h1>
      <p className="text-muted-foreground">{assessment.description}</p>

      {submitted ? (
        <Card><CardContent className="pt-6 text-center space-y-4">
          <div className="text-4xl font-bold text-primary">{pct}%</div>
          <p className="text-lg font-medium">{score}/{maxScore} points</p>
          <p className="text-muted-foreground">{pct >= 80 ? "Strong maturity" : pct >= 60 ? "Good foundation" : pct >= 40 ? "Developing" : "Early stage"}</p>
          <Button onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake</Button>
        </CardContent></Card>
      ) : (
        <>
          {questions.map((q, i) => (
            <Card key={q.id}><CardContent className="pt-6">
              <p className="font-medium text-sm mb-3">{i + 1}. {q.question}</p>
              <div className="flex gap-2">{[1, 2, 3, 4, 5].map(v => (
                <Button key={v} size="sm" variant={answers[q.id] === v ? "default" : "outline"} onClick={() => setAnswers({ ...answers, [q.id]: v })}>{v}</Button>
              ))}</div>
              <p className="text-xs text-muted-foreground mt-1">1 = Strongly Disagree, 5 = Strongly Agree</p>
            </CardContent></Card>
          ))}
          <Button onClick={submit} className="w-full" disabled={Object.keys(answers).length < questions.length}>Submit Assessment ({Object.keys(answers).length}/{questions.length})</Button>
        </>
      )}
    </div>
  );
}
