import { useMemo, useState } from "react";
import { Trash2, Archive, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PageShell, SectionCard, SectionHeader } from "@/components/ui/page";
import { useToast } from "@/hooks/use-toast";

const cleanupOptions = [
  {
    id: "archive-cases",
    title: "Archive completed cases",
    description:
      "Move completed cases into archive state for cleaner operational visibility.",
    icon: Archive,
  },
  {
    id: "cleanup-drafts",
    title: "Clean old drafts",
    description:
      "Identify and remove or archive inactive drafts that are no longer useful.",
    icon: Trash2,
  },
  {
    id: "cleanup-projects",
    title: "Review inactive projects",
    description:
      "Prepare older inactive projects for archiving and better portfolio visibility.",
    icon: Archive,
  },
  {
    id: "system-review",
    title: "System cleanup review",
    description:
      "Run a safe review process before future permanent deletion or purge actions.",
    icon: ShieldAlert,
  },
];

export default function AdminDataCleanup() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedOption = useMemo(
    () => cleanupOptions.find((o) => o.id === selected) || null,
    [selected]
  );

  const handleRun = () => {
    if (!selectedOption) return;

    toast({
      title: "Cleanup simulation ready",
      description:
        "This page is now prepared for safe cleanup workflows. Next step can connect it to real filtered archive actions.",
    });
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin Cleanup"
        title="Data cleanup center"
        description="Prepare safe archive and cleanup actions to keep LeanOps organized and maintain operational clarity."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard className="space-y-4">
          <SectionHeader
            eyebrow="Actions"
            title="Available cleanup workflows"
            description="Select a safe administrative action to review before anything is automated or made destructive."
          />

          {cleanupOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${
                selected === item.id
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-xl p-2.5 ${
                    selected === item.id ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${
                      selected === item.id ? "text-white" : "text-slate-700"
                    }`}
                  />
                </div>

                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      selected === item.id ? "text-slate-200" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </SectionCard>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Selected action
            </h2>

            {selectedOption ? (
              <>
                <p className="mt-4 font-medium text-slate-900">
                  {selectedOption.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedOption.description}
                </p>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">
                    Safe mode is recommended. First archive or review data before allowing permanent deletion.
                  </p>
                </div>

                <Button className="mt-6 rounded-xl" onClick={handleRun}>
                  Run cleanup review
                </Button>
              </>
            ) : (
              <p className="mt-4 text-sm leading-6 text-slate-500">
                Select a cleanup action from the left to review the process.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
