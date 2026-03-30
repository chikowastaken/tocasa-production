import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      setIsAuthenticated(true);
      localStorage.setItem("tocasa_admin_auth", "true");
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem("tocasa_admin_auth");
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Authenticated - render the protected content
  return <Outlet />;
}
