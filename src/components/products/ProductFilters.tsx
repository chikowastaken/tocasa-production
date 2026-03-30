import { useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface FilterValues {
  q: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

function FilterContent({
  filters,
  onChange,
  onClear,
  categories
}: {
  filters: FilterValues;
  onChange: (key: keyof FilterValues, value: string) => void;
  onClear: () => void;
  categories: Category[];
}) {
  const { t, language } = useLanguage();
  const hasActiveFilters = filters.q || filters.category || filters.minPrice || filters.maxPrice;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.search")}</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("filters.search_placeholder")}
            value={filters.q}
            onChange={(e) => onChange("q", e.target.value)}
            className="pl-10 tocasa-input"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.category")}</Label>
        <Select value={filters.category} onValueChange={(v) => onChange("category", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.all_categories")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filters.all_categories")}</SelectItem>
            {categories.map((cat) => {
              const categoryName = language === "ka" ? cat.name_ka : cat.name_en;
              return (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {categoryName}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.price_range")}</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={t("filters.min")}
            value={filters.minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="tocasa-input"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder={t("filters.max")}
            value={filters.maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="tocasa-input"
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.sort")}</Label>
        <Select value={filters.sort} onValueChange={(v) => onChange("sort", v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("filters.featured")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{t("filters.featured")}</SelectItem>
            <SelectItem value="newest">{t("filters.newest")}</SelectItem>
            <SelectItem value="price-asc">{t("filters.price_asc")}</SelectItem>
            <SelectItem value="price-desc">{t("filters.price_desc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={onClear}>
          <X className="h-4 w-4 mr-2" />
          {t("filters.clear")}
        </Button>
      )}
    </div>
  );
}

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "",
  });

  // Fetch categories from Supabase
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
    }
  };

  // Sync filters with URL on mount
  useEffect(() => {
    setFilters({
      q: searchParams.get("q") || "",
      category: searchParams.get("category") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      sort: searchParams.get("sort") || "",
    });
  }, [searchParams]);

  const updateURL = (newFilters: FilterValues) => {
    const params = new URLSearchParams();
    
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.category && newFilters.category !== "all") params.set("category", newFilters.category);
    if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
    if (newFilters.sort && newFilters.sort !== "featured") params.set("sort", newFilters.sort);
    
    setSearchParams(params);
  };

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClear = () => {
    const clearedFilters: FilterValues = {
      q: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "",
    };
    setFilters(clearedFilters);
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = [
    filters.q,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const { t } = useLanguage();

  return (
    <>
      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="font-serif text-lg font-medium mb-6">{t("filters.title")}</h2>
          <FilterContent filters={filters} onChange={handleChange} onClear={handleClear} categories={categories} />
        </div>
      </aside>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t("filters.title")}
              {activeFilterCount > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle className="font-serif">{t("filters.title")}</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent filters={filters} onChange={handleChange} onClear={handleClear} categories={categories} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
