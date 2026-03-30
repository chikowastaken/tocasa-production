import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ComingSoonItem {
  id: string;
  title: string;
  image: string;
}

export function ComingSoon() {
  const { t } = useLanguage();
  const [items, setItems] = useState<ComingSoonItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComingSoonItems();
  }, []);

  const fetchComingSoonItems = async () => {
    try {
      const { data, error } = await supabase
        .from("coming_soon_items")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setItems(data || []);
    } catch (error) {
      console.error("Error fetching coming soon items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || items.length === 0) {
    return null; // Don't show section if loading or no items
  }

  return (
    <section className="tocasa-section bg-secondary/50">
      <div className="tocasa-container">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="tocasa-subtitle mb-3">{t("coming_soon.tagline")}</p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium">{t("coming_soon.title")}</h2>
        </div>

        {/* Instagram Highlights Style - 2x2 Grid on mobile, 1 row on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-md md:max-w-4xl mx-auto">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Ring */}
              <div className="p-[3px] rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 mb-3">
                <div className="p-[3px] rounded-full bg-background">
                  <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs md:text-sm font-medium max-w-[100px] mx-auto truncate">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
