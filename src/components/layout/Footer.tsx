import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-background">
      <div className="tocasa-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
              TOCASA
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              📍 თბილისი, საქართველო
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.all_products")}
                </Link>
              </li>
              <li>
                <Link to="/products?category=living-room" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.living_room")}
                </Link>
              </li>
              <li>
                <Link to="/products?category=bedroom" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.bedroom")}
                </Link>
              </li>
              <li>
                <Link to="/products?category=lighting" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.lighting")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">{t("footer.support")}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.contact")}
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.shipping")}
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.returns")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-medium text-sm uppercase tracking-wider mb-4">{t("footer.follow")}</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {t("newsletter.description")}
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 TOCASA. {t("footer.rights")}
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              კონფიდენციალურობა
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              პირობები
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
