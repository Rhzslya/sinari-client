import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceStatus } from "@/enum/product-enum";
import { useServiceQueries } from "@/hooks/repair-queries";
import { useCooldown, useServiceLock } from "@/hooks/use-cooldown";
import { type ServiceResponse } from "@/model/repair-model";
import { RepairValidation } from "@/validation/repair-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Clock, Loader2, Lock } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";

const statusSchema = RepairValidation.UPDATE.pick({
  status: true,
}).required();

type StatusFormValues = z.infer<typeof statusSchema>;

interface UpdateStatusDialogProps {
  service: ServiceResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UpdateStatusDialog({
  service,
  open,
  onOpenChange,
  onSuccess,
}: UpdateStatusDialogProps) {
  const { updateStatusMutation } = useServiceQueries();
  const {
    mutateAsync: updateStatus,
    isPending,
    isError,
    error,
    reset,
  } = updateStatusMutation;

  const { cooldown, startCooldown } = useCooldown(
    "update_status",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;
  const { isLocked, timeLeft, isGracePeriodActive, isTaken } =
    useServiceLock(service);

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: service?.status || ServiceStatus.PENDING,
    },
  });

  const isTimeExpiredButCanTake = isLocked && !isTaken;

  const { isSubmitting, isDirty } = form.formState;

  const isSelectDisabled = isSubmitting || isPending || isTaken;

  const availableStatusOptions = isTimeExpiredButCanTake
    ? [service?.status as ServiceStatus, ServiceStatus.TAKEN]
    : Object.values(ServiceStatus);

  const uniqueOptions = Array.from(new Set(availableStatusOptions));

  useEffect(() => {
    if (open && service) {
      form.reset({
        status: service.status,
      });
    }
  }, [service, open, form]);

  const onSubmit = async (data: { status: ServiceStatus }) => {
    if (!service) return;

    try {
      const result = await updateStatus({
        id: service.id,
        status: data.status,
        technician_id: service.technician.id,
      });

      const { meta } = result;

      if (meta.wa_status === "failed") {
        setTimeout(() => {
          toast.warning("WhatsApp Notification Failed", {
            description:
              meta.message || "Failed to send message to customer number",
            duration: 3000,
          });
        }, 1500);
      }

      onSuccess();
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

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  const renderStatusAlert = () => {
    if (isTaken) {
      return (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md border border-destructive/20 text-xs flex items-start gap-2 mb-4">
          <Lock className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold uppercase block mb-1">
              Permanently Locked
            </span>
            Service items have been taken. Status cannot be changed anymore.
          </div>
        </div>
      );
    }

    if (isTimeExpiredButCanTake) {
      return (
        <div className="bg-warning/20 text-warning-foreground p-3 rounded-md border border-warning/50 text-xs flex items-start gap-2 mb-4">
          <Lock className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold uppercase block mb-1">
              Editing Restricted
            </span>
            Grace period ended. You can only change status to <b>TAKEN</b>.
          </div>
        </div>
      );
    }

    if (isGracePeriodActive) {
      return (
        <div className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 p-3 rounded-md border border-blue-200 dark:border-blue-800 text-xs flex items-start gap-2 mb-4">
          <Clock className="w-4 h-4 mt-0.5 shrink-0 animate-pulse" />
          <div>
            <span className="font-bold uppercase block mb-1">
              Grace Period Active
            </span>
            You can still undo/change this status for the next{" "}
            <b className="tabular-nums">
              {timeLeft.m}m {timeLeft.s.toString().padStart(2, "0")}s
            </b>
            .
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Update Service Status</DialogTitle>
          <DialogDescription>
            Change status for{" "}
            <span className="font-semibold text-foreground">
              {service?.service_id}
            </span>
            .
            <br />
            <span className="text-xs text-muted-foreground">
              (This may trigger an automatic WhatsApp notification)
            </span>
          </DialogDescription>
        </DialogHeader>
        {renderStatusAlert()}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-2"
          >
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelStyle}>Current Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSelectDisabled}
                  >
                    <FormControl>
                      <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {uniqueOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                size="sm"
                type="button"
                variant="outline"
                className="cursor-pointer duration-300"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isPending}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                type="submit"
                disabled={
                  isSubmitting ||
                  !isDirty ||
                  isPending ||
                  isTaken ||
                  cooldown > 0
                }
              >
                Save Changes
                {isSubmitting ||
                  (isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ))}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
