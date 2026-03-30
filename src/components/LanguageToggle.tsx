import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "ka" ? "en" : "ka")}
      className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 font-medium text-xs"
    >
      {language === "ka" ? "EN" : "ქა"}
    </Button>
  );
}
