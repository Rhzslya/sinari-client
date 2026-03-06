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

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* HEADER SECTION */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">
            {t("privacy.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t("privacy.subtitle")}
          </p>
        </motion.div>

        {/* CARDS GRID SECTION */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {/* Card 1 */}
          <motion.div
            variants={fadeInUp}
            className="bg-muted/20 border border-border/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-muted/40 hover:border-primary/30 transition-all duration-300"
          >
            <UserCheck className="size-8 sm:size-10 text-primary mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              {t("privacy.items.01.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.01.desc")}
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={fadeInUp}
            className="bg-muted/20 border border-border/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-muted/40 hover:border-primary/30 transition-all duration-300"
          >
            <LockKeyhole className="size-8 sm:size-10 text-primary mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              {t("privacy.items.02.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.02.desc")}
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={fadeInUp}
            className="bg-muted/20 border border-border/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-muted/40 hover:border-primary/30 transition-all duration-300"
          >
            <EyeOff className="size-8 sm:size-10 text-primary mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              {t("privacy.items.03.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.03.desc")}
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            variants={fadeInUp}
            className="bg-muted/20 border border-border/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-muted/40 hover:border-primary/30 transition-all duration-300"
          >
            <Share2 className="size-8 sm:size-10 text-primary mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              {t("privacy.items.04.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("privacy.items.04.desc")}
            </p>
          </motion.div>

          {/* Card 5 - Cookies */}
          <motion.div
            variants={fadeInUp}
            className="bg-muted/20 border border-border/50 p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:bg-muted/40 hover:border-primary/30 transition-all duration-300 md:col-span-2"
          >
            <Cookie className="size-8 sm:size-10 text-primary mb-4 sm:mb-6" />
            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
              {t("privacy.items.05.title")}
            </h2>
            <p
              className="text-sm text-muted-foreground leading-relaxed max-w-4xl"
              dangerouslySetInnerHTML={{ __html: t("privacy.items.05.desc") }}
            />
          </motion.div>
        </motion.div>

        {/* DELETE DATA SECTION */}
        <motion.div
          className="bg-primary/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-primary/20 flex flex-col md:flex-row items-center text-center md:text-left justify-between gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="p-3 bg-background rounded-full shadow-sm border border-primary/10 shrink-0">
              <ShieldQuestion className="size-8 sm:size-10 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">
                {t("privacy.delete_data.title")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                {t("privacy.delete_data.desc")}
              </p>
            </div>
          </div>
          <Button
            asChild
            size="lg"
            className="shrink-0 cursor-pointer shadow-md hover:shadow-lg transition-all text-foreground w-full md:w-auto h-12"
          >
            <Link
              to="/contact"
              state={{
                defaultSubject: t("privacy.delete_data.email_subject"),
                defaultMessage: t("privacy.delete_data.email_body"),
              }}
            >
              {t("privacy.delete_data.btn")}
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
