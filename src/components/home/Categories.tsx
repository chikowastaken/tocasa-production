import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Category } from "@/data/mockData";

export function Categories() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      // Transform database format to Category interface
      const cats = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        name_ka: item.name_ka,
        name_en: item.name_en,
        slug: item.slug,
        image: item.image,
        productCount: item.product_count,
      }));

      setCategories(cats);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 md:py-24 bg-secondary/50">
        <div className="tocasa-container">
          <div className="text-center mb-8 sm:mb-12">
            <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground font-medium mb-2 sm:mb-3">
              {t("categories.tagline")}
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">
              {t("categories.title")}
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[3/4] overflow-hidden rounded-lg bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-secondary/50">
      <div className="tocasa-container">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground font-medium mb-2 sm:mb-3">
            {t("categories.tagline")}
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">
            {t("categories.title")}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => {
            const categoryName = language === "ka" ? category.name_ka : category.name_en;

            return (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <img
                  src={category.image}
                  alt={categoryName}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-opacity group-hover:opacity-90" />

                {/* Content */}
                <div className="absolute inset-0 p-3 sm:p-4 md:p-6 flex flex-col justify-end text-background">
                  <h3 className="font-serif text-base sm:text-xl md:text-2xl font-medium mb-0.5 sm:mb-1">
                    {categoryName}
                  </h3>
                  <p className="text-xs sm:text-sm text-background/70 mb-2 sm:mb-3">
                    {category.productCount} {t("categories.products")}
                  </p>
                  <div className="flex items-center text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t("categories.explore")}</span>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
