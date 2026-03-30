import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="tocasa-container py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-8">
            {t("privacy.title")}
          </h1>

          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("privacy.collection_title")}</h2>
              <p className="leading-relaxed">{t("privacy.collection_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("privacy.usage_title")}</h2>
              <p className="leading-relaxed">{t("privacy.usage_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("privacy.protection_title")}</h2>
              <p className="leading-relaxed">{t("privacy.protection_text")}</p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-foreground mb-3">{t("privacy.cookies_title")}</h2>
              <p className="leading-relaxed">{t("privacy.cookies_text")}</p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
