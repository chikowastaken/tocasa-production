import { Link } from "react-router-dom";
import { Product } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { language } = useLanguage();

  // Get the name and description in the current language
  const productName = language === "ka" ? product.name_ka : product.name_en;

  return (
    <Link
      to={`/products/${product.id}`}
      className={cn("group block", className)}
    >
      <div className="tocasa-card">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={productName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1.5 sm:gap-2">
            {product.isNew && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-primary text-primary-foreground">New</span>
            )}
            {product.originalPrice && (
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-foreground text-background">
                Sale
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-medium uppercase tracking-wider">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-xs sm:text-sm md:text-base group-hover:text-primary transition-colors line-clamp-1">
            {productName}
          </h3>
          <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2">
            <span className="font-semibold text-sm sm:text-base">
              ₾{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-muted-foreground line-through">
                ₾{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
