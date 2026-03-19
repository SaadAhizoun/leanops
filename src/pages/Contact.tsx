import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      toast({
        title: "Please complete all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    } as never);

    setLoading(false);

    if (error) {
      toast({
        title: "Unable to send message",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Message sent",
      description: "Your message has been saved successfully.",
    });

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="space-y-12 pb-16">
      <section className="page-section">
        <div className="container">
          <div className="surface-card-strong p-8">
            <p className="text-sm font-medium text-slate-500">Contact</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Get in touch with LeanOps
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Use this form for questions, collaboration, product feedback, or improvement ideas related to LeanOps.
            </p>
          </div>
        </div>
      </section>

      <section className="page-section pt-0">
        <div className="container">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="Your name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Input
                      value={form.subject}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Message</Label>
                    <Textarea
                      rows={8}
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, message: e.target.value }))
                      }
                      placeholder="Write your message here..."
                    />
                  </div>

                  <Button type="submit" className="h-11 rounded-xl px-5" disabled={loading}>
                    {loading ? "Sending..." : "Send message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    Why contact LeanOps?
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    <p>Ask product questions</p>
                    <p>Share improvement ideas</p>
                    <p>Discuss Lean and operational excellence use cases</p>
                    <p>Provide feedback on workflows, tools, and content</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    Product direction
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    LeanOps is designed to keep improving as a practical platform for structured problem solving, Lean methods, and operational transformation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}