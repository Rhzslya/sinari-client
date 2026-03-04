import {
  LockKeyhole,
  EyeOff,
  UserCheck,
  Share2,
  ShieldQuestion,
  Cookie,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PrivacyPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {t("privacy.title")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("privacy.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Card 1 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <UserCheck className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              {t("privacy.items.01.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.01.desc")}
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <LockKeyhole className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              {t("privacy.items.02.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.02.desc")}
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <EyeOff className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              {t("privacy.items.03.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.03.desc")}
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <Share2 className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              {t("privacy.items.04.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.04.desc")}
            </p>
          </div>

          {/* Card 5 - Cookies */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors md:col-span-2">
            <Cookie className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              {t("privacy.items.05.title")}
            </h2>
            <p
              className="text-sm text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t("privacy.items.05.desc") }}
            />
          </div>
        </div>

        {/* Delete Data Section */}
        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ShieldQuestion className="size-10 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-lg">
                {t("privacy.delete_data.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("privacy.delete_data.desc")}
              </p>
            </div>
          </div>
          <Button
            asChild
            className="shrink-0 cursor-pointer shadow-md hover:shadow-lg transition-all text-foreground"
          >
            <Link
              to="/contact"
              state={{
                defaultSubject: t("privacy.delete_data.email_subject"), // 👈 Otomatis diterjemahkan
                defaultMessage: t("privacy.delete_data.email_body"), // 👈 Otomatis diterjemahkan
              }}
            >
              {t("privacy.delete_data.btn")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
