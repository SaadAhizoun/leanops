import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

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
    toast({
      title: "Preferences saved",
      description: "Your local settings have been updated.",
    });
  };

  const saveNotifications = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
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
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm md:px-8">
        <p className="text-sm font-medium text-slate-500">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          Preferences and account controls
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
          Manage your local experience, notification behavior, and account-related options.
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              Notification preferences
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Draft reminders</p>
                  <p className="text-sm text-slate-500">
                    Remind me about inactive drafts and follow-up.
                  </p>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, reminders: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Activity signals</p>
                  <p className="text-sm text-slate-500">
                    Show case and project activity updates.
                  </p>
                </div>
                <Switch
                  checked={notifications.activity}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, activity: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Announcements</p>
                  <p className="text-sm text-slate-500">
                    Show product guidance and platform notices.
                  </p>
                </div>
                <Switch
                  checked={notifications.announcements}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, announcements: checked }))
                  }
                />
              </div>
            </div>

            <Button className="mt-5 rounded-xl" onClick={saveNotifications}>
              Save notification settings
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              Workspace preferences
            </h3>

            <div className="mt-5 grid gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Input
                  value={preferences.language}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, language: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Input
                  value={preferences.theme}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, theme: e.target.value }))
                  }
                />
              </div>
            </div>

            <Button className="mt-5 rounded-xl" onClick={savePreferences}>
              Save preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Password and account flow
          </h3>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Current password</Label>
              <Input
                type="password"
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, current: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>New password</Label>
              <Input
                type="password"
                value={passwordForm.next}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, next: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm password</Label>
              <Input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))
                }
              />
            </div>
          </div>

          <Button className="mt-5 rounded-xl" onClick={updatePassword}>
            Update password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}