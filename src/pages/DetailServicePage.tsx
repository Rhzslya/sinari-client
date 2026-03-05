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
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { ServiceStatus } from "@/enum/product-enum";
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

  //Edit Service States
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);

  //Update Status States
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);

  //Print Invoice States
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  //Delete Service States
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

    // FIX TYPESCRIPT ERROR: Mapping the data
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
        className={`font-medium border px-2.5 py-0.5 text-xs ${styles[status] || ""}`}
      >
        {status}
      </Badge>
    );
  };

  if (isLoading) return <DetailServiceSkeleton />;
  if (isError)
    return (
      <NotFoundPage
        isDashboard={true}
        id={serviceId}
        entityName={t("services_management.table.not_found_entity")}
        backUrl="/dashboard/services"
      />
    );
  if (!service) return null;

  // Financial Calculations
  const subTotal = service.service_list.reduce(
    (acc, item) => acc + item.price,
    0,
  );

  const isCancelled = service.status === ServiceStatus.CANCELLED;

  const discountAmount = (subTotal * (service.discount || 0)) / 100;
  const downPayment = service.down_payment || 0;
  const grandTotal = isCancelled ? 0 : subTotal - discountAmount - downPayment;

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 ">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/services")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t("services_management.detail.header_title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("services_management.detail.header_subtitle")}{" "}
              {service.service_id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-fr">
          <div className="xl:col-span-2 space-y-6">
            <Card className="h-full flex flex-col">
              <CardHeader className="bg-muted/10 pb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border-2 border-background shadow-sm">
                    <AvatarFallback className="text-3xl font-bold text-foreground bg-primary border-3 border-foreground">
                      {getInitials(service.customer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl text-primary">
                      <TruncatedTooltip
                        text={service.customer_name}
                        className="max-w-100"
                      />
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Phone className="w-3.5 h-3.5" /> {service.phone_number}
                    </CardDescription>
                    <div className="mt-2 flex gap-2">
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="-mt-4">
                <div className="bg-card border rounded-lg p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2">
                      <Smartphone className="w-3.5 h-3.5" />{" "}
                      {t("services_management.detail.device_card.device")}
                    </label>
                    <div className="font-medium flex items-center gap-2 min-w-0">
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

                  <div className="space-y-1">
                    <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" />{" "}
                      {t("services_management.detail.device_card.service_id")}
                    </label>
                    <div className="font-medium font-mono text-sm bg-muted/50 w-fit px-2 py-0.5 rounded border">
                      {service.service_id}
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2">
                      <ClipboardList className="w-3.5 h-3.5" />{" "}
                      {t("services_management.detail.device_card.problem_desc")}
                    </label>
                    <div className="font-medium bg-muted/30 p-3 rounded-md border text-sm mt-1">
                      <TruncatedTooltip
                        text={
                          service.description ||
                          t(
                            "services_management.detail.device_card.no_description",
                          )
                        }
                        className="truncate min-w-0"
                      />
                    </div>
                  </div>
                </div>

                <Card className="flex flex-col mt-6 border shadow-sm overflow-hidden">
                  <CardHeader className="bg-muted/5 py-4 border-b">
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-primary" />{" "}
                      {t("services_management.detail.cost_card.title")}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div
                      className="max-h-75 flex-1 overflow-y-auto px-6 pb-6 
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar]:h-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
                    >
                      <table className="w-full text-sm text-left">
                        <thead className="text-foreground font-medium border-b sticky top-0 z-10 bg-primary">
                          <tr>
                            <th className="px-6 py-3 w-12 text-center">#</th>
                            <th className="px-6 py-3">
                              {t(
                                "services_management.detail.cost_card.th_service_name",
                              )}
                            </th>
                            <th className="px-6 py-3 text-right">
                              {t(
                                "services_management.detail.cost_card.th_cost",
                              )}
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y">
                          {service.service_list.map((item, index) => (
                            <tr key={item.id} className="hover:bg-muted/5">
                              <td className="px-6 py-3 text-center text-muted-foreground">
                                {index + 1}
                              </td>
                              <td className="px-6 py-3 font-medium">
                                <TruncatedTooltip
                                  text={item.name}
                                  className="truncate max-w-170"
                                />
                              </td>
                              <td className="px-6 py-3 text-right font-mono">
                                {formatRupiah(item.price)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-muted/5 border-t mt-auto px-5 py-4">
                      <table className="w-full md:w-1/3 ml-auto text-sm ">
                        <tfoot className="font-medium">
                          <tr>
                            <td className="px-6 py-2 text-left text-sm text-muted-foreground">
                              {t(
                                "services_management.detail.cost_card.subtotal",
                              )}
                            </td>
                            <td className="px-6 py-2 text-right font-mono text-sm w-fit whitespace-nowrap">
                              {formatRupiah(subTotal)}
                            </td>
                          </tr>

                          {discountAmount > 0 && (
                            <tr className="text-emerald-600">
                              <td className="px-6 py-1 text-left text-sm">
                                <span className="font-bold">
                                  {t(
                                    "services_management.detail.cost_card.disc",
                                  )}{" "}
                                  ({service.discount}%)
                                </span>
                              </td>
                              <td className="px-6 py-1 text-right font-mono text-sm whitespace-nowrap">
                                <span>- {formatRupiah(discountAmount)}</span>
                              </td>
                            </tr>
                          )}

                          {downPayment > 0 && (
                            <tr className="text-blue-600">
                              <td className="px-6 py-1 text-left text-sm">
                                {t(
                                  "services_management.detail.cost_card.down_payment",
                                )}
                              </td>
                              <td className="px-6 py-1 text-right font-mono text-sm whitespace-nowrap">
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
                            <td className="px-6 py-3 text-left text-sm font-bold">
                              <span
                                className={`font-bold uppercase ${isCancelled ? "text-red-600" : ""}`}
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
                            <td className="px-6 py-3 text-right text-lg font-bold font-mono text-primary whitespace-nowrap">
                              <span
                                className={
                                  isCancelled
                                    ? "line-through text-muted-foreground text-base"
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
          </div>

          <div className="space-y-6">
            <Card className="bg-muted/40 h-fit">
              <CardHeader>
                <CardTitle className="text-base">
                  {t("services_management.detail.quick_actions.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start duration-300 cursor-pointer"
                  onClick={() => handleEditServiceOpen(service)}
                >
                  <Edit className="mr-2 h-4 w-4" />{" "}
                  {t("services_management.detail.quick_actions.edit_service")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start duration-300 cursor-pointer"
                  onClick={() => handleUpdateStatusOpen(service)}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />{" "}
                  {t("services_management.detail.quick_actions.update_status")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start duration-300 cursor-pointer"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPdf}
                >
                  <Printer className="mr-2 h-4 w-4" />{" "}
                  {isGeneratingPdf
                    ? t("services_management.action_menu.generating_pdf")
                    : t(
                        "services_management.detail.quick_actions.download_pdf",
                      )}
                </Button>

                {isOwner && (
                  <>
                    <Separator />
                    <Button
                      variant="outline"
                      className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer"
                      onClick={() => handleDeleteServiceOpen(service)}
                      disabled={isDeleteDisabled}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />{" "}
                      {t(
                        "services_management.detail.quick_actions.delete_service",
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />{" "}
                  {t("services_management.detail.technician_card.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {service.technician ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border shadow-sm">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${service.technician.name}&fontSize=45&fontFamily=Helvetica&fontWeight=500`}
                        />

                        <AvatarFallback className="text-[10px]">
                          {getInitials(service.technician.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden min-w-0 flex-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="text-sm font-bold leading-none flex-1 min-w-0">
                            <TruncatedTooltip text={service.technician.name} />
                          </div>

                          {!service.technician.is_active && (
                            <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded shrink-0">
                              {t(
                                "services_management.detail.technician_card.inactive",
                              )}
                            </span>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-0 mt-1 font-mono"
                        >
                          #{service.technician.id}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        {t(
                          "services_management.detail.technician_card.signature",
                        )}
                      </p>
                      <div className="rounded-md border-2 border-dashed border-muted bg-muted/10 p-4 flex items-center justify-center min-h-20">
                        {service.technician.signature_url ? (
                          <img
                            src={service.technician.signature_url}
                            alt="Signature"
                            className="h-12 object-contain"
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground italic">
                            {t(
                              "services_management.detail.technician_card.no_signature",
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Internal Note */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                        <Wrench className="w-3 h-3" />{" "}
                        {t(
                          "services_management.detail.technician_card.internal_note",
                        )}
                      </span>

                      <div className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 p-2 rounded border border-amber-100 dark:border-amber-800 w-full">
                        {service.technician_note ? (
                          <TruncatedTooltip text={service.technician_note} />
                        ) : (
                          t(
                            "services_management.detail.technician_card.no_note",
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <User className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">
                      {t(
                        "services_management.detail.technician_card.unassigned",
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. System Time / Tracking */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-base flex gap-2 items-center">
                  <CalendarClock className="w-5 h-5 text-blue-600" />{" "}
                  {t("services_management.detail.system_info.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tracking Token */}
                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-1">
                    <ClipboardList className="w-3.5 h-3.5" />{" "}
                    {t("services_management.detail.system_info.tracking_token")}
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted/50 border px-2 py-1 rounded text-xs font-mono truncate select-all">
                      {service.tracking_token}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() => handleCopyToken(service.tracking_token)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 cursor-pointer"
                      onClick={() =>
                        window.open(
                          `/services/track/${service.tracking_token}`,
                          "_blank",
                        )
                      }
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("services_management.detail.system_info.created_at")}
                  </label>
                  <p className="font-medium text-sm border-b pb-2">
                    {formatDate(service.created_at)}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("services_management.detail.system_info.last_updated")}
                  </label>
                  <p className="font-medium text-sm border-b pb-2">
                    {formatDate(service.updated_at)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {isOwner && <ServiceLogTimeline serviceId={service.id} />}
      </div>

      <Sheet open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
        <SheetContent
          className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl text-primary">
              {t("services_management.sheet.edit_title")}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            {t("services_management.sheet.edit_desc")}
          </SheetDescription>

          <div className="flex-1 overflow-hidden">
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

const DetailServiceSkeleton = () => {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default DetailServicePage;
