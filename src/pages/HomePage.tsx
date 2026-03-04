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
  Loader2,
  Banknote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useRotatedPage } from "@/hooks/use-rotated";
import { useTranslation } from "react-i18next";

const CACHE_KEY = "sinari_home_featured_products";
const CACHE_DURATION_MS = 3 * 60 * 60 * 1000;
const MAX_PAGES = 5;

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
    const phoneNumber = "6281234567890";
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
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">Failed to load products.</p>
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
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-12";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <section
        id="track-srv"
        className="relative py-20 lg:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/10 -z-10 skew-y-3 transform origin-top-left" />
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6">
            {t("home.hero.title_1")}{" "}
            <span className="text-foreground">{t("home.hero.title_2")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row  justify-center">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold text-lg h-12 px-8 cursor-pointer"
              onClick={handleConsultClick}
            >
              {t("home.hero.consult_btn")}
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 mb-20 relative z-10">
        <Card className="max-w-3xl mx-auto shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              {t("home.tracking.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder={t("home.tracking.placeholder")}
                className={inputStyle}
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                size="lg"
                className="h-12 aspect-square p-0 cursor-pointer"
                onClick={handleTrackService}
                disabled={!trackingInput.trim()}
              >
                <Search className="size-6 text-foreground" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              {t("home.tracking.example")}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              {t("home.services.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("home.services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Smartphone className="size-10 text-primary" />}
              title={t("home.services.items.smartphone.title")}
              desc={t("home.services.items.smartphone.desc")}
            />
            <FeatureCard
              icon={<Wrench className="size-10 text-primary" />}
              title={t("home.services.items.service_center.title")}
              desc={t("home.services.items.service_center.desc")}
            />
            <FeatureCard
              icon={<Zap className="size-10 text-primary" />}
              title={t("home.services.items.ppob.title")}
              desc={t("home.services.items.ppob.desc")}
            />
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t("home.products.title")}</h2>
            <p className="text-muted-foreground mt-1">
              {t("home.products.subtitle")}
            </p>
          </div>
          <Button
            variant="ghost"
            className="hidden md:flex gap-2 cursor-pointer"
            onClick={() => navigate("/products")}
          >
            {t("home.products.see_all")} <ArrowRight className="size-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border/40">
            <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground">
              {t("home.products.empty_title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("home.products.empty_desc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col rounded-2xl bg-muted/20 border border-border/40 p-3 sm:p-4 transition-all duration-300 hover:bg-muted/40 hover:border-border cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="relative aspect-square bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden mb-4 transition-colors group-hover:bg-slate-100 border border-slate-100">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <Package className="h-16 w-16 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
                  )}

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm tracking-widest">
                        {t("home.products.out_of_stock")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 mt-auto pt-2">
                  <TruncatedTooltip
                    text={product.name}
                    className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300"
                  />

                  {product.manufacturer ? (
                    <div className="mb-3 w-full">
                      <span
                        className="inline-block max-w-full truncate text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                        title={product.manufacturer}
                      >
                        {product.manufacturer}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 w-full h-5"></div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex flex-col border-l-2 border-primary/50 pl-2">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                        {t("home.products.brand")}
                      </span>
                      <span className="text-xs font-semibold truncate text-foreground">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex flex-col border-l-2 border-muted pl-2">
                      <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                        {t("home.products.category")}
                      </span>
                      <span className="text-xs font-semibold truncate text-foreground">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50 group-hover:bg-primary/5 transition-colors">
                    <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                      {formatRupiah(product.price)}
                    </span>

                    <div className="flex items-center text-yellow-500 text-[10px] font-bold bg-background px-2 py-1 rounded shadow-sm border border-border/50 gap-1">
                      <Star className="size-3 fill-current" /> 4.9
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full mt-6 md:hidden cursor-pointer"
          onClick={() => navigate("/products")}
        >
          {t("home.products.see_all_mobile")}
        </Button>
      </section>
      <section className="py-16 container mx-auto px-4">
        <div className="bg-primary text-foreground rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                {t("home.standards.title_1")} <br />
                {t("home.standards.title_2")}
              </h2>
              <p className="text-muted text-lg mb-8 max-w-md leading-relaxed">
                {t("home.standards.subtitle")}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/20 border-2 border-primary flex items-center justify-center backdrop-blur-sm"
                    >
                      <Star className="size-4 text-yellow-300 fill-yellow-300" />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {t("home.standards.trusted")}{" "}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors">
                <ShieldCheck className="size-8 mb-4 text-white" />
                <h3 className="font-bold text-lg mb-2 text-white">
                  {t("home.standards.items.warranty.title")}{" "}
                </h3>
                <p className="text-muted text-sm">
                  {t("home.standards.items.warranty.desc")}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors sm:translate-y-8">
                <Smartphone className="size-8 mb-4 text-white" />
                <h3 className="font-bold text-lg mb-2 text-white">
                  {t("home.standards.items.tracking.title")}
                </h3>
                <p className="text-muted text-sm">
                  {t("home.standards.items.tracking.desc")}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors">
                <Banknote className="size-8 mb-4 text-white" />
                <h3 className="font-bold text-lg mb-2 text-white">
                  {t("home.standards.items.transparent.title")}
                </h3>
                <p className="text-muted text-sm">
                  {t("home.standards.items.transparent.desc")}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-colors sm:translate-y-8">
                <Wrench className="size-8 mb-4 text-white" />
                <h3 className="font-bold text-lg mb-2 text-white">
                  {t("home.standards.items.technician.title")}
                </h3>
                <p className="text-muted text-sm">
                  {t("home.standards.items.technician.desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
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
    <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
      <CardContent className="pt-6 text-center flex flex-col items-center">
        <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default HomePage;
