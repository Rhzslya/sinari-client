import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ServiceResponse } from "@/model/repair-model";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  FileText,
  ArchiveRestore,
  HatGlasses,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ServiceInvoicePDF } from "../components/ServiceInvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { useUserQueries } from "@/hooks/user-queries";
import { ServiceStatus } from "@/enum/product-enum";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { useTranslation } from "react-i18next";

interface ServiceActionMenuProps {
  service: ServiceResponse;
  onViewDetails: () => void;
  onEditService: () => void;
  onUpdateStatus: () => void;
  onAnonymizeCustomerData: () => void;
  onDeleteService: () => void;
  onRestoreService: () => void;
  isTrashView: boolean;
}

export function ServiceActionMenu({
  service,
  onViewDetails,
  onEditService,
  onUpdateStatus,
  onDeleteService,
  onAnonymizeCustomerData,
  onRestoreService,
  isTrashView,
}: ServiceActionMenuProps) {
  const { t } = useTranslation();
  const userQueries = useUserQueries();
  const { useGetSettings } = useStoreSettingQueries();

  const { data: currentUser } = userQueries.useProfile();
  const { data: storeData, isLoading: isSettingsLoading } = useGetSettings();
  const isOwner = currentUser?.role === "OWNER";

  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isDeleteDisabled =
    service.status !== ServiceStatus.CANCELLED &&
    service.status !== ServiceStatus.TAKEN;

  const isAnonymizeDisabled =
    isDeleteDisabled || service.is_anonymized === true;

  if (isSettingsLoading || !storeData) {
    return <div>{t("services_management.action_menu.loading_invoice")}</div>;
  }

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading(
      t("services_management.detail.toast.generating_pdf"),
    );

    // FIX TYPESCRIPT ERROR: Mapping the data
    const formattedSettings = {
      ...storeData,
      store_email: storeData.store_email || "",
      store_website: storeData.store_website || "",
    };

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {!isTrashView ? (
          <>
            <DropdownMenuItem
              onClick={onViewDetails}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              {t("services_management.action_menu.view_details")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="cursor-pointer"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isGeneratingPdf
                ? t("services_management.action_menu.generating_pdf")
                : t("services_management.action_menu.download_pdf")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onEditService}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              {t("services_management.action_menu.edit_service")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={onUpdateStatus}
              className="cursor-pointer"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("services_management.action_menu.update_status")}
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDeleteService}
                  className="text-destructive focus:text-destructive cursor-pointer"
                  disabled={isDeleteDisabled}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("services_management.action_menu.delete")}
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onClick={onAnonymizeCustomerData}
              className="text-destructive focus:text-destructive cursor-pointer"
              disabled={isAnonymizeDisabled}
            >
              <HatGlasses className="mr-2 h-4 w-4" />{" "}
              {t("services_management.action_menu.anonymize")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={onRestoreService}
            className="text-emerald-600 focus:text-emerald-600 cursor-pointer"
            disabled={!isOwner}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            {t("services_management.action_menu.restore_data")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
