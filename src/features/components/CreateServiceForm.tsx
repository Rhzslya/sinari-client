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
import { Brand } from "@/enum/product-enum";
import { useServiceQueries } from "@/hooks/repair-queries";
import type { CreateServiceRequest } from "@/model/repair-model";
import { TechnicianServices } from "@/services/technician-services";
import { RepairValidation } from "@/validation/repair-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  useFieldArray,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";

const BRAND_OPTIONS = Object.values(Brand);
const MAX_SERVICE_ITEMS = 10;

interface ServiceFormProps {
  onSuccess?: () => void;
}

export function CreateServiceForm({ onSuccess }: ServiceFormProps) {
  const { createMutation } = useServiceQueries();

  const { mutateAsync: createService, isPending } = createMutation;

  const { data: technicians, isLoading: isFetchingTechs } = useQuery({
    queryKey: ["technicians", "active_list"],
    queryFn: TechnicianServices.listActive,
    staleTime: 1000 * 60 * 5,
  });

  const formCreate = useForm<CreateServiceRequest>({
    resolver: zodResolver(
      RepairValidation.CREATE,
    ) as Resolver<CreateServiceRequest>,
    mode: "onChange",
    defaultValues: {
      brand: Brand.OTHER,
      model: "",
      customer_name: "",
      phone_number: "",
      description: "",
      technician_note: "",
      service_list: [{ name: "", price: 0 }],
      discount: 0,
      down_payment: 0,
      technician_id: undefined,
    },
  });

  const { isSubmitting, isDirty } = formCreate.formState;

  const { fields, append, remove } = useFieldArray({
    control: formCreate.control,
    name: "service_list",
  });

  const customerNameValue = useWatch({
    control: formCreate.control,
    name: "customer_name",
  });
  const phoneNumberValue = useWatch({
    control: formCreate.control,
    name: "phone_number",
  });
  const modelValue = useWatch({
    control: formCreate.control,
    name: "model",
  });
  const serviceList = useWatch({
    control: formCreate.control,
    name: "service_list",
  });
  const discountPercent =
    useWatch({
      control: formCreate.control,
      name: "discount",
    }) || 0;
  const downPayment =
    useWatch({
      control: formCreate.control,
      name: "down_payment",
    }) || 0;

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
    hasInvalidItems;

  const subTotal =
    serviceList?.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0) || 0;
  const discountAmount = (subTotal * discountPercent) / 100;
  const grandTotal = subTotal - discountAmount - downPayment;

  const maxDownPayment = subTotal - discountAmount;

  const isBillingDisabled = subTotal <= 0;

  const handleReset = () => {
    formCreate.reset({
      brand: Brand.OTHER,
      model: "",
      customer_name: "",
      phone_number: "",
      description: "",
      technician_note: "",
      service_list: [{ name: "", price: 0 }],
      discount: 0,
      down_payment: 0,
      technician_id: undefined,
    });
  };

  const onSubmit = async (data: CreateServiceRequest) => {
    try {
      await createService(data);

      formCreate.reset({
        brand: Brand.OTHER,
        model: "",
        customer_name: "",
        phone_number: "",
        description: "",
        technician_note: "",
        service_list: [{ name: "", price: 0 }],
        discount: 0,
        down_payment: 0,
      });

      if (onSuccess) onSuccess();
    } catch {
      // Handle by Hook
    }
  };

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Form {...formCreate}>
      <form
        onSubmit={formCreate.handleSubmit(onSubmit)}
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
          <div className="grid gap-6">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Customer & Device
              </h3>
              <p className="text-xs text-muted-foreground">
                Who is the customer and what device are they bringing?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={formCreate.control}
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
                        disabled={isSubmitting || isPending}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formCreate.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="0812xxxxxxx"
                        className={inputStyle}
                        {...field}
                        inputMode="numeric"
                        onChange={(e) => {
                          const value = e.target.value;
                          const numericValue = value.replace(/\D/g, "");
                          field.onChange(numericValue);
                        }}
                        disabled={isSubmitting || isPending}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formCreate.control}
                name="brand"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Brand</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || isPending}
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
                control={formCreate.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="col-span-1 relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>Model / Type</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="e.g. A51, iPhone 11"
                        className={inputStyle}
                        {...field}
                        disabled={isSubmitting || isPending}
                      />
                    </FormControl>
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
                Problem description and technician assignment.
              </p>
            </div>

            <div className="grid gap-4">
              <FormField
                control={formCreate.control}
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
                      disabled={isSubmitting || isFetchingTechs || isPending}
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
                            {tech.name}
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
                control={formCreate.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="relative grid gap-1 space-y-0">
                    <FormLabel className={labelStyle}>
                      Problem Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. LCD Pecah, Touchscreen error..."
                        className="resize-none min-h-15 text-sm bg-input/50"
                        {...field}
                        disabled={isSubmitting || isPending}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={formCreate.control}
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
                        disabled={isSubmitting || isPending}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold tracking-tight">
                  Cost & Billing
                </h3>
                <p className="text-xs text-muted-foreground">
                  List of services performed and pricing.
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
                  fields.length >= MAX_SERVICE_ITEMS
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
                    control={formCreate.control}
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
                              disabled={isSubmitting || isPending}
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
                            disabled={isSubmitting || isPending}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-[10px] mt-0" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formCreate.control}
                    name={`service_list.${index}.price`}
                    render={({ field }) => (
                      <FormItem className="relative flex flex-col gap-1 space-y-0">
                        {" "}
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
                            disabled={isSubmitting || isPending}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-[10px] mt-0" />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="bg-muted/30 p-4 rounded-lg border border-border/50 grid gap-3 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatRupiah(subTotal)}</span>
              </div>

              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground">Discount (%)</span>
                <div className="w-48">
                  <FormField
                    control={formCreate.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberStepper
                            value={field.value}
                            onChange={(value) => {
                              let newDiscount = value || 0;

                              if (newDiscount > 100) newDiscount = 100;
                              if (newDiscount < 0) newDiscount = 0;

                              field.onChange(newDiscount);

                              const newDiscountAmount =
                                (subTotal * newDiscount) / 100;
                              const newMaxDP = subTotal - newDiscountAmount;

                              const currentDP =
                                formCreate.getValues("down_payment") || 0;

                              if (currentDP > newMaxDP) {
                                formCreate.setValue("down_payment", newMaxDP, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            max={100}
                            min={0}
                            placeholder="0"
                            disabled={
                              isSubmitting || isPending || isBillingDisabled
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm gap-4">
                <span className="text-muted-foreground">Down Payment</span>
                <div className="w-48">
                  <FormField
                    control={formCreate.control}
                    name="down_payment"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <NumberStepper
                            value={field.value}
                            onChange={(value) => {
                              const inputDP = value || 0;

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
                              isSubmitting || isPending || isBillingDisabled
                            }
                            className="text-right"
                          />
                        </FormControl>
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

        <div className="flex items-center justify-end gap-3 p-4 border-t bg-background mt-auto">
          {isDirty ? (
            <Button
              size="sm"
              variant="ghost"
              type="button"
              className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer text-foreground duration-300"
              onClick={handleReset}
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
              onClick={() => {
                if (onSuccess) onSuccess();
              }}
              disabled={isSubmitting || isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
            type="submit"
            disabled={isButtonDisabled || isPending}
          >
            {isSubmitting || isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Service"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
