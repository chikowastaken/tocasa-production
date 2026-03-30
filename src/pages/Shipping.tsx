import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Shipping = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="tocasa-container py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-8 not-prose">
            {t("shipping.title")}
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("shipping.delivery_title")}</h2>
              <p className="leading-relaxed">{t("shipping.delivery_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("shipping.cost_title")}</h2>
              <p className="leading-relaxed">{t("shipping.cost_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("shipping.tracking_title")}</h2>
              <p className="leading-relaxed">{t("shipping.tracking_text")}</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shipping;
