import { CheckCircle2, XCircle, Receipt, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

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
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* HEADER SECTION */}
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight">
            {t("warranty.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            {t("warranty.subtitle")}
          </p>
        </motion.div>

        {/* BADGES SECTION */}
        <motion.div
          className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mb-12 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={staggerContainer}
        >
          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center sm:justify-start gap-3 bg-muted/20 border border-border/50 px-5 sm:px-6 py-3 sm:py-4 rounded-full w-full sm:w-1/2"
          >
            <BadgeCheck className="text-primary size-5 sm:size-6 shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              {t("warranty.badges.hardware")}
            </span>
          </motion.div>
          <motion.div
            variants={scaleIn}
            className="flex items-center justify-center sm:justify-start gap-3 bg-muted/20 border border-border/50 px-5 sm:px-6 py-3 sm:py-4 rounded-full w-full sm:w-1/2"
          >
            <BadgeCheck className="text-primary size-5 sm:size-6 shrink-0" />
            <span className="font-semibold text-sm sm:text-base">
              {t("warranty.badges.software")}
            </span>
          </motion.div>
        </motion.div>

        {/* CONTENT GRID */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Garansi Berlaku */}
          <motion.div
            variants={fadeInUp}
            className="bg-success/5 border border-success/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <CheckCircle2 className="size-6 sm:size-8 text-success shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-success-foreground leading-tight">
                {t("warranty.valid.title")}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {t("warranty.valid.desc")}
            </p>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.01"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.02"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.valid.list.03"),
                  }}
                />
              </li>
            </ul>
          </motion.div>

          {/* Garansi Hangus */}
          <motion.div
            variants={fadeInUp}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <XCircle className="size-6 sm:size-8 text-destructive shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-destructive-foreground leading-tight">
                {t("warranty.void.title")}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {t("warranty.void.desc")}
            </p>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.01"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.02"),
                  }}
                />
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: t("warranty.void.list.03"),
                  }}
                />
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* STEP TO CLAIM */}
        <motion.div
          className="bg-muted/10 rounded-2xl sm:rounded-3xl border border-border/50 p-6 sm:p-8 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6 sm:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
              <Receipt className="size-6 sm:size-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">
                {t("warranty.claim.title")}
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                {t("warranty.claim.desc")}
              </p>
            </div>
          </div>
          <Button
            onClick={handleConsultClick}
            size="lg"
            className="w-full md:w-auto shrink-0 cursor-pointer text-foreground h-12"
          >
            {t("warranty.claim.btn")}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default WarrantyPage;
