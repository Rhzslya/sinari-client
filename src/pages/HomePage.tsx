import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useProductQueries } from "@/hooks/product-queries";
import { handleApiError } from "@/lib/utils";
import { isAxiosError } from "axios";
import {
  Smartphone,
  Wrench,
  Zap,
  Search,
  ArrowRight,
  Star,
  ShieldCheck,
  Package,
  Banknote,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useRotatedPage } from "@/hooks/use-rotated";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { PublicProductSkeleton } from "@/features/fragments/Skeleton";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { formatPhoneNumberToWA } from "@/components/utils/formatNumbeToWa";

const CACHE_KEY = "sinari_home_featured_products";
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000;
const MAX_PAGES = 5;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
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

const HomePage = () => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trackingInput, setTrackingInput] = useState("");

  const size = Number(searchParams.get("size")) || 4;
  const { page: featuredPage, updatePage } = useRotatedPage(
    CACHE_KEY,
    MAX_PAGES,
    CACHE_DURATION_MS,
  );

  const productQueries = useProductQueries();

  const { data, isLoading, isError, error, refetch } =
    productQueries.usePublicList({
      page: featuredPage,
      size: size,
    });

  const { useGetPublicSettings } = useStoreSettingQueries();
  const { data: storeData, isLoading: isStoreLoading } = useGetPublicSettings();

  const products = data?.data || [];

  useEffect(() => {
    if (data?.paging && data.paging.total_page > 0) {
      if (featuredPage > data.paging.total_page) {
        const correctedPage =
          Math.floor(Math.random() * data.paging.total_page) + 1;

        updatePage(correctedPage);
      }
    }
  }, [data, featuredPage, updatePage]);

  useEffect(() => {
    if (isError) {
      handleApiError(error, "Failed to load products");
    }
  }, [isError, error]);

  const handleConsultClick = () => {
    const phoneNumber = formatPhoneNumberToWA(storeData?.store_phone);
    const text =
      "Halo Sinari Cell, saya ingin konsultasi mengenai servis gadget saya.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  const handleTrackService = () => {
    const input = trackingInput.trim();
    if (!input) return;

    let extractedId = input;

    if (extractedId.includes("/")) {
      const parts = extractedId.split("/").filter(Boolean);
      extractedId = parts[parts.length - 1];
    }

    navigate(`/services/track/${extractedId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTrackService();
    }
  };

  if (isError && !data) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const match = (error.response?.data?.errors || "").match(
        /(\d+)(?:s| seconds)/,
      );
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 px-4 text-center">
        <p className="text-destructive font-medium text-lg">
          Failed to load products.
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error) ? error.message : "Unknown error occurred"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 sm:px-4 py-2 text-sm sm:text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-12 sm:h-14";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* HERO SECTION */}
      <section
        id="track-srv"
        className="relative py-16 sm:py-24 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/10 -z-10 skew-y-3 transform origin-top-left" />
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-4 sm:mb-6"
          >
            {t("home.hero.title_1")}{" "}
            <span className="text-foreground">{t("home.hero.title_2")}</span>
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 px-2"
          >
            {t("home.hero.subtitle")}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-center px-4 sm:px-0"
          >
            <Button
              size="lg"
              variant="outline"
              className="font-semibold text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 cursor-pointer w-full sm:w-auto transition-all"
              onClick={handleConsultClick}
              disabled={isStoreLoading}
            >
              {isStoreLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
                  {t("home.hero.consult_btn")}
                </>
              ) : (
                t("home.hero.consult_btn")
              )}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* TRACKING SECTION */}
      <motion.section
        className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 mb-16 sm:mb-20 relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.8 }}
        variants={fadeInUp}
      >
        <Card className="max-w-3xl mx-auto shadow-xl sm:shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-center text-lg sm:text-xl">
              {t("home.tracking.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <div className="flex gap-2 sm:gap-3">
              <Input
                placeholder={t("home.tracking.placeholder")}
                className={inputStyle}
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="lg"
                className="h-12 sm:h-14 aspect-square p-0 cursor-pointer shrink-0"
                onClick={handleTrackService}
                disabled={!trackingInput.trim()}
              >
                <Search className="size-5 sm:size-6 text-foreground" />
              </Button>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-3 sm:mt-4">
              {t("home.tracking.example")}
            </p>
          </CardContent>
        </Card>
      </motion.section>

      {/* SERVICES SECTION */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              {t("home.services.title")}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t("home.services.subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<Smartphone className="size-8 sm:size-10 text-primary" />}
                title={t("home.services.items.smartphone.title")}
                desc={t("home.services.items.smartphone.desc")}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<Wrench className="size-8 sm:size-10 text-primary" />}
                title={t("home.services.items.service_center.title")}
                desc={t("home.services.items.service_center.desc")}
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <FeatureCard
                icon={<Zap className="size-8 sm:size-10 text-primary" />}
                title={t("home.services.items.ppob.title")}
                desc={t("home.services.items.ppob.desc")}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6 sm:mb-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                {t("home.products.title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
                {t("home.products.subtitle")}
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex gap-2 cursor-pointer"
              onClick={() => navigate("/products")}
            >
              {t("home.products.see_all")} <ArrowRight className="size-4" />
            </Button>
          </motion.div>

          {isLoading ? (
            <PublicProductSkeleton count={4} />
          ) : products.length === 0 ? (
            <motion.div
              variants={fadeInUp}
              className="text-center py-10 sm:py-12 bg-muted/20 rounded-2xl border border-border/40 px-4"
            >
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-base sm:text-lg font-medium text-foreground">
                {t("home.products.empty_title")}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                {t("home.products.empty_desc")}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <div
                    className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-2.5 sm:p-4 transition-all duration-300 hover:bg-muted/40 hover:border-border hover:shadow-lg cursor-pointer h-full"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    <div className="relative aspect-square bg-slate-50 flex items-center justify-center rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 transition-colors group-hover:bg-slate-100 border border-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain p-3 sm:p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Package className="h-10 w-10 sm:h-16 sm:w-16 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
                      )}

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground text-[8px] sm:text-[10px] font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm tracking-wider sm:tracking-widest">
                            {t("home.products.out_of_stock")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 mt-auto pt-1 sm:pt-2">
                      <TruncatedTooltip
                        text={product.name}
                        className="font-semibold text-xs sm:text-sm lg:text-base text-foreground line-clamp-2 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300"
                      />

                      {product.manufacturer ? (
                        <div className="mb-2 sm:mb-3 w-full">
                          <span
                            className="inline-block max-w-full truncate text-[8px] sm:text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                            title={product.manufacturer}
                          >
                            {product.manufacturer}
                          </span>
                        </div>
                      ) : (
                        <div className="mb-2 sm:mb-3 w-full h-4 sm:h-5"></div>
                      )}

                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <div className="flex flex-col border-l-2 border-primary/50 pl-1.5 sm:pl-2">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                            {t("home.products.brand")}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold truncate text-foreground">
                            {product.brand}
                          </span>
                        </div>
                        <div className="flex flex-col border-l-2 border-muted pl-1.5 sm:pl-2">
                          <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                            {t("home.products.category")}
                          </span>
                          <span className="text-[10px] sm:text-xs font-semibold truncate text-foreground">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50 group-hover:bg-primary/5 transition-colors gap-1">
                        <span className="font-bold text-xs sm:text-sm lg:text-base text-foreground tracking-tight truncate">
                          {formatRupiah(product.price)}
                        </span>

                        <div className="flex items-center text-yellow-500 text-[8px] sm:text-[10px] font-bold bg-background px-1.5 sm:px-2 py-1 rounded shadow-sm border border-border/50 gap-1 shrink-0">
                          <Star className="size-2 sm:size-3 fill-current" /> 4.9
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div variants={fadeInUp}>
            <Button
              variant="outline"
              className="w-full mt-6 sm:hidden cursor-pointer h-12 font-semibold"
              onClick={() => navigate("/products")}
            >
              {t("home.products.see_all_mobile")}
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* STANDARDS SECTION */}
      <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <motion.div
          className="bg-primary text-foreground rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={scaleIn}
        >
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6 leading-tight"
              >
                {t("home.standards.title_1")} <br className="hidden sm:block" />
                {t("home.standards.title_2")}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className="text-muted text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
              >
                {t("home.standards.subtitle")}
              </motion.p>
              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4"
              >
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center backdrop-blur-sm"
                    >
                      <Star className="size-3 sm:size-4 text-yellow-300 fill-yellow-300" />
                    </div>
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium">
                  {t("home.standards.trusted")}
                </span>
              </motion.div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
            >
              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-colors"
              >
                <ShieldCheck className="size-6 sm:size-8 mb-3 sm:mb-4 text-white" />
                <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">
                  {t("home.standards.items.warranty.title")}
                </h3>
                <p className="text-muted text-xs sm:text-sm">
                  {t("home.standards.items.warranty.desc")}
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-colors sm:translate-y-6 lg:translate-y-8"
              >
                <Smartphone className="size-6 sm:size-8 mb-3 sm:mb-4 text-white" />
                <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">
                  {t("home.standards.items.tracking.title")}
                </h3>
                <p className="text-muted text-xs sm:text-sm">
                  {t("home.standards.items.tracking.desc")}
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-colors"
              >
                <Banknote className="size-6 sm:size-8 mb-3 sm:mb-4 text-white" />
                <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">
                  {t("home.standards.items.transparent.title")}
                </h3>
                <p className="text-muted text-xs sm:text-sm">
                  {t("home.standards.items.transparent.desc")}
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-5 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-white/20 transition-colors sm:translate-y-6 lg:translate-y-8"
              >
                <Wrench className="size-6 sm:size-8 mb-3 sm:mb-4 text-white" />
                <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2 text-white">
                  {t("home.standards.items.technician.title")}
                </h3>
                <p className="text-muted text-xs sm:text-sm">
                  {t("home.standards.items.technician.desc")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-none shadow-md h-full">
      <CardContent className="p-6 sm:p-8 text-center flex flex-col items-center h-full justify-center">
        <div className="mb-3 sm:mb-4 p-3 bg-primary/10 rounded-full w-fit">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default HomePage;
