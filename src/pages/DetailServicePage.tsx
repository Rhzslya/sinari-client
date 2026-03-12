import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { ServiceStatus } from "@/enum/enum";
import type { ServiceResponse } from "@/model/repair-model";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  Copy,
  CreditCard,
  Edit,
  ExternalLink,
  Loader2,
  Phone,
  Printer,
  RefreshCw,
  Smartphone,
  Tag,
  Trash2,
  User,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import NotFoundPage from "./NotFoundPage";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditServiceForm } from "@/features/components/EditServiceForm";
import { UpdateStatusDialog } from "@/features/fragments/UpdateStatusForm";
import { pdf } from "@react-pdf/renderer";
import { ServiceInvoicePDF } from "@/features/components/ServiceInvoicePDF";
import DeleteServiceForm from "@/features/fragments/DeleteServiceForm";
import { useServiceQueries } from "@/hooks/repair-queries";
import { ServiceLogTimeline } from "@/features/fragments/ServiceLogTimeline";
import { useUserQueries } from "@/hooks/user-queries";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { ServiceDetailSkeleton } from "@/features/fragments/Skeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const DetailServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useDetail } = useServiceQueries();
  const { useGetSettings } = useStoreSettingQueries();

  const id = Number(serviceId);
  const { data: service, isLoading, isError } = useDetail({ id });

  const { data: settings } = useGetSettings();

  const userQueries = useUserQueries();

  const { data: currentUser } = userQueries.useProfile();
  const isOwner = currentUser?.role === "OWNER";

  const [selectedService, setSelectedService] =
    useState<ServiceResponse | null>(null);

  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDeleteServiceOpen, setIsDeleteServiceOpen] = useState(false);

  const isDeleteDisabled =
    service?.status !== ServiceStatus.CANCELLED &&
    service?.status !== ServiceStatus.TAKEN;

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "??";

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  const handleCopyToken = (token: string) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/services/track/${token}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success(t("services_management.detail.toast.token_copied"));
  };

  const handleEditServiceOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsEditServiceOpen(true);
  };

  const handleUpdateStatusOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsUpdateStatusOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!settings) {
      toast.error(t("services_management.detail.toast.settings_not_loaded"));
      return;
    }

    if (!service) {
      toast.error(t("services_management.detail.toast.service_not_loaded"));
      return;
    }

    const formattedSettings = {
      ...settings,
      store_email: settings.store_email || "",
      store_website: settings.store_website || "",
    };

    setIsGeneratingPdf(true);
    const toastId = toast.loading(
      t("services_management.detail.toast.generating_pdf"),
    );
    try {
      const blob = await pdf(
        <ServiceInvoicePDF service={service} settings={formattedSettings} />,
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${service.service_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t("services_management.detail.toast.pdf_downloaded"), {
        id: toastId,
      });
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error(t("services_management.detail.toast.pdf_failed"), {
        id: toastId,
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDeleteServiceOpen = (service: ServiceResponse) => {
    setSelectedService(service);
    setIsDeleteServiceOpen(true);
  };

  const getStatusBadge = (status: ServiceStatus) => {
    const styles = {
      [ServiceStatus.PENDING]:
        "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
      [ServiceStatus.PROCESS]:
        "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
      [ServiceStatus.FINISHED]:
        "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
      [ServiceStatus.TAKEN]:
        "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
      [ServiceStatus.CANCELLED]:
        "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
    };

    return (
      <Badge
        variant="outline"
        className={`inline-flex items-center justify-center leading-none h-5 sm:h-6 py-0 font-medium border px-2.5 text-[10px] sm:text-xs uppercase tracking-wider ${styles[status] || ""}`}
      >
        {status}
      </Badge>
    );
  };
  if (isLoading) {
    return <ServiceDetailSkeleton />;
  }
  if (isError || !service)
    return (
      <NotFoundPage
        isDashboard={true}
        id={serviceId}
        entityName={t("services_management.table.not_found_entity")}
        backUrl="/dashboard/services"
      />
    );

  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );

  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const discountAmount = (subTotal * (service.discount || 0)) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;

  const labelStyle =
    "text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1.5 sm:gap-2 tracking-wider";

  return (
    <>
      <motion.div
        className="space-y-4 sm:space-y-6 pb-10 overflow-x-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 sm:gap-4 w-full"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/services")}
            className="cursor-pointer shrink-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
              {t("services_management.detail.header_title")}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              {t("services_management.detail.header_subtitle")}{" "}
              {service.service_id}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          <div className="lg:col-span-2 flex flex-col h-full min-h-0">
            <motion.div
              variants={itemVariants}
              className="flex-1 flex flex-col min-h-0"
            >
              <Card className="flex-1 flex flex-col shadow-sm min-h-0">
                <CardHeader className="pb-6 sm:pb-8 border-b shrink-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Avatar className="w-14 h-14 sm:w-20 sm:h-20 outline-2 outline-offset-2 outline-primary/20 shadow-sm shrink-0">
                      <AvatarFallback className="text-xl sm:text-2xl font-bold text-primary bg-primary/5 border border-primary/10">
                        {getInitials(service.customer_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg sm:text-xl text-primary truncate pr-2">
                        <TruncatedTooltip
                          text={service.customer_name}
                          className="max-w-50 sm:max-w-150"
                        />
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1.5 sm:gap-2 mt-1 text-xs sm:text-sm">
                        <Phone className="w-3.5 h-3.5 shrink-0" />{" "}
                        <span className="truncate">{service.phone_number}</span>
                      </CardDescription>
                      <div className="mt-2 flex gap-2">
                        {getStatusBadge(service.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="-mt-4 sm:-mt-2 flex-1 flex flex-col min-h-0">
                  <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 shrink-0 relative z-10">
                    <div className="space-y-1 sm:space-y-1.5">
                      <label className={labelStyle}>
                        <Smartphone className="w-3.5 h-3.5" />{" "}
                        {t("services_management.detail.device_card.device")}
                      </label>
                      <div className="font-medium flex items-center gap-1.5 sm:gap-2 min-w-0 text-xs sm:text-sm">
                        <span className="whitespace-nowrap shrink-0">
                          {service.brand}
                        </span>
                        <span className="shrink-0">-</span>
                        <TruncatedTooltip
                          text={service.model}
                          className="truncate min-w-0"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <label className={labelStyle}>
                        <Tag className="w-3.5 h-3.5" />{" "}
                        {t("services_management.detail.device_card.service_id")}
                      </label>
                      <div className="inline-flex items-center justify-center font-medium font-mono text-[10px] sm:text-sm leading-none bg-muted/50 px-2 py-1 sm:py-1.5 rounded border">
                        {service.service_id}
                      </div>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5 md:col-span-2">
                      <label className={labelStyle}>
                        <ClipboardList className="w-3.5 h-3.5" />{" "}
                        {t(
                          "services_management.detail.device_card.problem_desc",
                        )}
                      </label>
                      <div className="font-medium bg-muted/30 p-3 sm:p-4 rounded-md border text-xs sm:text-sm mt-1 w-full max-w-full wrap-break-word whitespace-pre-wrap leading-relaxed">
                        {service.description ||
                          t(
                            "services_management.detail.device_card.no_description",
                          )}
                      </div>
                    </div>
                  </div>

                  <Card className="flex-1 flex flex-col mt-4 sm:mt-6 border shadow-sm overflow-hidden min-h-0">
                    <CardHeader className="py-3 sm:py-4 border-b shrink-0">
                      <CardTitle className="text-base sm:text-xl flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />{" "}
                        {t("services_management.detail.cost_card.title")}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0 mt-2 sm:mt-6 flex-1 flex flex-col min-h-0">
                      <div
                        className="flex-1 overflow-y-auto overflow-x-auto min-h-37.5 px-4 sm:px-6 pb-6 
                          [&::-webkit-scrollbar]:w-1
                          [&::-webkit-scrollbar]:h-1
                          [&::-webkit-scrollbar-track]:bg-transparent
                          [&::-webkit-scrollbar-thumb]:bg-primary/20 
                          [&::-webkit-scrollbar-thumb]:rounded-full
                          hover:[&::-webkit-scrollbar-thumb]:bg-primary
                          transition-colors"
                      >
                        <table className="w-full min-w-87.5 text-[10px] sm:text-sm text-left">
                          <thead className="text-foreground font-medium border-b sticky top-0 z-10 bg-primary text-sm">
                            <tr>
                              <th className="px-4 sm:px-6 py-2 sm:py-3 w-10 sm:w-12 text-center">
                                #
                              </th>
                              <th className="px-4 sm:px-6 py-2 sm:py-3">
                                {t(
                                  "services_management.detail.cost_card.th_service_name",
                                )}
                              </th>
                              <th className="px-4 sm:px-6 py-2 sm:py-3 text-right">
                                {t(
                                  "services_management.detail.cost_card.th_cost",
                                )}
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y text-base">
                            {service.service_list.map((item, index) => (
                              <tr key={item.id} className="hover:bg-muted/5">
                                <td className="px-4 sm:px-6 py-2 sm:py-3 text-center text-muted-foreground">
                                  {index + 1}
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-3 font-medium">
                                  <div
                                    className="truncate max-w-37.5 sm:max-w-150 text-sm"
                                    title={item.name}
                                  >
                                    {item.name}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-2 sm:py-3 text-right font-mono">
                                  {formatRupiah(item.price)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className=" border-t mt-auto px-4 sm:px-5 py-3 sm:py-4 shrink-0">
                        <table className="w-full md:w-1/2 lg:w-1/3 ml-auto text-[10px] sm:text-sm">
                          <tfoot className="font-medium">
                            <tr>
                              <td className="px-2 sm:px-6 py-1.5 sm:py-2 text-left text-muted-foreground">
                                {t(
                                  "services_management.detail.cost_card.subtotal",
                                )}
                              </td>
                              <td className="px-2 sm:px-6 py-1.5 sm:py-2 text-right font-mono w-fit whitespace-nowrap">
                                {formatRupiah(subTotal)}
                              </td>
                            </tr>

                            {discountAmount > 0 && (
                              <tr className="text-emerald-600">
                                <td className="px-2 sm:px-6 py-1 sm:py-1.5 text-left">
                                  <span className="font-bold">
                                    {t(
                                      "services_management.detail.cost_card.disc",
                                    )}{" "}
                                    ({service.discount}%)
                                  </span>
                                </td>
                                <td className="px-2 sm:px-6 py-1 sm:py-1.5 text-right font-mono whitespace-nowrap">
                                  <span>- {formatRupiah(discountAmount)}</span>
                                </td>
                              </tr>
                            )}

                            {downPayment > 0 && (
                              <tr className="text-blue-600">
                                <td className="px-2 sm:px-6 py-1 sm:py-1.5 text-left">
                                  {t(
                                    "services_management.detail.cost_card.down_payment",
                                  )}
                                </td>
                                <td className="px-2 sm:px-6 py-1 sm:py-1.5 text-right font-mono whitespace-nowrap">
                                  - {formatRupiah(downPayment)}
                                </td>
                              </tr>
                            )}

                            <tr
                              className={
                                isCancelled
                                  ? ""
                                  : "bg-primary/5 border-t border-primary/10"
                              }
                            >
                              <td className="px-2 sm:px-6 py-2 sm:py-3 text-left font-bold">
                                <span
                                  className={`uppercase ${isCancelled ? "text-red-600" : ""}`}
                                >
                                  {isCancelled
                                    ? t(
                                        "services_management.detail.cost_card.cancelled",
                                      )
                                    : t(
                                        "services_management.detail.cost_card.total_due",
                                      )}
                                </span>
                              </td>
                              <td className="px-2 sm:px-6 py-2 sm:py-3 text-right text-sm sm:text-lg font-bold font-mono text-primary whitespace-nowrap">
                                <span
                                  className={
                                    isCancelled
                                      ? "line-through text-muted-foreground text-[10px] sm:text-base"
                                      : ""
                                  }
                                >
                                  {formatRupiah(Math.max(0, grandTotal))}
                                </span>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-4 sm:space-y-6 flex flex-col h-full">
            <motion.div variants={itemVariants}>
              <Card className="bg-muted/40 h-fit shadow-sm border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("services_management.detail.quick_actions.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2.5 sm:gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={() => handleEditServiceOpen(service)}
                  >
                    <Edit className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />{" "}
                    <span className="truncate">
                      {t(
                        "services_management.detail.quick_actions.edit_service",
                      )}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={() => handleUpdateStatusOpen(service)}
                  >
                    <RefreshCw className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 shrink-0" />{" "}
                    <span className="truncate">
                      {t(
                        "services_management.detail.quick_actions.update_status",
                      )}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPdf}
                  >
                    {isGeneratingPdf ? (
                      <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin shrink-0" />
                    ) : (
                      <Printer className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                    )}
                    <span className="truncate">
                      {isGeneratingPdf
                        ? t("services_management.action_menu.generating_pdf")
                        : t(
                            "services_management.detail.quick_actions.download_pdf",
                          )}
                    </span>
                  </Button>

                  {isOwner && (
                    <>
                      <Separator className="my-0.5 sm:my-1" />
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                        onClick={() => handleDeleteServiceOpen(service)}
                        disabled={isDeleteDisabled}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />{" "}
                        <span className="truncate">
                          {t(
                            "services_management.detail.quick_actions.delete_service",
                          )}
                        </span>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-fit shadow-sm">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />{" "}
                    {t("services_management.detail.technician_card.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 sm:space-y-6">
                  {service.technician ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12  outline-2 outline-offset-2 outline-primary/20 shadow-sm shrink-0">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${service.technician.name}&fontSize=45&fontFamily=Helvetica&fontWeight=500`}
                          />
                          <AvatarFallback className="text-sm sm:text-base font-bold text-primary bg-primary/5 border border-primary/10">
                            {getInitials(service.technician.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden min-w-0 flex-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="text-sm sm:text-base font-bold leading-none flex-1 min-w-0 truncate">
                              {service.technician.name}
                            </div>
                            {!service.technician.is_active && (
                              <span className="text-[9px] sm:text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">
                                {t(
                                  "services_management.detail.technician_card.inactive",
                                )}
                              </span>
                            )}
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[9px] sm:text-[10px] h-4 sm:h-5 px-1 mt-1 font-mono"
                          >
                            #{service.technician.id}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {t(
                            "services_management.detail.technician_card.signature",
                          )}
                        </p>
                        <div className="rounded-md border-2 border-dashed border-muted bg-muted/10 p-3 sm:p-4 flex items-center justify-center min-h-15 sm:min-h-20">
                          {service.technician.signature_url ? (
                            <img
                              src={service.technician.signature_url}
                              alt="Signature"
                              className="h-10 sm:h-12 object-contain"
                            />
                          ) : (
                            <span className="text-[10px] sm:text-xs text-muted-foreground italic">
                              {t(
                                "services_management.detail.technician_card.no_signature",
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Internal Note */}
                      <div className="space-y-1.5 sm:space-y-2">
                        <span className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                          <Wrench className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />{" "}
                          {t(
                            "services_management.detail.technician_card.internal_note",
                          )}
                        </span>

                        <div className="text-[10px] sm:text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 p-2.5 sm:p-3 rounded border border-amber-100 dark:border-amber-800 w-full max-h-32 overflow-y-auto wrap-break-word whitespace-pre-wrap">
                          {service.technician_note ? (
                            service.technician_note
                          ) : (
                            <span className="italic opacity-70">
                              {t(
                                "services_management.detail.technician_card.no_note",
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 sm:py-6 text-muted-foreground">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-xs sm:text-sm">
                        {t(
                          "services_management.detail.technician_card.unassigned",
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex-1 flex flex-col"
            >
              <Card className="flex-1 shadow-sm flex flex-col">
                <CardHeader className="pb-3 sm:pb-4 shrink-0">
                  <CardTitle className="text-sm sm:text-base flex gap-2 items-center">
                    <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />{" "}
                    {t("services_management.detail.system_info.title")}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4 sm:p-6 pt-0 sm:pt-0">
                  <div className="space-y-5 sm:space-y-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1 tracking-wider">
                        <ClipboardList className="w-3.5 h-3.5" />{" "}
                        {t(
                          "services_management.detail.system_info.tracking_token",
                        )}
                      </label>
                      <code className="block w-full bg-muted/50 border px-3 py-2 sm:py-2.5 rounded text-[10px] sm:text-xs font-mono text-center tracking-widest select-all">
                        {service.tracking_token}
                      </code>
                    </div>

                    <Separator />

                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                        {t("services_management.detail.system_info.created_at")}
                      </label>
                      <p className="font-medium text-xs sm:text-sm border-b pb-1.5 sm:pb-2">
                        {formatDate(service.created_at)}
                      </p>
                    </div>

                    <div className="space-y-1 sm:space-y-1.5">
                      <label className="text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                        {t(
                          "services_management.detail.system_info.last_updated",
                        )}
                      </label>
                      <p className="font-medium text-xs sm:text-sm border-b pb-1.5 sm:pb-2">
                        {formatDate(service.updated_at)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1 sm:pt-2">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${service.updated_at === service.created_at ? "bg-slate-300 dark:bg-slate-600" : "bg-emerald-500 animate-pulse"}`}
                      ></div>
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                        {service.updated_at === service.created_at
                          ? t(
                              "users_management.detail.system_time.no_modifications",
                              { defaultValue: "No modifications yet" },
                            )
                          : t(
                              "users_management.detail.system_time.data_modified",
                              { defaultValue: "Data has been modified" },
                            )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="bg-muted/20 border border-dashed border-border/60 rounded-xl p-4 flex flex-col gap-3.5">
                      <div className="space-y-1 text-center">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-foreground flex items-center justify-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-primary" />
                          {t(
                            "services_management.detail.system_info.live_tracking",
                            { defaultValue: "Customer Live Tracking" },
                          )}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight px-2">
                          {t(
                            "services_management.detail.system_info.tracking_desc",
                            {
                              defaultValue:
                                "Share link with customer to track service status.",
                            },
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full h-8 sm:h-9 text-[10px] sm:text-xs cursor-pointer shadow-sm text-foreground duration-300"
                          onClick={() =>
                            handleCopyToken(service.tracking_token)
                          }
                        >
                          <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                          {t("common.copy_link", { defaultValue: "Copy Link" })}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-8 sm:h-9 text-[10px] sm:text-xs cursor-pointer bg-background shadow-sm duration-300"
                          onClick={() =>
                            window.open(
                              `/services/track/${service.tracking_token}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
                          {t("common.open_link", { defaultValue: "Open Page" })}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {isOwner && (
          <motion.div variants={itemVariants}>
            <ServiceLogTimeline serviceId={service.id} />
          </motion.div>
        )}
      </motion.div>

      {/* DIALOGS & SHEETS */}
      <Sheet open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <SheetContent
          className="flex flex-col h-full p-0 gap-0 sm:max-w-xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b">
            <SheetTitle
              className="text-lg sm:text-xl text-primary outline-none"
              tabIndex={-1}
            >
              {t("services_management.sheet.edit_title")}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {t("services_management.sheet.edit_desc")}
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 overflow-x-hidden p-1">
            {selectedService && (
              <EditServiceForm
                service={selectedService}
                onSuccess={() => {
                  setIsEditServiceOpen(false);
                }}
                onCancel={() => setIsEditServiceOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <UpdateStatusDialog
        service={selectedService}
        open={isUpdateStatusOpen}
        onOpenChange={setIsUpdateStatusOpen}
        onSuccess={() => {
          setIsUpdateStatusOpen(false);
        }}
      />

      <DeleteServiceForm
        open={isDeleteServiceOpen}
        onOpenChange={setIsDeleteServiceOpen}
        service={selectedService}
        onSuccess={() => {
          setIsDeleteServiceOpen(false);
          navigate("/dashboard/services");
        }}
      />
    </>
  );
};

export default DetailServicePage;
