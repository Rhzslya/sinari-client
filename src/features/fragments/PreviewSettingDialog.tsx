import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, X } from "lucide-react";
import { lazy, Suspense } from "react";
const PDFViewer = lazy(() =>
  import("@react-pdf/renderer").then((mod) => ({ default: mod.PDFViewer })),
);
import type { UpdateStoreSettingRequest } from "@/model/store-setting-model";
import { ServiceInvoicePDF } from "../components/ServiceInvoicePDF";
import { ServiceStatus } from "@/enum/enum";
import type { ServiceResponse } from "@/model/repair-model";
import { useTranslation } from "react-i18next";

interface PreviewSettingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  data: Partial<UpdateStoreSettingRequest>;
}

export function PreviewSettingDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  data,
}: PreviewSettingDialogProps) {
  const { t } = useTranslation();

  const DUMMY_SERVICE: ServiceResponse = {
    id: 1,
    service_id: "SRV-S4MPL3",
    customer_name: t("preview_setting.dummy.customer_name"),
    phone_number: "081234567890",
    brand: "SAMSUNG",
    model: t("preview_setting.dummy.model"),
    description: t("preview_setting.dummy.description"),
    status: ServiceStatus.FINISHED,
    total_price: 1000000,
    discount: 10,
    down_payment: 500000,
    total_items: 1,
    tracking_token: "TOKEN123",
    created_at: new Date(),
    updated_at: new Date(),
    is_anonymized: false,
    technician: {
      id: 1,
      name: t("preview_setting.dummy.technician_name"),
      is_active: true,
      signature_url: null,
    },
    service_list: [
      { id: 1, name: t("preview_setting.dummy.service_name"), price: 1500000 },
    ],
  };

  const sanitizedSettings = {
    id: data.id || 1,
    store_name: data.store_name || "SINARI CELL",
    store_address: data.store_address || "",
    store_phone: data.store_phone || "",
    store_email: data.store_email || "",
    store_website: data.store_website || "",
    warranty_text: data.warranty_text || "",
    payment_info: data.payment_info || "",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 overflow-hidden bg-card border border-border shadow-2xl sm:rounded-xl [&>button]:hidden">
        <div className="h-10 bg-muted/60 flex items-center justify-between px-3 select-none relative z-20 border-b border-border">
          <div className="absolute right-3 flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-muted-foreground/30 transition-colors" />
            <div className="w-3.5 h-3.5 rounded-full bg-muted-foreground/30 transition-colors" />
            <div
              className="w-3.5 h-3.5 rounded-full bg-destructive/80 flex items-center justify-center cursor-pointer hover:bg-destructive group transition-colors shadow-sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-2.5 h-2.5 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <DialogTitle className="flex-1 flex justify-center text-foreground font-semibold text-xs tracking-wide pointer-events-none">
            {t("preview_setting.viewer_title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("preview_setting.viewer_desc")}
          </DialogDescription>
        </div>

        <div className="h-12 bg-background border-b border-border flex items-center px-4 justify-between z-10">
          <div className="flex items-center gap-3 text-foreground">
            <Eye className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              {t("preview_setting.file_name")}
            </span>
          </div>
          <div className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-1 rounded border border-border shadow-sm">
            {t("preview_setting.readonly_mode")}
          </div>
        </div>

        <div className="flex-1 bg-accent/20 p-6 flex justify-center items-center overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />

          <div className="w-full max-w-[320px] md:max-w-95 aspect-[1/1.414] bg-white shadow-2xl border border-border/50 relative z-10 transition-transform hover:scale-[1.01] duration-300 flex flex-col">
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
                  <p className="text-xs text-muted-foreground">
                    Generating Preview...
                  </p>
                </div>
              }
            >
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                className="border-none w-full h-full"
              >
                <ServiceInvoicePDF
                  service={DUMMY_SERVICE}
                  settings={sanitizedSettings as UpdateStoreSettingRequest}
                />
              </PDFViewer>
            </Suspense>
          </div>
        </div>

        <div className="h-16 bg-background border-t border-border flex items-center justify-end px-6 gap-3 z-10">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
          >
            {t("preview_setting.btn_cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("preview_setting.btn_save")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
