import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "ka" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ka: {
    // Header
    "nav.home": "მთავარი",
    "nav.shop": "მაღაზია",
    "nav.living_room": "მისაღები",
    "nav.bedroom": "საძინებელი",
    "nav.lighting": "განათება",
    "nav.admin": "ადმინ პანელი",
    
    // Hero
    "hero.tagline": "ინტერიერის დიზაინი და სახლის ინსპირაცია",
    "hero.description": "უნიკალური, ლიმიტირებული აქსესუარები ხელმისაწვდომ ფასად. ყველაფერი ხელმისაწვდომია აქ, თბილისში.",
    "hero.shop_now": "იყიდე ახლა",
    "hero.explore": "კოლექციების ნახვა",
    "hero.available": "ხელმისაწვდომია თბილისში",
    
    // Categories
    "categories.tagline": "კურირებული კოლექციები",
    "categories.title": "იყიდე ოთახის მიხედვით",
    "categories.explore": "ნახვა",
    "categories.products": "პროდუქტი",
    
    // Featured
    "featured.tagline": "ჩვენი არჩევანი",
    "featured.title": "გამორჩეული პროდუქტები",
    "featured.view_all": "ყველას ნახვა",
    
    // Coming Soon
    "coming_soon.tagline": "მალე",
    "coming_soon.title": "ახალი კოლექციები მოდის",
    "coming_soon.notify": "შემატყობინე",
    
    // Newsletter
    "newsletter.tagline": "იყავი განახლებული",
    "newsletter.title": "გამოიწერე სიახლეები",
    "newsletter.description": "მიიღე ექსკლუზიური წვდომა ახალ კოლექციებზე, სპეციალურ შეთავაზებებზე და ინტერიერის ინსპირაციაზე.",
    "newsletter.placeholder": "შეიყვანე ელ-ფოსტა",
    "newsletter.subscribe": "გამოწერა",
    "newsletter.privacy": "გამოწერით თქვენ ეთანხმებით ჩვენს კონფიდენციალურობის პოლიტიკას.",
    
    // Products Page
    "products.title": "პროდუქტები",
    "products.all": "ყველა პროდუქტი",
    "products.showing": "ნაჩვენებია",
    "products.of": "-დან",
    "products.no_results": "პროდუქტები ვერ მოიძებნა",
    "products.try_adjusting": "სცადე ფილტრების შეცვლა",
    "products.clear_filters": "ფილტრების გასუფთავება",
    
    // Filters
    "filters.title": "ფილტრები",
    "filters.search": "ძებნა",
    "filters.search_placeholder": "პროდუქტების ძებნა...",
    "filters.category": "კატეგორია",
    "filters.all_categories": "ყველა კატეგორია",
    "filters.price_range": "ფასის დიაპაზონი",
    "filters.min": "მინ",
    "filters.max": "მაქს",
    "filters.sort": "სორტირება",
    "filters.featured": "გამორჩეული",
    "filters.newest": "უახლესი",
    "filters.price_asc": "ფასი: დაბლიდან მაღლა",
    "filters.price_desc": "ფასი: მაღლიდან დაბლა",
    "filters.clear": "ფილტრების გასუფთავება",
    
    // Product Details
    "product.add_to_cart": "კალათაში დამატება",
    "product.in_stock": "მარაგშია",
    "product.out_of_stock": "არ არის მარაგში",
    "product.you_may_like": "შეიძლება მოგეწონოს",
    "product.description": "აღწერა",
    "product.details": "დეტალები",
    
    // Cart
    "cart.title": "შენი კალათა",
    "cart.empty": "შენი კალათა ცარიელია",
    "cart.start_shopping": "იყიდე ახლა",
    "cart.continue": "განაგრძე შოპინგი",
    "cart.order_summary": "შეკვეთის შეჯამება",
    "cart.subtotal": "ჯამი",
    "cart.shipping": "მიწოდება",
    "cart.free": "უფასო",
    "cart.total": "სულ",
    "cart.checkout": "გადახდა",
    "cart.remove": "წაშლა",
    
    // Footer
    "footer.tagline": "უნიკალური სახლის დეკორი და ინტერიერის აქსესუარები, ხელმისაწვდომი თბილისში.",
    "footer.shop": "მაღაზია",
    "footer.all_products": "ყველა პროდუქტი",
    "footer.new_arrivals": "ახალი",
    "footer.best_sellers": "ბესტსელერები",
    "footer.on_sale": "ფასდაკლება",
    "footer.support": "დახმარება",
    "footer.contact": "კონტაქტი",
    "footer.shipping": "მიწოდება",
    "footer.returns": "დაბრუნება",
    "footer.faq": "FAQ",
    "footer.follow": "გამოგვყევი",
    "footer.rights": "ყველა უფლება დაცულია.",
    
    // Admin
    "admin.dashboard": "დაშბორდი",
    "admin.products": "პროდუქტები",
    "admin.categories": "კატეგორიები",
    "admin.orders": "შეკვეთები",
    "admin.settings": "პარამეტრები",
    "admin.back_to_store": "მაღაზიაში დაბრუნება",
    
    // Reviews
    "reviews.tagline": "მომხმარებლების შეფასება",
    "reviews.title": "რას ამბობენ ჩვენი მომხმარებლები",

    // FAQ
    "faq.tagline": "ხშირად დასმული კითხვები",
    "faq.title": "გაქვთ შეკითხვა?",
    "faq.q1": "როგორ შემიძლია შეკვეთის გაფორმება?",
    "faq.a1": "აირჩიეთ სასურველი პროდუქტი, დაამატეთ კალათაში და გააფორმეთ შეკვეთა. მიწოდება ხორციელდება თბილისის მასშტაბით 1-2 სამუშაო დღეში.",
    "faq.q2": "რა ღირს მიწოდება?",
    "faq.a2": "100 ლარზე მეტი შეკვეთისას მიწოდება უფასოა თბილისის მასშტაბით. სტანდარტული მიწოდების ღირებულება 10 ლარია.",
    "faq.q3": "შესაძლებელია პროდუქტის დაბრუნება?",
    "faq.a3": "დიახ, პროდუქტის დაბრუნება შესაძლებელია შეძენიდან 14 დღის განმავლობაში, იმ პირობით რომ პროდუქტი არის ორიგინალ შეფუთვაში და არ არის გამოყენებული.",
    "faq.q4": "რა გადახდის მეთოდებს იღებთ?",
    "faq.a4": "ვიღებთ გადახდას ბარათით და ნაღდი ანგარიშსწორებით მიწოდებისას. ყველა ფასი მოცემულია ლარებში და მოიცავს დღგ-ს.",
    "faq.q5": "როგორ დაგიკავშირდეთ?",
    "faq.a5": "შეგიძლიათ დაგვიკავშირდეთ ელ-ფოსტით info@tocasa.ge ან ტელეფონით +995 555 123 456. სამუშაო საათები: ორშ-შაბ 10:00-19:00.",

    // Contact
    "contact.title": "კონტაქტი",
    "contact.description": "გაქვთ შეკითხვა? დაგვიკავშირდით და სიამოვნებით დაგეხმარებით.",
    "contact.email": "ელ-ფოსტა",
    "contact.phone": "ტელეფონი",
    "contact.address": "მისამართი",
    "contact.hours": "სამუშაო საათები",
    "contact.hours_detail": "ორშ - შაბ: 10:00 - 19:00",

    // Shipping
    "shipping.title": "მიწოდება",
    "shipping.delivery_title": "მიწოდების დრო",
    "shipping.delivery_text": "თბილისის მასშტაბით მიწოდება ხორციელდება 1-2 სამუშაო დღეში. რეგიონებში მიწოდება 3-5 სამუშაო დღეში.",
    "shipping.cost_title": "მიწოდების ღირებულება",
    "shipping.cost_text": "100 ლარზე მეტი შეკვეთისას მიწოდება უფასოა თბილისის მასშტაბით. სტანდარტული მიწოდების ღირებულება 10 ლარია.",
    "shipping.tracking_title": "შეკვეთის თვალყურის დევნება",
    "shipping.tracking_text": "შეკვეთის გაფორმების შემდეგ მიიღებთ SMS შეტყობინებას თვალყურის დევნების კოდით.",

    // Returns
    "returns.title": "დაბრუნება",
    "returns.policy_title": "დაბრუნების პოლიტიკა",
    "returns.policy_text": "პროდუქტის დაბრუნება შესაძლებელია შეძენიდან 14 დღის განმავლობაში, იმ პირობით რომ პროდუქტი არის ორიგინალ შეფუთვაში და არ არის გამოყენებული.",
    "returns.process_title": "დაბრუნების პროცესი",
    "returns.process_text": "დაბრუნებისთვის დაგვიკავშირდით ელ-ფოსტით ან ტელეფონით. ჩვენი გუნდი დაგეხმარებათ პროცესის თითოეულ ეტაპზე.",
    "returns.conditions_title": "პირობები",
    "returns.conditions_text": "პროდუქტი უნდა იყოს დაუზიანებელი, ორიგინალ შეფუთვაში, ყველა ტეგით და აქსესუარით. პერსონალიზებული პროდუქტების დაბრუნება შეუძლებელია.",

    // Privacy
    "privacy.title": "კონფიდენციალურობის პოლიტიკა",
    "privacy.collection_title": "ინფორმაციის შეგროვება",
    "privacy.collection_text": "ჩვენ ვაგროვებთ ინფორმაციას რომელსაც თქვენ გვაწვდით შეკვეთის გაფორმებისას: სახელი, ელ-ფოსტა, ტელეფონის ნომერი და მიწოდების მისამართი.",
    "privacy.usage_title": "ინფორმაციის გამოყენება",
    "privacy.usage_text": "თქვენი პერსონალური ინფორმაცია გამოიყენება მხოლოდ შეკვეთის დამუშავებისთვის, მიწოდებისთვის და მომხმარებელთან კომუნიკაციისთვის.",
    "privacy.protection_title": "ინფორმაციის დაცვა",
    "privacy.protection_text": "ჩვენ ვიყენებთ უსაფრთხოების თანამედროვე სტანდარტებს თქვენი პერსონალური ინფორმაციის დასაცავად. თქვენი მონაცემები არ გადაეცემა მესამე მხარეს.",
    "privacy.cookies_title": "ქუქი ფაილები",
    "privacy.cookies_text": "ვებგვერდი იყენებს ქუქი ფაილებს მომხმარებლის გამოცდილების გასაუმჯობესებლად. თქვენ შეგიძლიათ მართოთ ქუქი ფაილების პარამეტრები ბრაუზერის პარამეტრებიდან.",

    // Terms
    "terms.title": "მოხმარების პირობები",
    "terms.general_title": "ზოგადი პირობები",
    "terms.general_text": "ვებგვერდის გამოყენებით თქვენ ეთანხმებით ამ პირობებს. TOCASA იტოვებს უფლებას შეცვალოს პირობები წინასწარი შეტყობინების გარეშე.",
    "terms.orders_title": "შეკვეთები",
    "terms.orders_text": "შეკვეთა ითვლება დადასტურებულად მას შემდეგ, რაც მიიღებთ დადასტურების ელ-ფოსტას. ჩვენ ვიტოვებთ უფლებას გავაუქმოთ შეკვეთა მარაგის ამოწურვის შემთხვევაში.",
    "terms.payment_title": "გადახდა",
    "terms.payment_text": "ვიღებთ გადახდას ბარათით და ნაღდი ანგარიშსწორებით მიწოდებისას. ყველა ფასი მოცემულია ლარებში და მოიცავს დღგ-ს.",
    "terms.liability_title": "პასუხისმგებლობა",
    "terms.liability_text": "TOCASA არ არის პასუხისმგებელი ნებისმიერ ზარალზე, რომელიც გამოწვეულია ვებგვერდის გამოყენებით ან პროდუქტის არასწორი ექსპლუატაციით.",

    // Common
    "common.loading": "იტვირთება...",
    "common.error": "შეცდომა",
    "common.save": "შენახვა",
    "common.cancel": "გაუქმება",
    "common.delete": "წაშლა",
    "common.edit": "რედაქტირება",
    "common.add": "დამატება",
    "common.view": "ნახვა",
  },
  en: {
    // Header
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.living_room": "Living Room",
    "nav.bedroom": "Bedroom",
    "nav.lighting": "Lighting",
    "nav.admin": "Admin Panel",
    
    // Hero
    "hero.tagline": "Interior Design & Home Inspiration",
    "hero.description": "Unique, limited-edition accessories at affordable prices. All available right here in Tbilisi.",
    "hero.shop_now": "Shop Now",
    "hero.explore": "Explore Collections",
    "hero.available": "Available in Tbilisi",
    
    // Categories
    "categories.tagline": "Curated Collections",
    "categories.title": "Shop by Room",
    "categories.explore": "Explore",
    "categories.products": "Products",
    
    // Featured
    "featured.tagline": "Our Selection",
    "featured.title": "Featured Products",
    "featured.view_all": "View All",
    
    // Coming Soon
    "coming_soon.tagline": "Coming Soon",
    "coming_soon.title": "New Collections Arriving",
    "coming_soon.notify": "Notify Me",
    
    // Newsletter
    "newsletter.tagline": "Stay Updated",
    "newsletter.title": "Subscribe to Our Newsletter",
    "newsletter.description": "Get exclusive access to new collections, special offers, and interior inspiration.",
    "newsletter.placeholder": "Enter your email",
    "newsletter.subscribe": "Subscribe",
    "newsletter.privacy": "By subscribing, you agree to our Privacy Policy.",
    
    // Products Page
    "products.title": "Products",
    "products.all": "All Products",
    "products.showing": "Showing",
    "products.of": "of",
    "products.no_results": "No products found",
    "products.try_adjusting": "Try adjusting your filters",
    "products.clear_filters": "Clear Filters",
    
    // Filters
    "filters.title": "Filters",
    "filters.search": "Search",
    "filters.search_placeholder": "Search products...",
    "filters.category": "Category",
    "filters.all_categories": "All Categories",
    "filters.price_range": "Price Range",
    "filters.min": "Min",
    "filters.max": "Max",
    "filters.sort": "Sort By",
    "filters.featured": "Featured",
    "filters.newest": "Newest",
    "filters.price_asc": "Price: Low to High",
    "filters.price_desc": "Price: High to Low",
    "filters.clear": "Clear Filters",
    
    // Product Details
    "product.add_to_cart": "Add to Cart",
    "product.in_stock": "In Stock",
    "product.out_of_stock": "Out of Stock",
    "product.you_may_like": "You May Also Like",
    "product.description": "Description",
    "product.details": "Details",
    
    // Cart
    "cart.title": "Your Cart",
    "cart.empty": "Your cart is empty",
    "cart.start_shopping": "Start Shopping",
    "cart.continue": "Continue Shopping",
    "cart.order_summary": "Order Summary",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "Free",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    
    // Footer
    "footer.tagline": "Unique home decor and interior accessories, available in Tbilisi.",
    "footer.shop": "Shop",
    "footer.all_products": "All Products",
    "footer.new_arrivals": "New Arrivals",
    "footer.best_sellers": "Best Sellers",
    "footer.on_sale": "On Sale",
    "footer.support": "Support",
    "footer.contact": "Contact Us",
    "footer.shipping": "Shipping Info",
    "footer.returns": "Returns",
    "footer.faq": "FAQ",
    "footer.follow": "Follow Us",
    "footer.rights": "All rights reserved.",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.products": "Products",
    "admin.categories": "Categories",
    "admin.orders": "Orders",
    "admin.settings": "Settings",
    "admin.back_to_store": "Back to Store",
    
    // Reviews
    "reviews.tagline": "Customer Reviews",
    "reviews.title": "What Our Customers Say",

    // FAQ
    "faq.tagline": "Frequently Asked Questions",
    "faq.title": "Have a Question?",
    "faq.q1": "How can I place an order?",
    "faq.a1": "Choose your desired product, add it to cart, and complete checkout. Delivery within Tbilisi takes 1-2 business days.",
    "faq.q2": "How much does delivery cost?",
    "faq.a2": "Free delivery for orders over 100 GEL within Tbilisi. Standard delivery costs 10 GEL.",
    "faq.q3": "Can I return a product?",
    "faq.a3": "Yes, products can be returned within 14 days of purchase, provided the product is in its original packaging and unused.",
    "faq.q4": "What payment methods do you accept?",
    "faq.a4": "We accept card payments and cash on delivery. All prices are in GEL and include VAT.",
    "faq.q5": "How can I contact you?",
    "faq.a5": "You can reach us via email at info@tocasa.ge or by phone at +995 555 123 456. Working hours: Mon-Sat 10:00-19:00.",

    // Contact
    "contact.title": "Contact Us",
    "contact.description": "Have a question? Get in touch and we'll be happy to help.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.address": "Address",
    "contact.hours": "Working Hours",
    "contact.hours_detail": "Mon - Sat: 10:00 - 19:00",

    // Shipping
    "shipping.title": "Shipping & Delivery",
    "shipping.delivery_title": "Delivery Time",
    "shipping.delivery_text": "Delivery within Tbilisi takes 1-2 business days. Regional delivery takes 3-5 business days.",
    "shipping.cost_title": "Delivery Cost",
    "shipping.cost_text": "Free delivery for orders over 100 GEL within Tbilisi. Standard delivery costs 10 GEL.",
    "shipping.tracking_title": "Order Tracking",
    "shipping.tracking_text": "After placing your order, you will receive an SMS with a tracking code.",

    // Returns
    "returns.title": "Returns & Exchanges",
    "returns.policy_title": "Return Policy",
    "returns.policy_text": "Products can be returned within 14 days of purchase, provided the product is in its original packaging and unused.",
    "returns.process_title": "Return Process",
    "returns.process_text": "Contact us via email or phone for returns. Our team will assist you through every step.",
    "returns.conditions_title": "Conditions",
    "returns.conditions_text": "Products must be undamaged, in original packaging with all tags and accessories. Personalized products cannot be returned.",

    // Privacy
    "privacy.title": "Privacy Policy",
    "privacy.collection_title": "Information Collection",
    "privacy.collection_text": "We collect information you provide when placing an order: name, email, phone number, and delivery address.",
    "privacy.usage_title": "Information Usage",
    "privacy.usage_text": "Your personal information is used solely for order processing, delivery, and customer communication.",
    "privacy.protection_title": "Information Protection",
    "privacy.protection_text": "We use modern security standards to protect your personal information. Your data is not shared with third parties.",
    "privacy.cookies_title": "Cookies",
    "privacy.cookies_text": "The website uses cookies to improve user experience. You can manage cookie settings through your browser preferences.",

    // Terms
    "terms.title": "Terms of Service",
    "terms.general_title": "General Terms",
    "terms.general_text": "By using the website you agree to these terms. TOCASA reserves the right to change terms without prior notice.",
    "terms.orders_title": "Orders",
    "terms.orders_text": "An order is considered confirmed after you receive a confirmation email. We reserve the right to cancel orders if stock runs out.",
    "terms.payment_title": "Payment",
    "terms.payment_text": "We accept card payments and cash on delivery. All prices are in GEL and include VAT.",
    "terms.liability_title": "Liability",
    "terms.liability_text": "TOCASA is not responsible for any damages caused by website usage or improper product use.",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.view": "View",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("tocasa-language");
    return (saved as Language) || "ka";
  });

  useEffect(() => {
    localStorage.setItem("tocasa-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
