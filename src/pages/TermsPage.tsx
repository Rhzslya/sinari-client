import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden relative">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* HEADER SECTION */}
        <motion.div variants={fadeInUp} className="mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 sm:mb-6 uppercase leading-tight">
            {t("terms.title_1")} <br className="hidden sm:block" />{" "}
            {t("terms.title_2")}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground border-l-4 border-primary pl-4 max-w-2xl">
            {t("terms.subtitle")}
          </p>
        </motion.div>

        {/* CONTENT SECTION */}
        <div className="space-y-6 sm:space-y-8 md:space-y-12">
          {/* Pasal 1 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative p-6 sm:p-8 md:p-10 bg-muted/20 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute -right-4 -top-6 sm:-right-6 sm:-top-12 text-[100px] sm:text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none leading-none">
              01
            </div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {t("terms.items.01.title")}
              </h2>
              <div
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("terms.items.01.desc") }}
              />
            </div>
          </motion.div>

          {/* Pasal 2 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative p-6 sm:p-8 md:p-10 bg-muted/20 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute -right-4 -top-6 sm:-right-6 sm:-top-12 text-[100px] sm:text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none leading-none">
              02
            </div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {t("terms.items.02.title")}
              </h2>
              <div
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("terms.items.02.desc") }}
              />
            </div>
          </motion.div>

          {/* Pasal 3 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative p-6 sm:p-8 md:p-10 bg-muted/20 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute -right-4 -top-6 sm:-right-6 sm:-top-12 text-[100px] sm:text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none leading-none">
              03
            </div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {t("terms.items.03.title")}
              </h2>
              <div
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("terms.items.03.desc") }}
              />
            </div>
          </motion.div>

          {/* Pasal 4 (Destructive / Warning) */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative p-6 sm:p-8 md:p-10 bg-destructive/5 border border-destructive/20 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-destructive/40 transition-colors"
          >
            <div className="absolute -right-4 -top-6 sm:-right-6 sm:-top-12 text-[100px] sm:text-[150px] font-black text-destructive/5 group-hover:text-destructive/10 transition-colors duration-500 select-none pointer-events-none leading-none">
              04
            </div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-destructive mb-3 sm:mb-4">
                {t("terms.items.04.title")}
              </h2>
              <div
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("terms.items.04.desc") }}
              />
            </div>
          </motion.div>

          {/* Pasal 5 */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative p-6 sm:p-8 md:p-10 bg-muted/20 border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute -right-4 -top-6 sm:-right-6 sm:-top-12 text-[100px] sm:text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none leading-none">
              05
            </div>
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                {t("terms.items.05.title")}
              </h2>
              <div
                className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t("terms.items.05.desc") }}
              />
            </div>
          </motion.div>
        </div>

        {/* FOOTER BUTTON */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 sm:mt-12 flex justify-center"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full px-6 sm:px-8 cursor-pointer text-sm sm:text-base h-12"
          >
            <Link to="/">{t("terms.back_to_home")}</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsPage;
