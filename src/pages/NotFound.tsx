import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="page-section">
      <div className="container">
        <div className="legal-shell text-center">
          <p className="page-eyebrow">Error</p>
          <h1 className="page-title">Page not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            The page you tried to open does not exist or may have been moved.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild>
              <Link to="/">Return home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
