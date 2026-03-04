import { CheckCircle2, XCircle, Receipt, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const WarrantyPage = () => {
  const { t } = useTranslation();

  const handleConsultClick = () => {
    const phoneNumber = "6281234567890";
    const text =
      "Halo Sinari Cell, saya ingin konsultasi mengenai servis gadget saya.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            {t("warranty.title")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("warranty.subtitle")}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="flex items-center gap-3 bg-muted/20 border border-border/50 px-6 py-4 rounded-full">
            <BadgeCheck className="text-primary size-6" />
            <span className="font-semibold text-sm md:text-base">
              {t("warranty.badges.hardware")}
            </span>
          </div>
          <div className="flex items-center gap-3 bg-muted/20 border border-border/50 px-6 py-4 rounded-full">
            <BadgeCheck className="text-primary size-6" />
            <span className="font-semibold text-sm md:text-base">
              {t("warranty.badges.software")}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Garansi Berlaku */}
          <div className="bg-success/5 border border-success/20 rounded-3xl p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="size-8 text-success" />
              <h2 className="text-2xl font-bold text-success-foreground">
                {t("warranty.valid.title")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t("warranty.valid.desc")}
            </p>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.01"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.02"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.03"),
                  }}
                />
              </li>
            </ul>
          </div>

          {/* Garansi Hangus */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="size-8 text-destructive" />
              <h2 className="text-2xl font-bold text-destructive-foreground">
                {t("warranty.void.title")}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t("warranty.void.desc")}
            </p>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.01"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.02"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.03"),
                  }}
                />
              </li>
            </ul>
          </div>
        </div>

        {/* Step to Claim */}
        <div className="bg-muted/10 rounded-3xl border border-border/50 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Receipt className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">
                {t("warranty.claim.title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("warranty.claim.desc")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleConsultClick}
            className="w-full md:w-auto shrink-0 cursor-pointer text-foreground"
          >
            {t("warranty.claim.btn")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
