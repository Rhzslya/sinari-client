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
import { ServiceStatus, UserRole } from "@/enum/enum";
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
  const isOwner = currentUser?.role === UserRole.OWNER;

  const [isOpen, setIsOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isDeleteDisabled =
    service.status !== ServiceStatus.CANCELLED &&
    service.status !== ServiceStatus.TAKEN;

  const isAnonymizeDisabled =
    isDeleteDisabled || service.is_anonymized === true;

  if (isSettingsLoading || !storeData) {
    return (
      <div className="text-xs text-muted-foreground pr-2">
        {t("services_management.action_menu.loading_invoice")}
      </div>
    );
  }

  const handleAction = (e: Event, callback: () => void) => {
    e.preventDefault();
    document.body.focus();
    setIsOpen(false);

    //Aria Hidden
    setTimeout(() => {
      callback();
    }, 250);
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    const toastId = toast.loading(
      t("services_management.detail.toast.generating_pdf"),
    );

    const formattedSettings = {
      ...storeData,
      store_email: storeData.store_email || "",
      store_website: storeData.store_website || "",
    };

    try {
      const blob = await pdf(
        <ServiceInvoicePDF
          service={service}
          settings={formattedSettings}
          t={t}
        />,
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
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer hover:bg-muted transition-colors rounded-full"
        >
          <MoreHorizontal className="size-4 text-muted-foreground" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-52 p-1"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {!isTrashView ? (
          <>
            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onViewDetails)}
              className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <Eye className="size-4 text-muted-foreground" />
              {t("services_management.action_menu.view_details")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, handleDownloadPDF)}
              disabled={isGeneratingPdf}
              className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm ${isGeneratingPdf ? "opacity-50" : "cursor-pointer"}`}
            >
              <FileText className="size-4 text-muted-foreground" />
              {isGeneratingPdf
                ? t("services_management.action_menu.generating_pdf")
                : t("services_management.action_menu.download_pdf")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onEditService)}
              className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <Pencil className="size-4 text-muted-foreground" />
              {t("services_management.action_menu.edit_service")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onUpdateStatus)}
              className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <RefreshCw className="size-4 text-muted-foreground" />
              {t("services_management.action_menu.update_status")}
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => handleAction(e, onDeleteService)}
                  className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 ${isDeleteDisabled ? "opacity-50" : "cursor-pointer"}`}
                  disabled={isDeleteDisabled}
                >
                  <Trash2 className="size-4" />
                  {t("services_management.action_menu.delete")}
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onAnonymizeCustomerData)}
              className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 ${isAnonymizeDisabled ? "opacity-50" : "cursor-pointer"}`}
              disabled={isAnonymizeDisabled}
            >
              <HatGlasses className="size-4" />
              {t("services_management.action_menu.anonymize")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => handleAction(e, onRestoreService)}
            disabled={!isOwner}
            className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${!isOwner ? "opacity-50" : "cursor-pointer"}`}
          >
            <ArchiveRestore className="size-4" />
            {t("services_management.action_menu.restore_data")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
