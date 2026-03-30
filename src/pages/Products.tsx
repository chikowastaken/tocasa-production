import { useSearchParams } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGridSkeleton } from "@/components/products/ProductSkeleton";
import { Product } from "@/data/mockData";
import { Package } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Products = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { t, language } = useLanguage();

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

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

      setAllProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query - search in both languages
    const q = searchParams.get("q");
    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_ka.toLowerCase().includes(query) ||
          p.name_en.toLowerCase().includes(query) ||
          p.description_ka.toLowerCase().includes(query) ||
          p.description_en.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    const category = searchParams.get("category");
    if (category && category !== "all") {
      result = result.filter((p) => p.categorySlug === category);
    }

    // Price filters
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice) {
      result = result.filter((p) => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= parseFloat(maxPrice));
    }

    // Sorting
    const sort = searchParams.get("sort");
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
        break;
      default:
        // Featured first
        result.sort((a, b) => (a.isFeatured ? -1 : 1) - (b.isFeatured ? -1 : 1));
    }

    return result;
  }, [searchParams, allProducts]);

  const category = searchParams.get("category");
  const categoryName = category
    ? category.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : t("products.all");

  return (
    <Layout>
      <div className="tocasa-container py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="tocasa-subtitle mb-1.5 sm:mb-2">{t("nav.shop")}</p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">{categoryName}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 sm:mt-2">
            {t("products.showing")} {filteredProducts.length} {t("products.of")} {allProducts.length}
          </p>
        </div>

        {/* Mobile Filters */}
        <div className="mb-4 sm:mb-6 lg:hidden">
          <ProductFilters />
        </div>

        {/* Main Content */}
        <div className="flex gap-6 sm:gap-8 lg:gap-12">
          {/* Desktop Filters Sidebar - hidden on mobile */}
          <div className="hidden lg:block">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2">{t("products.no_results")}</h3>
                <p className="text-muted-foreground max-w-sm">
                  {t("products.try_adjusting")}
                </p>
              </div>
            ) : (
              <div className="tocasa-grid">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
