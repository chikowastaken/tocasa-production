import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="tocasa-container py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-8">
            {t("terms.title")}
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("terms.general_title")}</h2>
              <p className="leading-relaxed">{t("terms.general_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("terms.orders_title")}</h2>
              <p className="leading-relaxed">{t("terms.orders_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("terms.payment_title")}</h2>
              <p className="leading-relaxed">{t("terms.payment_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("terms.liability_title")}</h2>
              <p className="leading-relaxed">{t("terms.liability_text")}</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
