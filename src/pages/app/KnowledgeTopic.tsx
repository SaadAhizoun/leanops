import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, BookOpen, Wrench, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingState, PageHeader, PageShell, SectionHeader } from "@/components/ui/page";
import { useToast } from "@/hooks/use-toast";

type Topic = {
  id: string;
  slug: string;
  title: string;
  overview: string | null;
  why_it_matters: string | null;
  when_to_use: string | null;
  step_by_step: string | null;
  common_mistakes: string | null;
  practical_examples: string | null;
  related_tools: string | null;
  checklist: string | null;
};

export default function KnowledgeTopic() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { toast } = useToast();

  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopic() {
      setLoading(true);

      const { data } = await supabase
        .from("knowledge_topics")
        .select("*")
        .eq("slug", slug)
        .single();

      setTopic((data as Topic) || null);
      setLoading(false);
    }

    void loadTopic();
  }, [slug]);

  const handleFavorite = async () => {
    if (!user || !topic) return;

    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        item_type: "knowledge_topic",
        item_id: topic.id,
      } as never);

    if ((error as any)?.code === "23505") {
      toast({ title: "Already in favorites" });
    } else if (error) {
      toast({
        title: "Unable to favorite topic",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Added to favorites" });
    }
  };

  const sections = useMemo(() => {
    if (!topic) return [];

    return [
      { title: "Overview", content: topic.overview, icon: BookOpen },
      { title: "Why It Matters", content: topic.why_it_matters, icon: CheckCircle2 },
      { title: "When to Use", content: topic.when_to_use, icon: BookOpen },
      { title: "Step-by-Step Method", content: topic.step_by_step, icon: CheckCircle2 },
      { title: "Common Mistakes", content: topic.common_mistakes, icon: BookOpen },
      { title: "Practical Examples", content: topic.practical_examples, icon: CheckCircle2 },
      { title: "Related Tools", content: topic.related_tools, icon: Wrench },
      { title: "Checklist", content: topic.checklist, icon: CheckCircle2 },
    ].filter((section) => section.content);
  }, [topic]);

  if (loading) {
    return <LoadingState />;
  }

  if (!topic) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Topic not found</p>
        <Button className="mt-4" asChild>
          <Link to="/app/knowledge">Back to knowledge hub</Link>
        </Button>
      </div>
    );
  }

  return (
    <PageShell className="max-w-5xl">
      <PageHeader
        eyebrow="Knowledge Topic"
        title={topic.title}
        description={topic.overview || "Use this topic as a practical reference during problem solving and execution work."}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/knowledge">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>

            <Button variant="outline" size="sm" onClick={handleFavorite}>
              <Star className="mr-2 h-4 w-4" />
              Favorite
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link to="/app/problems/new">Use in a case</Link>
            </Button>
          </>
        }
      />

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <SectionHeader
                eyebrow="Topic section"
                title={section.title}
                description="Structured guidance organized into focused sections for faster reading and reuse."
                className="mb-4"
              />

              <div className="mb-4 flex items-center gap-2">
                <div className="icon-tile">
                  <section.icon className="h-4 w-4 text-slate-700" />
                </div>
              </div>

              <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
