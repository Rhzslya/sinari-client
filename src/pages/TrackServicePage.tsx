import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { ServiceStatus } from "@/enum/product-enum";
import { format } from "date-fns";
import { Globe, Loader2, MapPin, Phone, RefreshCcw } from "lucide-react";
import { useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useServiceQueries } from "@/hooks/repair-queries";
import { isAxiosError } from "axios";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import RateLimitBanner from "@/features/fragments/RateLimitBanner";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const PDF_COLORS = {
  primary: "#ef473a",
  dark: "#1e293b",
  muted: "#64748b",
  warning: "#f59e0b",
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stampAnimation: Variants = {
  hidden: { opacity: 0, scale: 2, rotate: -20 },
  visible: {
    opacity: 0.8,
    scale: 1,
    rotate: -6,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.5 },
  },
};

export default function TrackServicePage() {
  const { t } = useTranslation();
  const { identifier } = useParams<{ identifier: string }>();
  const { useTrackPublic } = useServiceQueries();
  const { useGetSettings } = useStoreSettingQueries();

  const {
    data: service,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTrackPublic({ identifier });

  const { data: storeData } = useGetSettings();

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;
  let cooldownSeconds = 60;

  if (isRateLimited) {
    const message = error.response?.data?.errors || "";
    const match = message.match(/(\d+)(?:s| seconds)/);
    cooldownSeconds = match ? parseInt(match[1]) : 60;
  }

  if (isLoading && !service) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-gray-100 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        <p className="text-sm text-slate-500 font-medium animate-pulse">
          {t("track_service.loading")}
        </p>
      </div>
    );
  }

  if (isRateLimited && !service) {
    return (
      <RateLimitFallback
        seconds={cooldownSeconds}
        onRetry={() => void refetch()}
      />
    );
  }

  if (!service) {
    return (
      <NotFoundPage
        entityName={t("track_service.not_found_entity")}
        id={identifier}
        backUrl="/"
        variant="glass"
      />
    );
  }

  const storeName = storeData?.store_name || "SINARI CELL";
  const storeAddress = storeData?.store_address || "Tangerang Selatan";
  const storePhone = storeData?.store_phone || "0812-3456-7890";
  const storeWebsite = storeData?.store_website || "";
  const warrantyText = storeData?.warranty_text || "";
  const paymentInfo = storeData?.payment_info || "";

  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const discountAmount = (subTotal * (service.discount || 0)) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;

  return (
    <div className="min-h-dvh bg-gray-100/80 p-4 sm:p-6 md:p-8 flex flex-col items-center py-10 font-sans overflow-hidden">
      <AnimatePresence>
        {isRateLimited && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mb-4"
          >
            <RateLimitBanner
              seconds={cooldownSeconds}
              onRetry={() => void refetch()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Refetching Indicator */}
      {isRefetching && !isRateLimited && (
        <div className="w-full max-w-2xl mb-4 flex items-center justify-center gap-2 text-sm text-slate-500 animate-pulse">
          <RefreshCcw className="h-4 w-4 animate-spin" />
          <p>{t("track_service.updating")}</p>
        </div>
      )}

      {/* INVOICE CONTAINER */}
      <motion.div
        className="w-full max-w-2xl bg-white sm:rounded-xl shadow-2xl min-h-37.5 flex flex-col relative overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Aksen atas agar terlihat seperti kertas */}
        <div
          className="absolute top-0 left-0 w-full h-1.5"
          style={{ backgroundColor: PDF_COLORS.primary }}
        />

        {/* 1. HEADER SECTION */}
        <motion.div variants={fadeInUp} className="p-5 sm:p-8 pb-2 mt-2">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-black tracking-tight"
                style={{ color: PDF_COLORS.dark }}
              >
                {storeName.toUpperCase()}
              </h1>
              <p
                className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold"
                style={{ color: PDF_COLORS.muted }}
              >
                {t("track_service.invoice.subtitle")}
              </p>
            </div>

            {/* Status Stamp */}
            <motion.div className="text-right" variants={stampAnimation}>
              <div
                className="border-2 px-3 sm:px-4 py-1 sm:py-1.5 inline-block"
                style={{ borderColor: PDF_COLORS.dark }}
              >
                <span
                  className="text-xs sm:text-sm font-black uppercase tracking-widest"
                  style={{ color: PDF_COLORS.dark }}
                >
                  {service.status.replace("_", " ")}
                </span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div
              className="h-3 sm:h-4 flex-1 rounded-r-full"
              style={{ backgroundColor: PDF_COLORS.primary }}
            ></div>
            <h2
              className="text-lg sm:text-xl font-bold tracking-widest uppercase shrink-0"
              style={{ color: PDF_COLORS.dark }}
            >
              {t("track_service.invoice.title")}
            </h2>
            <div
              className="h-3 w-3 sm:h-4 sm:w-4 rounded-full shrink-0"
              style={{ backgroundColor: PDF_COLORS.primary }}
            ></div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 text-sm mb-4">
            <div className="flex-1 space-y-1.5 min-w-0 bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
              <p
                className="font-bold text-xs uppercase tracking-wider mb-2"
                style={{ color: PDF_COLORS.primary }}
              >
                {t("track_service.invoice.info_to")}
              </p>
              <TruncatedTooltip
                text={service.customer_name}
                className="font-bold uppercase truncate text-[#1e293b] text-sm sm:text-base block"
              />
              <p
                className="text-xs sm:text-sm font-medium"
                style={{ color: PDF_COLORS.muted }}
              >
                {service.phone_number}
              </p>
              <div
                className="flex flex-wrap items-center text-xs sm:text-sm pt-1 mt-2 border-t border-slate-200"
                style={{ color: PDF_COLORS.dark }}
              >
                <span className="font-bold shrink-0 mr-1">{service.brand}</span>
                <span className="shrink-0 mr-1 text-slate-400">-</span>
                <div className="min-w-0">
                  <TruncatedTooltip
                    text={service.model}
                    className="truncate text-[#64748b] font-medium block"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-2 sm:space-y-3 justify-center flex flex-col p-2 sm:p-0">
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span
                  className="font-bold text-xs sm:text-sm"
                  style={{ color: PDF_COLORS.dark }}
                >
                  {t("track_service.invoice.inv_no")}
                </span>
                <span
                  className="text-xs sm:text-sm font-mono font-semibold"
                  style={{ color: PDF_COLORS.muted }}
                >
                  {service.service_id}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span
                  className="font-bold text-xs sm:text-sm"
                  style={{ color: PDF_COLORS.dark }}
                >
                  {t("track_service.invoice.date")}
                </span>
                <span
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: PDF_COLORS.muted }}
                >
                  {format(new Date(service.created_at), "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-1.5">
                <span
                  className="font-bold text-xs sm:text-sm"
                  style={{ color: PDF_COLORS.dark }}
                >
                  {t("track_service.invoice.technician")}
                </span>
                <span
                  className="text-xs sm:text-sm font-medium"
                  style={{ color: PDF_COLORS.muted }}
                >
                  {service.technician?.name || "-"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. TABLE SECTION */}
        <motion.div variants={fadeInUp} className="px-5 sm:px-8 mb-6 sm:mb-8">
          <div className="w-full rounded-lg overflow-hidden border border-slate-200">
            <div
              className="flex text-[10px] sm:text-xs font-bold py-2.5 px-3 uppercase text-white"
              style={{ backgroundColor: PDF_COLORS.dark }}
            >
              <div className="w-8 sm:w-10 text-center shrink-0">
                {t("track_service.invoice.table.no")}
              </div>
              <div className="flex-1 px-2">
                {t("track_service.invoice.table.desc")}
              </div>
              <div className="w-20 sm:w-28 text-right shrink-0">
                {t("track_service.invoice.table.price")}
              </div>
            </div>

            <div className="text-xs sm:text-sm">
              {service.service_list.map((item, index) => (
                <div
                  key={index}
                  className={`flex py-2.5 px-3 border-b border-gray-100 last:border-0 hover:bg-slate-50 transition-colors ${
                    index % 2 !== 0 ? "bg-slate-50/50" : "bg-white"
                  }`}
                >
                  <div
                    className="w-8 sm:w-10 text-center shrink-0 font-medium pt-0.5"
                    style={{ color: PDF_COLORS.muted }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0 px-2">
                    <TruncatedTooltip
                      text={item.name}
                      className={`font-medium block ${
                        isCancelled
                          ? "line-through text-gray-400"
                          : "text-[#1e293b]"
                      }`}
                    />
                  </div>
                  <div
                    className={`w-20 sm:w-28 text-right font-semibold shrink-0 pt-0.5 ${
                      isCancelled
                        ? "text-gray-400 line-through"
                        : "text-[#1e293b]"
                    }`}
                  >
                    {formatRupiah(item.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3. FOOTER SECTION */}
        <motion.div
          variants={fadeInUp}
          className="px-5 sm:px-8 flex flex-col-reverse md:flex-row gap-8 mb-8 flex-1"
        >
          {/* Terms & Payment */}
          <div
            className="flex-1 text-[10px] sm:text-xs space-y-3 sm:space-y-4 bg-slate-50 p-4 sm:p-5 rounded-lg border border-slate-100"
            style={{ color: PDF_COLORS.muted }}
          >
            <div>
              <p
                className="font-bold uppercase tracking-wider mb-1"
                style={{ color: PDF_COLORS.dark }}
              >
                {t("track_service.invoice.footer.terms")}
              </p>
              <div className="whitespace-pre-wrap leading-relaxed text-[10px]">
                {warrantyText}
              </div>
            </div>

            <div>
              <p
                className="font-bold uppercase tracking-wider mb-1"
                style={{ color: PDF_COLORS.dark }}
              >
                {t("track_service.invoice.footer.payment")}
              </p>
              <div className="whitespace-pre-wrap leading-relaxed">
                {paymentInfo}
              </div>
            </div>
          </div>

          {/* Totals & Signature */}
          <div className="w-full md:w-64 text-xs sm:text-sm space-y-2.5">
            <div className="flex justify-between items-center px-1">
              <span className="font-bold text-slate-500">
                {t("track_service.invoice.footer.subtotal")}
              </span>
              <span
                className={`font-semibold ${isCancelled ? "line-through text-slate-400" : "text-slate-700"}`}
              >
                {formatRupiah(subTotal)}
              </span>
            </div>

            {!isCancelled && discountAmount > 0 && (
              <div className="flex justify-between items-center px-1 text-red-500">
                <span className="font-bold">
                  {t("track_service.invoice.footer.discount")} (
                  {service.discount}%)
                </span>
                <span className="font-semibold">
                  - {formatRupiah(discountAmount)}
                </span>
              </div>
            )}

            {downPayment > 0 && (
              <div className="flex justify-between items-center px-1 text-emerald-600">
                <span className="font-bold">
                  {t("track_service.invoice.footer.dp")}
                </span>
                <span className="font-semibold">
                  - {formatRupiah(downPayment)}
                </span>
              </div>
            )}

            <div
              className="text-white p-3 sm:p-4 rounded-lg flex justify-between items-center mt-3 shadow-md"
              style={{
                backgroundColor: isCancelled
                  ? PDF_COLORS.muted
                  : PDF_COLORS.primary,
              }}
            >
              <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                {isCancelled
                  ? t("track_service.invoice.footer.amount_due")
                  : t("track_service.invoice.footer.total_due")}
              </span>
              <span className="font-black text-base sm:text-lg tracking-tight">
                {formatRupiah(Math.max(0, grandTotal))}
              </span>
            </div>

            {isCancelled && downPayment > 0 && (
              <div className="mt-3 border-2 border-dashed border-red-200 bg-red-50 p-3 rounded-lg text-xs leading-relaxed text-red-800">
                <div className="flex items-center gap-1.5 mb-1.5 font-bold">
                  <RefreshCcw className="w-4 h-4" />
                  <span>{t("track_service.invoice.footer.refund_notice")}</span>
                </div>
                <p>
                  {t("track_service.invoice.footer.refund_msg", {
                    amount: formatRupiah(downPayment),
                  })}
                </p>
              </div>
            )}

            {/* Signature Box */}
            <div className="pt-6 sm:pt-8 text-center mt-auto">
              <div className="h-16 flex items-end justify-center mb-2">
                {service.technician?.signature_url ? (
                  <img
                    src={service.technician.signature_url}
                    alt="Signature"
                    className="max-h-full max-w-[80%] object-contain opacity-80 mix-blend-multiply"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="h-full w-full"></div>
                )}
              </div>

              <div
                className="border-b-2 w-3/4 mx-auto mb-1.5"
                style={{ borderColor: PDF_COLORS.dark }}
              ></div>

              <p
                className="text-[10px] sm:text-xs font-bold uppercase tracking-widest"
                style={{ color: PDF_COLORS.dark }}
              >
                {service.technician?.name ||
                  t("track_service.invoice.footer.authorized_sign")}
              </p>

              {service.technician?.name && (
                <p className="text-[8px] sm:text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                  Technician
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* 4. BOTTOM BAR */}
        <motion.div
          variants={fadeInUp}
          className="mt-auto py-3.5 bg-slate-800 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[10px] sm:text-xs px-4 w-full text-slate-300"
        >
          {storePhone && (
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="whitespace-nowrap font-medium tracking-wider">
                {storePhone}
              </span>
            </span>
          )}

          {storeAddress && (
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span
                className="truncate max-w-37.5 sm:max-w-xs font-medium tracking-wider"
                title={storeAddress}
              >
                {storeAddress}
              </span>
            </span>
          )}

          {storeWebsite && (
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="whitespace-nowrap font-medium tracking-wider">
                {storeWebsite}
              </span>
            </span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
