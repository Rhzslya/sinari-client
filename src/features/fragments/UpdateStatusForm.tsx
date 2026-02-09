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
import { handleApiError } from "@/lib/utils";
import {
  type ServiceResponse,
  type UpdateServiceRequest,
} from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
import { RepairValidation } from "@/validation/repair-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      status: service?.status || ServiceStatus.PENDING,
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    if (open && service) {
      form.reset({
        status: service.status,
      });
    }
  }, [service, open, form]);

  const onSubmit = async (data: { status: ServiceStatus }) => {
    if (!service) return;

    setIsLoading(true);

    try {
      const result = await RepairServices.update({
        id: service.id,
        status: data.status,
        technician_id: service.technician.id,
      } as UpdateServiceRequest);

      toast.success("Status Updated", {
        description: `Service status changed to ${data.status}.`,
      });

      const { meta } = result;

      if (meta.wa_status === "failed" || meta.wa_status === "skipped") {
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
    } catch (error) {
      handleApiError(error, "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const STATUS_OPTIONS = Object.values(ServiceStatus);

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

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
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className={inputStyle}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                type="submit"
                disabled={isSubmitting || !isDirty}
              >
                Save Changes
                {isSubmitting ||
                  (isLoading && (
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
