import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t, language } = useLanguage();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      // Save order to database
      const { error } = await supabase.from("orders").insert([
        {
          order_number: orderNumber,
          customer_name: "Website Visitor", // Can be updated with actual customer info if you add a form
          customer_email: "pending@tocasa.ge",
          status: "pending",
          total: total,
          items_count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        },
      ]);

      if (error) throw error;

      // Create order message for Instagram
      const orderItems = cartItems
        .map(
          (item) =>
            `${language === "ka" ? item.product.name_ka : item.product.name_en} x${item.quantity} - ₾${
              item.product.price * item.quantity
            }`
        )
        .join("\n");

      const message = `${language === "ka" ? "შეკვეთა" : "Order"}: ${orderNumber}\n\n${orderItems}\n\n${
        language === "ka" ? "ჯამი" : "Total"
      }: ₾${total}`;

      // Redirect to Instagram DM with pre-filled message
      // Replace 'your_instagram_username' with your actual Instagram username
      const instagramUsername = "tocasa.ge"; // Change this to your Instagram username
      const encodedMessage = encodeURIComponent(message);

      // Clear cart
      clearCart();

      // Show success message
      toast.success(
        language === "ka"
          ? "შეკვეთა წარმატებით შეიქმნა! გადამისამართდებით Instagram-ზე..."
          : "Order created successfully! Redirecting to Instagram..."
      );

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = `https://ig.me/m/${instagramUsername}?text=${encodedMessage}`;
      }, 1500);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        language === "ka"
          ? "შეკვეთის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ ხელახლა."
          : "Failed to create order. Please try again."
      );
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="tocasa-container py-20">
          <div className="max-w-md mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-2xl font-medium mb-3">{t("cart.empty")}</h1>
            <p className="text-muted-foreground mb-8">
              {t("cart.start_shopping")}
            </p>
            <Link to="/products">
              <Button className="tocasa-button-primary rounded-lg gap-2">
                {t("nav.shop")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="tocasa-container py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-medium">{t("cart.title")}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1.5 sm:mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 rounded-lg border border-border bg-card"
              >
                {/* Image */}
                <Link to={`/products/${item.product.id}`} className="flex-shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-md sm:rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between gap-2 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1">
                        {item.product.category}
                      </p>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded-md sm:rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-none"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                      <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-none"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>

                    {/* Price */}
                    <span className="font-semibold text-sm sm:text-base">
                      ₾{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-4 sm:p-6 rounded-lg border border-border bg-card">
              <h2 className="font-serif text-lg sm:text-xl font-medium mb-4 sm:mb-6">{t("cart.order_summary")}</h2>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                  <span>₾{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{t("cart.shipping")}</span>
                  <span>{shipping === 0 ? t("cart.free") : `₾${shipping}`}</span>
                </div>
                {subtotal < 200 && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    დაამატე ₾{200 - subtotal} უფასო მიწოდებისთვის
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-3 sm:pt-4 mb-4 sm:mb-6">
                <div className="flex justify-between">
                  <span className="font-medium text-sm sm:text-base">{t("cart.total")}</span>
                  <span className="font-semibold text-base sm:text-lg">₾{total}</span>
                </div>
              </div>

              <Button
                className="w-full tocasa-button-primary rounded-md sm:rounded-lg gap-2 text-sm sm:text-base h-10 sm:h-12"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (language === "ka" ? "დამუშავება..." : "Processing...") : t("cart.checkout")}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                უსაფრთხო გადახდა • უფასო დაბრუნება
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
