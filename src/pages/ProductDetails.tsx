import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/mockData";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      // Fetch main product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError) throw productError;

      if (productData) {
        const prod: Product = {
          id: productData.id,
          name: productData.name,
          name_ka: productData.name_ka,
          name_en: productData.name_en,
          price: productData.price,
          originalPrice: productData.original_price,
          category: productData.category,
          categorySlug: productData.category_slug,
          image: productData.image,
          images: productData.images,
          description: productData.description,
          description_ka: productData.description_ka,
          description_en: productData.description_en,
          inStock: productData.in_stock,
          isNew: productData.is_new,
          isFeatured: productData.is_featured,
        };

        setProduct(prod);

        // Fetch related products
        const { data: relatedData } = await supabase
          .from("products")
          .select("*")
          .eq("category_slug", productData.category_slug)
          .neq("id", productId)
          .limit(4);

        if (relatedData) {
          const related = relatedData.map((item: any) => ({
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
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="tocasa-container py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="tocasa-container py-20 text-center">
          <h1 className="font-serif text-2xl font-medium mb-4">
            {language === "ka" ? "პროდუქტი ვერ მოიძებნა" : "Product not found"}
          </h1>
          <Link to="/products">
            <Button variant="outline">{t("nav.shop")}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Get product name and description in current language
  const productName = language === "ka" ? product.name_ka : product.name_en;
  const productDescription = language === "ka" ? product.description_ka : product.description_en;

  // Mock gallery images (use product.images if available)
  const images = product.images && product.images.length > 0 ? product.images : [product.image, product.image, product.image];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted overflow-hidden">
            <img src={product.image} alt="" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="font-medium">{productName}</p>
            <p className="text-sm text-muted-foreground">
              {language === "ka" ? "კალათაში დაემატა" : "Added to cart"} ({quantity})
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="tocasa-container py-6 sm:py-8">
        {/* Breadcrumb */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8"
        >
          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          {t("nav.shop")}
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={productName}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 sm:gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-16 sm:w-20 rounded-lg overflow-hidden transition-all ${
                    selectedImage === index
                      ? "ring-2 ring-primary"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title & Category */}
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-wider text-muted-foreground mb-1.5 sm:mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium mb-2 sm:mb-3">
                {productName}
              </h1>

              {/* Badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                    New
                  </span>
                )}
                {!product.inStock && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-destructive text-destructive-foreground">
                    {t("product.out_of_stock")}
                  </span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                ₾{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg sm:text-xl text-muted-foreground line-through">
                  ₾{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {productDescription}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{language === "ka" ? "რაოდენობა:" : "Quantity:"}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <span className="w-10 sm:w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:h-10 sm:w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full tocasa-button-primary gap-2"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {product.inStock ? t("product.add_to_cart") : t("product.out_of_stock")}
              </Button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 md:mt-24">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:mb-8">
              {t("product.you_may_like")}
            </h2>
            <div className="tocasa-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
