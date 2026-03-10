import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useServiceQueries } from "@/hooks/repair-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import type { ServiceResponse } from "@/model/repair-model";
import { isAxiosError } from "axios";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteServiceFormProps {
  service: ServiceResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteServiceForm = ({
  service,
  open,
  onOpenChange,
  onSuccess,
}: DeleteServiceFormProps) => {
  const { t } = useTranslation();
  const { deleteMutation } = useServiceQueries();

  const {
    mutateAsync: deleteService,
    isPending,
    isError,
    error,
    reset,
  } = deleteMutation;

  const { cooldown, startCooldown } = useCooldown(
    "delete_service",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const handleDelete = async () => {
    if (!service) return;

    try {
      await deleteService({ id: service.id });

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch {
      // Handle by Hook
    }
  };

  useEffect(() => {
    if (isRateLimited) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)/);
      const seconds = match ? parseInt(match[1]) : 60;

      if (cooldown === 0) {
        startCooldown(seconds);
        reset();
      }
    }
  }, [isRateLimited, error, cooldown, startCooldown, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-106.25 p-4 sm:p-6 rounded-xl">
        <DialogHeader>
          <div className="flex mx-auto h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center border-2 border-destructive justify-center rounded-full bg-destructive/10 mb-3 sm:mb-4">
            <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
          </div>

          <div className="space-y-2 sm:space-y-3 text-center">
            <DialogTitle className="text-lg sm:text-xl">
              {t("services_management.forms.delete.title")}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("services_management.forms.delete.desc_1")}{" "}
              <span className="font-bold text-foreground">
                {service?.service_id}
              </span>{" "}
              {t("services_management.forms.delete.desc_2")}
            </DialogDescription>
          </div>
        </DialogHeader>

        <AnimatePresence initial={false}>
          {(cooldown > 0 || isRateLimited) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
                  <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 opacity-80" />
                  <div className="space-y-1">
                    <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                      {t("services_management.forms.common.action_paused")}
                    </p>
                    <p
                      className="text-[10px] sm:text-xs opacity-90 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: t(
                          "services_management.forms.common.too_many_attempts",
                        ).replace(
                          "{{seconds}}",
                          String(cooldown).padStart(2, "0"),
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <DialogFooter className="mt-6 sm:mt-8 flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-between w-full">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-full sm:w-1/4 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer duration-300 order-1 sm:order-0"
          >
            {t("services_management.forms.delete.btn_cancel")}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending || cooldown > 0}
            className="w-full sm:w-1/2 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer duration-300"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("services_management.forms.delete.btn_delete")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServiceForm;
