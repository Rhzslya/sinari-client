import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const TermsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
            {t("terms.title_1")} <br className="hidden md:block" />{" "}
            {t("terms.title_2")}
          </h1>
          <p className="text-xl text-muted-foreground border-l-4 border-primary pl-4">
            {t("terms.subtitle")}
          </p>
        </div>

        <div className="space-y-12">
          {/* Pasal 1 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              01
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                {t("terms.items.01.title")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t("terms.items.01.desc") }}
              />
            </div>
          </div>

          {/* Pasal 2 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              02
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                {t("terms.items.02.title")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t("terms.items.02.desc") }}
              />
            </div>
          </div>

          {/* Pasal 3 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              03
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                {t("terms.items.03.title")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t("terms.items.03.desc") }}
              />
            </div>
          </div>

          {/* Pasal 4 */}
          <div className="relative p-8 md:p-10 bg-destructive/5 border border-destructive/20 rounded-3xl overflow-hidden group hover:border-destructive/40 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-destructive/5 group-hover:text-destructive/10 transition-colors duration-500 select-none pointer-events-none">
              04
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                {t("terms.items.04.title")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t("terms.items.04.desc") }}
              />
            </div>
          </div>

          {/* Pasal 5 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              05
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                {t("terms.items.05.title")}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-4"
                dangerouslySetInnerHTML={{ __html: t("terms.items.05.desc") }}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-8 cursor-pointer"
          >
            <Link to="/">{t("terms.back_to_home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
