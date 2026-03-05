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
import { AlertTriangle, ArchiveRestore, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface RestoreServiceProps {
  service: ServiceResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const RestoreServiceForm = ({
  service,
  open,
  onOpenChange,
  onSuccess,
}: RestoreServiceProps) => {
  const { t } = useTranslation();
  const { restoreMutation } = useServiceQueries();

  const {
    mutateAsync: restoreService,
    isPending,
    isError,
    error,
    reset,
  } = restoreMutation;

  const { cooldown, startCooldown } = useCooldown(
    "restore_service",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const handleDelete = async () => {
    if (!service) return;

    try {
      await restoreService({ id: service.id });

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
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-106.25"
      >
        <DialogHeader>
          <div className="flex mx-auto size-16 shrink-0 items-center border-2 border-success justify-center rounded-full bg-foreground/10 mb-4">
            <ArchiveRestore className="size-8 text-success" />
          </div>

          <div className="space-y-4 text-center">
            <DialogTitle>
              {t("services_management.forms.restore.title")}
            </DialogTitle>
            <DialogDescription>
              {t("services_management.forms.restore.desc_1")}{" "}
              <span className="font-semibold text-foreground">
                {service?.service_id}
              </span>
              {t("services_management.forms.restore.desc_2")}
            </DialogDescription>
          </div>
        </DialogHeader>

        {(cooldown > 0 || isRateLimited) && (
          <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
            <div className="space-y-1 flex flex-col justify-center items-center">
              <AlertTriangle className="h-7 w-7 shrink-0" />
              <p className="font-semibold text-xs uppercase">
                {t("services_management.forms.common.action_paused")}
              </p>
              <p
                className="text-xs opacity-90"
                dangerouslySetInnerHTML={{
                  __html: t(
                    "services_management.forms.common.too_many_attempts",
                  ).replace("{{seconds}}", String(cooldown).padStart(2, "0")),
                }}
              />
            </div>
          </div>
        )}

        <DialogFooter className="w-full sm:justify-between mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="w-1/3 cursor-pointer duration-300"
          >
            {t("services_management.forms.restore.btn_cancel")}
          </Button>

          <Button
            size="sm"
            variant="default"
            onClick={handleDelete}
            disabled={isPending || cooldown > 0}
            className="w-1/3 cursor-pointer duration-300 text-foreground"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("services_management.forms.restore.btn_restore")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreServiceForm;
