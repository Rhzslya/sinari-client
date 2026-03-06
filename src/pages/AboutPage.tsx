import { Flag, Rocket, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const timelineIcons = [Flag, Smartphone, Rocket];

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const drawLine: Variants = {
  hidden: { height: 0 },
  visible: {
    height: "100%",
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

const AboutPage = () => {
  const { t } = useTranslation();

  const timelineList = t("about.timeline", { returnObjects: true }) as Array<{
    badge: string;
    title: string;
    desc: string;
  }>;

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* HEADER SECTION */}
      <motion.div
        className="container mx-auto px-4 max-w-4xl text-center mb-16 sm:mb-20"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
          {t("about.title")}
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed px-2">
          {t("about.subtitle")}
        </p>
      </motion.div>

      {/* TIMELINE SECTION */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 max-w-4xl relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        {/* Animated Vertical Line */}
        <motion.div
          variants={drawLine}
          className="absolute left-7.75 md:left-1/2 top-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full hidden sm:block"
        />
        {/* Static Line fallback for very small screens */}
        <div className="absolute left-5.75 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full sm:hidden" />

        <div className="space-y-8 sm:space-y-12">
          {timelineList.map((item, index) => {
            const Icon = timelineIcons[index];
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`relative flex flex-col md:${
                  isEven ? "flex-row" : "flex-row-reverse"
                } items-start md:items-center md:justify-between group`}
              >
                {/* Dot Element */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary -translate-x-1/2 md:group-hover:scale-150 transition-transform duration-300 mt-1.5 md:mt-0 z-10" />

                {/* Content Side */}
                <div
                  className={`ml-10 sm:ml-12 md:ml-0 md:w-[45%] ${
                    isEven
                      ? "md:text-right pr-0 md:pr-6"
                      : "md:text-left pl-0 md:pl-6"
                  }`}
                >
                  <span className="inline-block text-primary font-bold text-xs sm:text-sm bg-primary/10 px-3 py-1 rounded-full mb-2 md:mb-0">
                    {item.badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Icon Side (Hidden on Mobile) */}
                <div
                  className={`hidden md:flex md:w-[45%] ${
                    isEven ? "justify-start pl-6" : "justify-end pr-6"
                  }`}
                >
                  <div className="p-4 sm:p-5 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors duration-300">
                    <Icon className="size-8 sm:size-10 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
