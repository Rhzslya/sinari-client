import { ArrowRight, HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FaqPage = () => {
  const { t } = useTranslation();

  const faqList = t("faq.list", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 border-b border-border/50 pb-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
              <HelpCircle className="size-4" /> {t("faq.badge")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              {t("faq.title")}
            </h1>
            <p className="text-lg text-muted-foreground">{t("faq.subtitle")}</p>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <p className="text-sm font-medium text-muted-foreground text-right">
              {t("faq.not_found")}
            </p>
            <Button
              asChild
              className="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all text-foreground"
            >
              <Link to="/contact">
                <Mail className="size-4" /> {t("faq.btn_msg")}{" "}
                <ArrowRight className="size-4 ml-1 opacity-70" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {faqList.map((faq, index) => (
            <div
              key={index}
              className="bg-muted/20 border border-border/50 rounded-2xl p-6 hover:bg-muted/40 transition-colors hover:-translate-y-1 duration-300"
            >
              <h3 className="font-bold text-lg mb-3 text-foreground leading-tight">
                {faq.question}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
