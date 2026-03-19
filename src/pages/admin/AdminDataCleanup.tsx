import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Archive, ShieldAlert } from "lucide-react";
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
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Admin Cleanup</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Data cleanup center
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Prepare safe archive and cleanup actions to keep LeanOps organized and maintain operational clarity.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cleanupOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`w-full text-left rounded-2xl border p-5 transition ${
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
        </div>

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
    </div>
  );
}