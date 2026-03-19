import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Search, Wrench, ClipboardCheck, BarChart3, Users } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Knowledge Hub", desc: "Comprehensive Lean and operational excellence library organized by pillar" },
  { icon: Search, title: "Problem Solving", desc: "Structured 12-stage case workflow from intake to closure" },
  { icon: Wrench, title: "Toolkits", desc: "Practical tools: 5 Why, Ishikawa, Pareto, SIPOC, VSM, and more" },
  { icon: ClipboardCheck, title: "Assessments", desc: "Lean maturity, daily management, and operational excellence self-checks" },
  { icon: BarChart3, title: "Projects & Actions", desc: "Lightweight project management with action tracking and KPIs" },
  { icon: Users, title: "Team Collaboration", desc: "Share cases, assign actions, and track progress across teams" },
];

const steps = [
  { num: "01", title: "Learn", desc: "Explore the Knowledge Hub to understand Lean principles and methods" },
  { num: "02", title: "Diagnose", desc: "Choose a real problem and start a structured problem-solving case" },
  { num: "03", title: "Solve", desc: "Follow guided stages with recommended tools and practical prompts" },
  { num: "04", title: "Sustain", desc: "Standardize solutions, track actions, and build operational discipline" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container text-center max-w-4xl">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Operational Excellence Platform
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Turn Lean Thinking into <span className="text-primary">Practical Action</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            LeanOps helps professionals learn, diagnose, structure, and solve operational challenges using Lean thinking and operational excellence principles.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="lg" asChild><Link to="/auth/signup">Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/about">Learn More</Link></Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">Everything You Need for Operational Excellence</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A complete platform combining knowledge, structured problem solving, practical tools, and project management.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-card rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold mb-3">How LeanOps Works</h2>
            <p className="text-muted-foreground">From learning to sustained improvement in four steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="text-4xl font-bold text-primary/20 mb-2">{s.num}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 bg-muted/30">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Built for Real Operations</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Designed for teams in manufacturing, services, healthcare, and transformation programs.</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {["Manufacturing", "Automotive", "Food & Beverage", "Healthcare", "Services", "Logistics", "Mining & Resources"].map((s) => (
              <span key={s} className="px-4 py-2 rounded-full border bg-card">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container text-center max-w-2xl">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Start Solving?</h2>
          <p className="text-muted-foreground mb-8">Join LeanOps and bring structure to your operational challenges.</p>
          <Button size="lg" asChild><Link to="/auth/signup">Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </section>
    </div>
  );
}
