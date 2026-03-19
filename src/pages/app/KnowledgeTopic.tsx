import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, BookOpen, Wrench, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

    loadTopic();
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
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
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
    <div className="max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/app/knowledge">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
        </Button>

        <Button variant="outline" size="sm" onClick={handleFavorite}>
          <Star className="mr-1 h-4 w-4" />
          Favorite
        </Button>

        <Button variant="outline" size="sm" asChild>
          <Link to="/app/problems/new">Use in a case</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-slate-500">Knowledge Topic</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {topic.title}
          </h1>
          {topic.overview && (
            <p className="mt-3 text-base leading-7 text-slate-600">
              {topic.overview}
            </p>
          )}
        </div>
      </section>

      <div className="space-y-6">
        {sections.map((section) => (
          <Card key={section.title} className="rounded-2xl border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <section.icon className="h-4 w-4 text-slate-500" />
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  {section.title}
                </h2>
              </div>

              <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {section.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}