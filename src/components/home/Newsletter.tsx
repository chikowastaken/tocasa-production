import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function Newsletter() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .insert([{ email }]);

      if (error) {
        // Check if email already exists
        if (error.code === "23505") {
          toast.error(t("newsletter.already_subscribed") || "You're already subscribed!");
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        setEmail("");
        toast.success(t("newsletter.success") || "Successfully subscribed!");
      }
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast.error(t("newsletter.error") || "Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="tocasa-section border-t border-border">
      <div className="tocasa-container">
        <div className="max-w-2xl mx-auto text-center">
          <p className="tocasa-subtitle mb-3">{t("newsletter.tagline")}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-4">
            {t("newsletter.title")}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t("newsletter.description")}
          </p>

          {isSubmitted ? (
            <div className="flex items-center justify-center gap-3 text-primary animate-fade-in">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="h-5 w-5" />
              </div>
              <span className="font-medium">{t("newsletter.thank_you") || "გმადლობთ გამოწერისთვის!"}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={t("newsletter.placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="tocasa-input flex-1"
                required
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="tocasa-button-primary rounded-lg gap-2 group"
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("newsletter.subscribe")}
                {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
