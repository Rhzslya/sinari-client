import {
  Send,
  ShieldCheck,
  Banknote,
  Wrench,
  Smartphone,
  Loader2,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { formatPhoneNumberToWA } from "@/components/utils/formatNumbeToWa";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// --- ANIMATION VARIANTS ---
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const { useGetPublicSettings } = useStoreSettingQueries();
  const { data: storeData, isLoading: isStoreLoading } = useGetPublicSettings();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkStyle = (path: string) => {
    return `transition-colors block py-1 ${
      isActive(path)
        ? "text-primary font-semibold"
        : "text-muted-foreground hover:text-primary"
    }`;
  };

  const handleConsultClick = () => {
    const phoneNumber = formatPhoneNumberToWA(storeData?.store_phone);
    const text =
      "Halo Sinari Cell, saya ingin konsultasi mengenai servis gadget saya.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = EMAIL_REGEX.test(email);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Berhasil berlangganan");
    }, 1000);
  };

  const serviceStandards = [
    { icon: ShieldCheck, label: t("footer.standards.warranty") },
    { icon: Banknote, label: t("footer.standards.transparent") },
    { icon: Wrench, label: t("footer.standards.technician") },
    { icon: Smartphone, label: t("footer.standards.tracking") },
  ];

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-10 md:h-9";

  return (
    <footer className="bg-muted/20 border-t border-border mt-auto pt-12 md:pt-16 overflow-hidden">
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        {/* SECTION 1: Newsletter & Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 pb-10 md:pb-12 border-b border-border/60">
          <motion.div variants={fadeInUp} className="space-y-4">
            <h3 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {t("footer.newsletter.subtitle")}
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-2 max-w-md mt-4"
            >
              <Input
                autoComplete="off"
                type="email"
                required
                placeholder={t("footer.newsletter.placeholder")}
                className={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="shrink-0 gap-2 cursor-pointer text-foreground h-10 md:h-9 w-full sm:w-1/2"
                disabled={isSubmitting || !isValidEmail}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">
                    {t("footer.newsletter.processing")}
                  </span>
                ) : (
                  <>
                    {t("footer.newsletter.subscribe")}
                    <Send className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col lg:items-end justify-center space-y-4"
          >
            <p className="font-semibold text-foreground text-sm">
              {t("footer.standards.title")}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 lg:justify-end text-muted-foreground">
              {serviceStandards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 bg-background px-3 py-2 rounded-md border border-border shadow-sm cursor-default hover:border-primary/50 transition-colors"
                  >
                    <Icon className="size-4 md:size-5 text-primary shrink-0" />
                    <span className="text-xs font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* SECTION 2: Navigation Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 py-10 md:py-12">
          <motion.div variants={fadeInUp} className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-black text-primary mb-4 tracking-tighter">
              {isStoreLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                `${storeData?.store_name}`
              )}
            </h2>
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6 max-w-xs">
              {t("footer.company_desc")}
            </p>

            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-bold text-foreground mb-4 text-sm md:text-base">
              {t("footer.links.services.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto font-normal text-sm cursor-pointer py-1"
                  onClick={handleConsultClick}
                >
                  {isStoreLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    t("footer.links.services.consultation")
                  )}
                </button>
              </li>
              <li>
                <Link
                  to="/#track-srv"
                  className="text-muted-foreground hover:text-primary transition-colors block py-1"
                  onClick={() => {
                    const element = document.getElementById("track-srv");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {t("footer.links.services.tracking")}
                </Link>
              </li>
              <li>
                <Link to="/products" className={getLinkStyle("/products")}>
                  {t("footer.links.services.products")}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-bold text-foreground mb-4 text-sm md:text-base">
              {t("footer.links.customer.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className={getLinkStyle("/about")}>
                  {t("footer.links.customer.about")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={getLinkStyle("/contact")}>
                  {t("footer.links.customer.contact")}
                </Link>
              </li>
              <li>
                <Link to="/faq" className={getLinkStyle("/faq")}>
                  {t("footer.links.customer.faq")}
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h4 className="font-bold text-foreground mb-4 text-sm md:text-base">
              {t("footer.links.policy.title")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/warranty" className={getLinkStyle("/warranty")}>
                  {t("footer.links.policy.warranty")}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className={getLinkStyle("/privacy")}>
                  {t("footer.links.policy.privacy")}
                </Link>
              </li>
              <li>
                <Link to="/terms" className={getLinkStyle("/terms")}>
                  {t("footer.links.policy.terms")}
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* SECTION 3: Copyright & Payments */}
        <motion.div
          variants={fadeInUp}
          className="py-6 border-t border-border/60 text-center text-xs md:text-sm text-muted-foreground flex flex-col-reverse md:flex-row justify-between items-center gap-4"
        >
          <p>
            &copy; {currentYear} Sinari Cell. {t("footer.copyright")}
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
