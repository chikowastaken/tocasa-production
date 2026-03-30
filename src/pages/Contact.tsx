import { Layout } from "@/components/layout/Layout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="tocasa-container py-12 sm:py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-muted-foreground mb-12 text-base sm:text-lg leading-relaxed">
            {t("contact.description")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="flex items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <Mail className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.email")}</h3>
                <p className="text-sm text-muted-foreground">info@tocasa.ge</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <Phone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.phone")}</h3>
                <p className="text-sm text-muted-foreground">+995 555 123 456</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.address")}</h3>
                <p className="text-sm text-muted-foreground">თბილისი, საქართველო</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-lg bg-card border border-border">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">{t("contact.hours")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("contact.hours_detail")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
