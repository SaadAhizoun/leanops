import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-leanops.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/app");
    }
  };

  const handleMagicLink = async () => {
    if (!email) { toast({ title: "Enter your email first", variant: "destructive" }); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + "/auth/callback" } });
    setLoading(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Check your email", description: "We sent you a magic link." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/"><img src={logo} alt="LeanOps" className="h-10 mx-auto mb-4" /></Link>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to your LeanOps account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
          </form>
          <div className="mt-4 space-y-3">
            <Button variant="outline" className="w-full" onClick={handleMagicLink} disabled={loading}>Send Magic Link</Button>
            <div className="flex justify-between text-sm">
              <Link to="/auth/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
              <Link to="/auth/signup" className="text-primary hover:underline">Create account</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-6">Built by Saad AHIZOUN</p>
        </CardContent>
      </Card>
    </div>
  );
}
