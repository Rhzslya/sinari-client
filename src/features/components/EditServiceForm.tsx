import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand, ServiceStatus } from "@/enum/product-enum";
import { useServiceQueries } from "@/hooks/repair-queries";
import { useTechnicianQueries } from "@/hooks/technician-queries";
import { useCooldown, useServiceLock } from "@/hooks/use-cooldown";
import type {
  ServiceResponse,
  UpdateServiceRequest,
} from "@/model/repair-model";
import { RepairValidation } from "@/validation/repair-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  AlertTriangle,
  Clock,
  Loader2,
  Lock,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { toast } from "sonner";

const BRAND_OPTIONS = Object.values(Brand);
const MAX_SERVICE_ITEMS = 10;

interface ServiceFormProps {
  service: ServiceResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EditServiceForm({
  service,
  onSuccess,
  onCancel,
}: ServiceFormProps) {
  const { updateServiceMutation } = useServiceQueries();

  const {
    mutateAsync: updateService,
    isPending,
    isError,
    error,
    reset,
  } = updateServiceMutation;

  const { cooldown, startCooldown } = useCooldown("edit_service", "ratelimit_");

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const { isLocked, timeLeft, isGracePeriodActive, isTaken } =
    useServiceLock(service);

  const { useActiveList } = useTechnicianQueries();

  const { data: technicians, isLoading: isFetchingTechs } = useActiveList();

  const isTimeExpiredButCanTake = isLocked && !isTaken;

  const isContentDisabled = isLocked;

  const isStatusDisabled = isPending || isTaken;

  type EditFormValues = Omit<UpdateServiceRequest, "id">;

  const formUpdate = useForm<EditFormValues>({
    resolver: zodResolver(RepairValidation.UPDATE) as Resolver<EditFormValues>,
    mode: "onChange",
    defaultValues: {
      customer_name: service.customer_name,
      phone_number: service.phone_number,
      brand: service.brand,
      model: service.model,
      status: service.status,
      description: service.description || "",
      technician_note: service.technician_note || "",
      service_list: service.service_list.map((item) => ({
        name: item.name,
        price: item.price,
      })),
      discount: service.discount || 0,
      down_payment: service.down_payment || 0,
      technician_id: service.technician.id || undefined,
    },
  });

  const { isSubmitting, isDirty } = formUpdate.formState;

  const availableStatusOptions = isTimeExpiredButCanTake
    ? [service?.status as ServiceStatus, ServiceStatus.TAKEN]
    : Object.values(ServiceStatus);

  const uniqueStatusOptions = Array.from(
    new Set(availableStatusOptions),
  ).filter(Boolean);

  const { fields, append, remove } = useFieldArray({
    control: formUpdate.control,
    name: "service_list",
  });

  const serviceList = useWatch({
    control: formUpdate.control,
    name: "service_list",
  });
  const discountPercent =
    useWatch({
      control: formUpdate.control,
      name: "discount",
    }) || 0;

  const downPayment =
    useWatch({
      control: formUpdate.control,
      name: "down_payment",
    }) || 0;
  const customerNameValue = useWatch({
    control: formUpdate.control,
    name: "customer_name",
  });

  const phoneNumberValue = useWatch({
    control: formUpdate.control,
    name: "phone_number",
  });

  const modelValue = useWatch({
    control: formUpdate.control,
    name: "model",
  });

  const hasInvalidItems =
    !serviceList ||
    serviceList.length === 0 ||
    serviceList.some(
      (item) => !item.name || !item.price || Number(item.price) <= 0,
    );

  const isButtonDisabled =
    isSubmitting ||
    !customerNameValue ||
    !phoneNumberValue ||
    !modelValue ||
    hasInvalidItems ||
    cooldown > 0;

  const subTotal =
    serviceList?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal - discountAmount - downPayment;

  const maxDownPayment = subTotal - discountAmount;

  const isBillingDisabled = subTotal <= 0;

  useEffect(() => {
    if (service) {
      formUpdate.reset({
        customer_name: service.customer_name,
        phone_number: service.phone_number,
        brand: service.brand,
        model: service.model,
        status: service.status,
        description: service.description || "",
        technician_note: service.technician_note || "",
        service_list: service.service_list.map((item) => ({
          name: item.name,
          price: item.price,
        })),
        discount: service.discount || 0,
        down_payment: service.down_payment || 0,
        technician_id: service.technician.id || undefined,
      });
    }
  }, [service, formUpdate]);

  const handleResetToOriginal = () => {
    formUpdate.reset({
      customer_name: service.customer_name,
      phone_number: service.phone_number,
      brand: service.brand,
      model: service.model,
      status: service.status,
      description: service.description || "",
      technician_note: service.technician_note || "",
      service_list: service.service_list.map((item) => ({
        name: item.name,
        price: item.price,
      })),
      discount: service.discount || 0,
      down_payment: service.down_payment || 0,
      technician_id: service.technician.id || undefined,
    });
  };

  const onSubmit = async (data: EditFormValues) => {
    try {
      const result = await updateService({
        id: service.id,
        ...data,
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

      formUpdate.reset(data);

      if (onSuccess) onSuccess();
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
    <Form {...formUpdate}>
      <form
        onSubmit={formUpdate.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div
          className="flex-1 overflow-y-auto px-6 py-6 
            [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar]:h-1
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors"
        >
          {renderStatusAlert()}
          <div className="grid gap-6">
            {(cooldown > 0 || isRateLimited) && (
              <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1 flex flex-col justify-center items-center">
                  <AlertTriangle className="h-7 w-7 shrink-0" />
                  <p className="font-semibold text-xs uppercase">
                    Action Paused
                  </p>
                  <p className="text-xs opacity-90">
                    Too many attempts. Please wait{" "}
                    <span className="font-bold tabular-nums">
                      {String(cooldown).padStart(2, "0")}s
                    </span>{" "}
                    before trying again.
                  </p>
                </div>
              </div>
            )}
            {/* SECTION 1: CUSTOMER & DEVICE */}
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Customer & Device
              </h3>
              <p className="text-xs text-muted-foreground">
                Edit customer details and device information.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={formUpdate.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="John Doe"
                        className={inputStyle}
                        {...field}
                        disabled={
                          isSubmitting || isPending || isContentDisabled
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="0812..."
                        className={inputStyle}
                        {...field}
                        inputMode="numeric"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        disabled={
                          isSubmitting || isPending || isContentDisabled
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || isPending || isContentDisabled}
                    >
                      <FormControl>
                        <SelectTrigger size="sm" className={inputStyle}>
                          <SelectValue placeholder="Select Brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BRAND_OPTIONS.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Model / Type</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="e.g. A51"
                        className={inputStyle}
                        {...field}
                        disabled={
                          isSubmitting || isPending || isContentDisabled
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={formUpdate.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="col-span-2 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Service Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isStatusDisabled}
                    >
                      <FormControl>
                        <SelectTrigger size="sm" className={inputStyle}>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {uniqueStatusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Service Details
              </h3>
              <p className="text-xs text-muted-foreground">
                Edit Problem description and technician assignment.
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                control={formUpdate.control}
                name="technician_id"
                render={({ field }) => (
                  <FormItem className="relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>
                      Assign Technician
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value) {
                          field.onChange(Number(value));
                        }
                      }}
                      value={field.value ? field.value.toString() : ""}
                      disabled={
                        isSubmitting ||
                        isPending ||
                        isFetchingTechs ||
                        isContentDisabled
                      }
                    >
                      <FormControl>
                        <SelectTrigger size="sm" className={inputStyle}>
                          <SelectValue
                            placeholder={
                              isFetchingTechs
                                ? "Loading..."
                                : "Select Technician"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {technicians?.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id.toString()}>
                            <div className="flex justify-between items-center w-full">
                              <span>{tech.name}</span>
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded ml-2 ${
                                  tech.active_jobs > 5
                                    ? "bg-destructive/20 text-destructive"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {tech.active_jobs} antrean
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        {technicians?.length === 0 && !isFetchingTechs && (
                          <div className="p-2 text-xs text-muted-foreground text-center">
                            No technicians found.
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>
                      Problem Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. LCD Pecah"
                        className="resize-none min-h-15 text-sm bg-input/50"
                        {...field}
                        disabled={
                          isSubmitting || isPending || isContentDisabled
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formUpdate.control}
                name="technician_note"
                render={({ field }) => (
                  <FormItem className="relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>
                      Technician Note (Internal)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Casing agak bengkok..."
                        className="resize-none min-h-15 text-sm bg-input/50"
                        {...field}
                        disabled={
                          isSubmitting || isPending || isContentDisabled
                        }
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* SECTION 3: COST & BILLING */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Cost & Billing
                </h3>
                <p className="text-xs text-muted-foreground">
                  Update services and pricing.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 text-xs gap-1"
                onClick={() => append({ name: "", price: 0 })}
                disabled={
                  isSubmitting ||
                  isPending ||
                  fields.length >= MAX_SERVICE_ITEMS ||
                  isContentDisabled
                }
              >
                <Plus className="w-3 h-3" /> Add Item
                <span className="ml-1 text-[10px] text-muted-foreground">
                  ({fields.length}/{MAX_SERVICE_ITEMS})
                </span>
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="group relative flex flex-col gap-6 rounded-lg border border-border/50 bg-muted/20 px-3 py-4 animate-in fade-in slide-in-from-top-2 duration-300 transition-colors"
                >
                  <FormField
                    control={formUpdate.control}
                    name={`service_list.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="relative flex flex-col gap-1 space-y-0">
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                            Service Name #{index + 1}
                          </FormLabel>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mr-1 -mt-1 text-muted-foreground hover:text-destructive opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              onClick={() => remove(index)}
                              disabled={
                                isSubmitting || isPending || isContentDisabled
                              }
                              title="Remove Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder="e.g. Ganti LCD Samsung A51"
                            className={inputStyle}
                            {...field}
                            disabled={
                              isSubmitting || isPending || isContentDisabled
                            }
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-[10px] mt-0" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={formUpdate.control}
                    name={`service_list.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="relative flex flex-col gap-1 space-y-0">
                        <FormLabel className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">
                          Cost Estimation
                        </FormLabel>
                        <FormControl>
                          <NumberStepper
                            value={field.value}
                            onChange={field.onChange}
                            step={10000}
                            min={0}
                            prefix="Rp"
                            placeholder="0"
                            disabled={
                              isSubmitting || isPending || isContentDisabled
                            }
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-[10px] mt-0" />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Total Calculation Card */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 grid gap-3 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatRupiah(subTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground">Discount (%)</span>
                <div className="w-48">
                  <FormField
                    control={formUpdate.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberStepper
                            value={field.value}
                            onChange={(value) => {
                              // 1. Clamping Nilai Diskon (0-100)
                              let newDiscount = value || 0;
                              if (newDiscount > 100) newDiscount = 100;
                              if (newDiscount < 0) newDiscount = 0;

                              field.onChange(newDiscount);

                              // 2. Hitung ulang Max DP
                              const newDiscountAmount =
                                (subTotal * newDiscount) / 100;
                              const newMaxDP = subTotal - newDiscountAmount;

                              // 3. Cek apakah DP saat ini melebihi batas baru?
                              const currentDP =
                                formUpdate.getValues("down_payment") || 0;

                              if (currentDP > newMaxDP) {
                                // 4. Turunkan DP otomatis
                                formUpdate.setValue("down_payment", newMaxDP, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            max={100}
                            min={0}
                            placeholder="0"
                            disabled={
                              isSubmitting ||
                              isPending ||
                              isBillingDisabled ||
                              isContentDisabled
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* DOWN PAYMENT FIELD */}
              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground">Down Payment</span>
                <div className="w-48">
                  <FormField
                    control={formUpdate.control}
                    name="down_payment"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberStepper
                            value={field.value}
                            onChange={(value) => {
                              const inputDP = value || 0;

                              // Clamping Nilai DP agar tidak melebihi total tagihan
                              if (inputDP > maxDownPayment) {
                                field.onChange(maxDownPayment);
                              } else {
                                field.onChange(inputDP);
                              }
                            }}
                            step={10000}
                            min={0}
                            max={maxDownPayment}
                            prefix="Rp"
                            placeholder="0"
                            disabled={
                              isSubmitting ||
                              isPending ||
                              isBillingDisabled ||
                              isContentDisabled
                            }
                            className="text-right"
                          />
                        </FormControl>
                        {/* Error Message visual jika entah bagaimana DP melebihi batas */}
                        {downPayment > maxDownPayment && (
                          <span className="text-[10px] text-destructive absolute right-0 -bottom-4">
                            Max DP: {formatRupiah(maxDownPayment)}
                          </span>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="flex items-center justify-between font-semibold">
                <span>Total Bill</span>
                <span className="text-primary text-base font-mono">
                  {formatRupiah(grandTotal)}
                </span>
              </div>
            </div>

            <div className="h-4"></div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t bg-background mt-auto">
          {isDirty ? (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={handleResetToOriginal}
              disabled={isSubmitting || isPending}
            >
              Reset
            </Button>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={onCancel}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
          )}

          <Button
            size="sm"
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={isButtonDisabled || isPending || !isDirty || isTaken}
          >
            {isSubmitting || isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
