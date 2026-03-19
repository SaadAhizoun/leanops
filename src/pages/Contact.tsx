import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      toast({ title: "Please complete all fields", variant: "destructive" });
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
      toast({ title: "Unable to send message", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Message sent", description: "Your message has been saved successfully." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-12 pb-16">
      <section className="page-section">
        <div className="container">
          <div className="page-shell">
            <section className="page-header">
              <p className="page-eyebrow">Contact</p>
              <h1 className="page-title">Get in touch with LeanOps</h1>
              <p className="page-description">
                Use this form for questions, collaboration, product feedback, or improvement ideas related to LeanOps.
              </p>
            </section>

            <div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]">
              <section className="surface-card p-6 md:p-7">
                <form onSubmit={submit} className="space-y-5">
                  <div className="form-grid-2">
                    <div className="field-stack">
                      <Label>Name</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>

                    <div className="field-stack">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="field-stack">
                    <Label>Subject</Label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                      placeholder="What would you like to discuss?"
                    />
                  </div>

                  <div className="field-stack">
                    <Label>Message</Label>
                    <Textarea
                      rows={8}
                      value={form.message}
                      onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Write your message here..."
                    />
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send message"}
                  </Button>
                </form>
              </section>

              <div className="section-stack">
                <section className="surface-card p-6 md:p-7">
                  <p className="section-eyebrow">Why contact us</p>
                  <h2 className="section-title">Why contact LeanOps?</h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    <p>Ask product questions</p>
                    <p>Share improvement ideas</p>
                    <p>Discuss Lean and operational excellence use cases</p>
                    <p>Provide feedback on workflows, tools, and content</p>
                  </div>
                </section>

                <section className="surface-card p-6 md:p-7">
                  <p className="section-eyebrow">Direction</p>
                  <h2 className="section-title">Product direction</h2>
                  <p className="section-subtitle">
                    LeanOps is designed to keep improving as a practical platform for structured problem solving, Lean methods, and operational transformation.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
