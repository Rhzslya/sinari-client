import { ArrowRight, HelpCircle, Mail } from "lucide-react";
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
    transition: { staggerChildren: 0.1 },
  },
};

const FaqPage = () => {
  const { t } = useTranslation();

  const faqList = t("faq.list", { returnObjects: true }) as Array<{
    question: string;
    answer: string;
  }>;

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* HEADER SECTION */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 sm:mb-16 gap-6 sm:gap-8 border-b border-border/50 pb-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs sm:text-sm font-semibold text-primary mb-4">
              <HelpCircle className="size-3.5 sm:size-4" /> {t("faq.badge")}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 sm:mb-4 leading-tight">
              {t("faq.title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-3 shrink-0 w-full lg:w-auto mt-4 lg:mt-0"
          >
            <p className="text-sm font-medium text-muted-foreground lg:text-right hidden lg:block">
              {t("faq.not_found")}
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all text-foreground w-full lg:w-auto h-12"
            >
              <Link to="/contact">
                <Mail className="size-4 sm:size-5" /> {t("faq.btn_msg")}{" "}
                <ArrowRight className="size-4 sm:size-5 ml-1 opacity-70" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* FAQ GRID SECTION */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {faqList.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-muted/20 border border-border/50 rounded-2xl p-5 sm:p-6 hover:bg-muted/40 transition-colors hover:-translate-y-1 hover:shadow-sm duration-300"
            >
              <h3 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 text-foreground leading-tight">
                {faq.question}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
