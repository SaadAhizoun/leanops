import { useState } from "react";
import { Bell, LockKeyhole, Palette, Settings2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, SectionCard, SectionHeader } from "@/components/ui/page";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState({
    reminders: true,
    activity: true,
    announcements: true,
  });
  const [preferences, setPreferences] = useState({
    language: "English",
    theme: "System",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const savePreferences = () => {
    toast({ title: "Preferences saved", description: "Your local settings have been updated." });
  };

  const saveNotifications = () => {
    toast({ title: "Notification settings saved", description: "Your notification preferences have been updated." });
  };

  const updatePassword = () => {
    if (!passwordForm.next || passwordForm.next !== passwordForm.confirm) {
      toast({
        title: "Password update failed",
        description: "Please confirm the new password correctly.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password flow ready",
      description: "You can later connect this to Supabase password update.",
    });

    setPasswordForm({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Settings"
        title="Preferences and account controls"
        description="Manage your workspace experience, notification behavior, and account-related options with a cleaner settings layout."
      />

      <div className="settings-grid">
        <aside className="settings-nav h-fit">
          <div className="space-y-1">
            <div className="settings-nav-item settings-nav-item-active">
              <Bell className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Notifications</p>
                <p className="mt-1 text-xs text-slate-500">Reminders, activity, announcements</p>
              </div>
            </div>
            <div className="settings-nav-item settings-nav-item-idle">
              <Palette className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Workspace</p>
                <p className="mt-1 text-xs text-slate-500">Language and visual preferences</p>
              </div>
            </div>
            <div className="settings-nav-item settings-nav-item-idle">
              <LockKeyhole className="mt-0.5 h-4 w-4" />
              <div>
                <p className="text-sm font-semibold">Account Security</p>
                <p className="mt-1 text-xs text-slate-500">Password and sign-in controls</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <SectionCard as="div">
            <SectionHeader
              eyebrow="Notifications"
              title="Notification preferences"
              description="Control the operational signals that deserve your attention."
            />

            <div className="mt-6 space-y-4">
              {[
                {
                  key: "reminders" as const,
                  title: "Draft reminders",
                  description: "Remind me about inactive drafts and follow-up.",
                },
                {
                  key: "activity" as const,
                  title: "Activity signals",
                  description: "Show case and project activity updates.",
                },
                {
                  key: "announcements" as const,
                  title: "Announcements",
                  description: "Show product guidance and platform notices.",
                },
              ].map((item) => (
                <div key={item.key} className="surface-muted flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                  />
                </div>
              ))}
            </div>

            <Button className="mt-6" onClick={saveNotifications}>
              Save notification settings
            </Button>
          </SectionCard>

          <SectionCard as="div">
            <SectionHeader
              eyebrow="Workspace"
              title="Workspace preferences"
              description="Tune the local experience and keep the workspace aligned with your team."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Input
                  id="language"
                  value={preferences.language}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, language: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={preferences.theme}
                  onChange={(e) => setPreferences((prev) => ({ ...prev, theme: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-900">
                <Settings2 className="h-4 w-4" />
                <p className="text-sm font-semibold">Preference note</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                These settings are currently stored locally, but the layout is ready for profile-backed persistence later.
              </p>
            </div>

            <Button className="mt-6" onClick={savePreferences}>
              Save preferences
            </Button>
          </SectionCard>

          <SectionCard as="div">
            <SectionHeader
              eyebrow="Security"
              title="Password and account flow"
              description="A stronger alignment pattern for account security actions."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, current: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={passwordForm.next}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, next: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))}
                />
              </div>
            </div>

            <Button className="mt-6" onClick={updatePassword}>
              Update password
            </Button>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
