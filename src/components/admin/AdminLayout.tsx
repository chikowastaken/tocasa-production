import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();

    // Clear auth from localStorage
    localStorage.removeItem("tocasa_admin_auth");
    localStorage.removeItem("tocasa_admin_email");

    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const adminNavItems = [
    { href: "/admin/products", label: t("admin.products"), icon: Package },
    { href: "/admin/categories", label: t("admin.categories"), icon: FolderTree },
    { href: "/admin/orders", label: t("admin.orders"), icon: ShoppingCart },
    { href: "/admin/newsletter", label: "ელ.ფოსტები", icon: Mail },
    { href: "/admin/settings", label: t("admin.settings"), icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 md:px-6">
          {/* Mobile Menu Button - Left side on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="font-serif text-base sm:text-lg md:text-xl font-semibold truncate">
            TOCASA Admin
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu - Outside header for proper stacking */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
      )}
      
      <div
        className={cn(
          "fixed top-14 sm:top-16 left-0 right-0 z-40 md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border bg-card shadow-lg",
          isMenuOpen ? "max-h-[calc(100vh-3.5rem)] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="p-3 sm:p-4 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-3 mt-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pt-14 sm:pt-16">
        <Outlet />
      </main>
    </div>
  );
}
