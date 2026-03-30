import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-background/70 dark:bg-background/80" />
      </div>

      {/* Content */}
      <div className="relative tocasa-container text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
          {/* Tagline */}
          <p className="text-xs sm:text-sm md:text-base uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground font-medium">
            {t("hero.tagline")}
          </p>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight">
            TOCASA
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed px-2">
            {t("hero.description")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Link to="/products" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto tocasa-button-primary rounded-full text-sm sm:text-base gap-2 group px-6 sm:px-8">
                {t("hero.shop_now")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/products?category=decor" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-sm sm:text-base px-6 sm:px-8">
                {t("hero.explore")}
              </Button>
            </Link>
          </div>

          {/* Location Badge */}
          <div className="pt-4 sm:pt-8">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse" />
              {t("hero.available")}
            </span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - hidden on mobile */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block">
        <div className="h-12 sm:h-14 w-6 sm:w-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5 sm:p-2">
          <div className="h-2 sm:h-3 w-0.5 sm:w-1 rounded-full bg-muted-foreground/50 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
