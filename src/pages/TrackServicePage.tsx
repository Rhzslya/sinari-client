import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { ServiceStatus } from "@/enum/enum";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useServiceQueries } from "@/hooks/repair-queries";
import { isAxiosError } from "axios";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { format } from "date-fns";

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
    const match = message.match(/(\d+)/);
    cooldownSeconds = match ? parseInt(match[1]) : 60;
  }

  if (isLoading && !service) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-sm sm:text-base text-slate-500 font-medium tracking-wide"
        >
          {t("track_service.loading")}
        </motion.p>
      </div>
    );
  }

  if (isRateLimited && !service) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-slate-50 p-4">
        <RateLimitFallback
          seconds={cooldownSeconds}
          onRetry={() => void refetch()}
        />
      </div>
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

  const isCancelled = service.status === ServiceStatus.CANCELLED;
  const isFinished =
    service.status === ServiceStatus.TAKEN ||
    service.status === ServiceStatus.FINISHED;

  const steps = [
    {
      status: ServiceStatus.PENDING,
      label: t("track_service.steps.received"),
      icon: Clock,
    },
    {
      status: ServiceStatus.PROCESS,
      label: t("track_service.steps.repairing"),
      icon: RefreshCcw,
    },
    {
      status: ServiceStatus.FINISHED,
      label: t("track_service.steps.ready"),
      icon: ShieldCheck,
    },
    {
      status: ServiceStatus.TAKEN,
      label: t("track_service.steps.completed"),
      icon: CheckCircle2,
    },
  ];

  const currentStepIndex = isCancelled
    ? -1
    : steps.findIndex((s) => s.status === service.status);

  const downPayment = service.down_payment ?? 0;
  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const discountAmount = (subTotal * (service.discount ?? 0)) / 100;
  const grandTotal = isCancelled
    ? 0
    : Math.max(0, Math.round(subTotal - discountAmount - downPayment));

  const getStatusContent = () => {
    switch (service.status) {
      case ServiceStatus.PENDING:
        return {
          title: t("track_service.status.pending.title"),
          desc: t("track_service.status.pending.desc"),
          color: "from-blue-500 to-primary",
        };
      case ServiceStatus.PROCESS:
        return {
          title: t("track_service.status.process.title"),
          desc: t("track_service.status.process.desc"),
          color: "from-indigo-500 to-blue-600",
        };
      case ServiceStatus.FINISHED:
        return {
          title: t("track_service.status.finished.title"),
          desc: t("track_service.status.finished.desc"),
          color: "from-emerald-400 to-emerald-600",
        };
      case ServiceStatus.TAKEN:
        return {
          title: t("track_service.status.taken.title"),
          desc: t("track_service.status.taken.desc"),
          color: "from-teal-600 to-emerald-800",
        };
      case ServiceStatus.CANCELLED:
        return {
          title: t("track_service.status.cancelled.title"),
          desc: t("track_service.status.cancelled.desc"),
          color: "from-slate-700 to-slate-900",
        };
      default:
        return {
          title: service.status,
          desc: "",
          color: "from-primary to-blue-600",
        };
    }
  };

  const statusInfo = getStatusContent();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans selection:bg-primary/20">
      {/* Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50 px-4 py-3 sm:px-8 sm:py-4 flex justify-between items-center shadow-sm"
      >
        <Link to="/" className="flex items-center gap-2 sm:gap-3">
          <span className="font-black tracking-tighter text-lg sm:text-2xl text-slate-800">
            {storeData?.store_name || "SINARI"}
          </span>
        </Link>
        <div className="flex flex-col items-end">
          <span className="text-xs sm:text-sm font-mono font-bold text-slate-700 ">
            {service.service_id}
          </span>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(service.created_at), "dd MMM yyyy")}
          </span>
        </div>
      </motion.div>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6 sm:space-y-8"
      >
        {/* 1. Hero Card */}
        <motion.div
          variants={itemVariants}
          className={`relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 text-white shadow-2xl bg-linear-to-br ${statusInfo.color}`}
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] backdrop-blur-sm">
                  {t("track_service.current_status")}
                </span>
                <AnimatePresence>
                  {isRefetching && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                    >
                      <RefreshCcw className="w-4 h-4 animate-spin" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-white drop-shadow-md">
                {statusInfo.title}
              </h1>
              <p className="text-sm sm:text-base text-white/90 font-medium max-w-md leading-relaxed">
                {statusInfo.desc}
              </p>
            </div>

            {/* Icon Decoration */}
            <div className="hidden sm:flex items-center justify-center w-32 h-32 bg-white/10 rounded-full backdrop-blur-md">
              {isFinished ? (
                <ShieldCheck className="w-16 h-16 text-white" />
              ) : isCancelled ? (
                <AlertCircle className="w-16 h-16 text-white" />
              ) : (
                <RefreshCcw className="w-16 h-16 text-white animate-spin-slow" />
              )}
            </div>
          </div>

          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 top-10 w-32 h-32 bg-black/5 rounded-full blur-2xl pointer-events-none" />
        </motion.div>

        {/* 2. Timeline */}
        {!isCancelled && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm"
          >
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-400 mb-8 sm:mb-10 text-center sm:text-left">
              {t("track_service.repair_progress")}
            </h3>

            <div className="relative">
              <div className="absolute top-5 sm:top-6 -translate-y-1/2 left-8 right-8 sm:left-12 sm:right-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                  }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="absolute top-0 left-0 h-full bg-primary rounded-full origin-left"
                />
              </div>

              <div className="relative flex justify-between">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={idx}
                      className="relative z-10 flex flex-col items-center gap-3 w-16 sm:w-24"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-500 shadow-sm ${
                          isCompleted
                            ? "bg-primary text-white"
                            : "bg-white border-2 border-slate-100 text-slate-300"
                        } ${isCurrent ? "ring-4 ring-primary/20 scale-110" : ""}`}
                      >
                        <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                      <span
                        className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider text-center transition-colors duration-300 ${
                          isCompleted ? "text-slate-800" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {service.service_list.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm"
          >
            <div className="flex items-center gap-3 text-blue-600 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-slate-800">
                {t("track_service.repair_details")}
              </h3>
            </div>

            <div
              className="space-y-4 max-h-75 overflow-y-auto pr-2 
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-primary/20 
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-primary
              transition-colors"
            >
              {service.service_list.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm text-slate-400 font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <TruncatedTooltip
                      text={item.name}
                      className="text-sm sm:text-base font-semibold text-slate-700 truncate block"
                    />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base shrink-0">
                    {formatRupiah(item.price)}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 3. Info Grid (Device & Billing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Info */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col h-full min-w-0"
          >
            <div className="flex items-center gap-3 text-primary mb-4 sm:mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-slate-800">
                {t("track_service.device_info")}
              </h3>
            </div>

            <div className="min-w-0 flex-1 mb-6">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter truncate">
                {service.brand}
              </p>
              <TruncatedTooltip
                text={service.model}
                className="text-slate-500 font-medium text-sm sm:text-base block truncate mt-1"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center min-w-0 bg-slate-50/50 -mx-6 -mb-6 p-4 sm:px-6 rounded-b-3xl">
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                    {t("track_service.customer")}
                  </p>
                  <TruncatedTooltip
                    text={service.customer_name}
                    className="text-sm font-bold text-slate-800 truncate block"
                  />
                </div>
              </div>
            </div>
          </motion.div>
          {/* Billing Summary */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col h-full"
          >
            <div className="flex items-center gap-3 text-emerald-600 mb-4 sm:mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="font-bold uppercase text-xs tracking-widest text-slate-800">
                {t("track_service.billing_summary")}
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1">
              {/* Total Service */}
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-slate-500 font-medium">
                  {t("track_service.billing.total_service")}
                </span>
                <span className="font-bold text-slate-800">
                  {formatRupiah(subTotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-red-500 font-medium">
                    {t("track_service.billing.discount")} ({service.discount}%)
                  </span>
                  <span className="text-red-500 font-bold">
                    -{formatRupiah(discountAmount)}
                  </span>
                </div>
              )}

              {/* Down Payment */}
              {downPayment > 0 && (
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-emerald-600 font-medium">
                    {t("track_service.billing.down_payment")}
                  </span>
                  <span className="text-emerald-600 font-bold">
                    -{formatRupiah(downPayment)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-6 mt-4 border-t border-dashed border-slate-200 flex justify-between items-end">
              <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-widest pb-1">
                {t("track_service.billing.amount_due")}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-primary tracking-tighter">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </motion.div>
        </div>

        {service.description && (
          <motion.div
            variants={itemVariants}
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6"
          >
            {service.description && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t("track_service.customer_issue", "Customer Issue")}
                </h4>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {service.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 4. Warranty Notes */}
        <motion.div
          variants={itemVariants}
          className="bg-amber-50/80 border border-amber-200/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 relative z-10">
            <div className="bg-amber-200/50 p-3 rounded-2xl shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-700" />
            </div>
            <div className="space-y-4 sm:space-y-5 flex-1">
              <div className="space-y-1.5">
                <h4 className="font-black text-amber-900 text-sm sm:text-base uppercase tracking-widest">
                  {t("track_service.warranty.title")}
                </h4>
                <div className="h-0.5 w-full bg-amber-300 rounded-full" />
              </div>

              <ul className="space-y-3">
                {storeData?.warranty_text ? (
                  storeData.warranty_text.split("\n").map(
                    (line, index) =>
                      line.trim() && (
                        <li
                          key={index}
                          className="flex items-start gap-3 sm:gap-4 text-amber-900/80 text-xs sm:text-sm leading-relaxed group"
                        >
                          <span className="shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-200/80 text-amber-900 font-bold text-[10px] sm:text-xs mt-0.5 sm:mt-0 shadow-sm">
                            {index + 1}
                          </span>
                          <span className="flex-1 font-medium pt-0.5">
                            {line.replace(/^\d+\.\s*/, "")}
                          </span>
                        </li>
                      ),
                  )
                ) : (
                  <li className="flex gap-3 text-amber-800/80 text-xs sm:text-sm italic font-medium">
                    <span className="shrink-0 text-amber-500 font-bold">•</span>
                    <span>{t("track_service.warranty.default")}</span>
                  </li>
                )}
              </ul>

              <div className="pt-4 border-t border-amber-200/50">
                <p className="text-[10px] sm:text-xs text-amber-700/80 font-bold uppercase italic flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                  {t("track_service.warranty.footer")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="text-center py-8 sm:py-12 space-y-4 opacity-80 hover:opacity-100 transition-opacity"
        >
          <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">
            {storeData?.store_address}
          </p>
          <div className="flex justify-center gap-3">
            <div className="h-1 w-8 sm:w-12 bg-slate-200 rounded-full" />
            <div className="h-1 w-3 sm:w-4 bg-primary/50 rounded-full" />
            <div className="h-1 w-8 sm:w-12 bg-slate-200 rounded-full" />
          </div>
        </motion.footer>
      </motion.main>
    </div>
  );
}
