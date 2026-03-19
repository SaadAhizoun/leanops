import { Link } from "react-router-dom";

export default function PublicFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-bold text-lg mb-3">LeanOps</h3>
            <p className="text-sm text-muted-foreground">Operational Excellence, Lean Thinking, and Practical Problem Solving.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="/auth/signup" className="text-sm text-muted-foreground hover:text-foreground">Get Started</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Developer</h4>
            <p className="text-sm text-muted-foreground">Built by Saad AHIZOUN</p>
            <p className="text-xs text-muted-foreground mt-1">Industrial Engineer • Lean & Operational Excellence</p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} LeanOps. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Developed by Saad AHIZOUN</p>
        </div>
      </div>
    </footer>
  );
}
