import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-leanops.png";

export default function PublicHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="LeanOps" className="h-8" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          {user ? (
            <Button onClick={() => navigate("/app")} size="sm">Go to App</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth/login")}>Sign In</Button>
              <Button size="sm" onClick={() => navigate("/auth/signup")}>Get Started</Button>
            </div>
          )}
        </nav>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t p-4 space-y-3 bg-background">
          <Link to="/about" className="block text-sm" onClick={() => setOpen(false)}>About</Link>
          <Link to="/contact" className="block text-sm" onClick={() => setOpen(false)}>Contact</Link>
          {user ? (
            <Button className="w-full" size="sm" onClick={() => { navigate("/app"); setOpen(false); }}>Go to App</Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { navigate("/auth/login"); setOpen(false); }}>Sign In</Button>
              <Button size="sm" className="flex-1" onClick={() => { navigate("/auth/signup"); setOpen(false); }}>Get Started</Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
