import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Product } from "@/data/mockData";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";

export function FeaturedProducts() {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_featured", true)
        .limit(6);

      if (error) throw error;

      // Transform database format to Product interface
      const products = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        name_ka: item.name_ka,
        name_en: item.name_en,
        price: item.price,
        originalPrice: item.original_price,
        category: item.category,
        categorySlug: item.category_slug,
        image: item.image,
        images: item.images,
        description: item.description,
        description_ka: item.description_ka,
        description_en: item.description_en,
        inStock: item.in_stock,
        isNew: item.is_new,
        isFeatured: item.is_featured,
      }));

      setFeaturedProducts(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-10 sm:py-16 md:py-24">
      <div className="tocasa-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <p className="tocasa-subtitle mb-2 sm:mb-3">{t("featured.tagline")}</p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">{t("featured.title")}</h2>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="gap-2 group text-sm sm:text-base p-0 sm:px-4 sm:py-2 h-auto">
              {t("featured.view_all")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="tocasa-grid">
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
