import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import {
  Store,
  Settings2,
  CreditCard,
  Blocks,
  Loader2,
  Eye,
  PowerOff,
  Smartphone,
  QrCode,
} from "lucide-react";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import type { UpdateStoreSettingRequest } from "@/model/store-setting-model";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { StoreSettingValidation } from "@/validation/store-setting-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { PreviewSettingDialog } from "@/features/fragments/PreviewSettingDialog";
import { useWhatsappQueries } from "@/hooks/whatsapp-queries";
import { isAxiosError } from "axios";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";

const DashboardSettingPage = () => {
  const { useGetSettings, updateMutation } = useStoreSettingQueries();
  const [activeTab, setActiveTab] = useState<string>("store");

  const [isWaActive, setIsWaActive] = useState(false);

  const { useGetStatus, disconnectMutation } = useWhatsappQueries(
    activeTab === "integrations" && isWaActive,
  );

  const {
    data: storeData,
    isLoading: isStoreLoading,
    isPending: isStorePending,
    isError: isStoreError,
    error: storeError,
    refetch: refetchStore,
  } = useGetSettings();
  const {
    data: waData,
    isLoading: isWaLoading,
    isError: isWaError,
    error: waError,
    refetch: refetchWa,
  } = useGetStatus();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<UpdateStoreSettingRequest>({
    resolver: zodResolver(
      StoreSettingValidation.UPDATE,
    ) as Resolver<UpdateStoreSettingRequest>,
    mode: "onChange",
    defaultValues: {
      id: 1,
      store_name: "",
      store_address: "",
      store_phone: "",
      store_email: "",
      store_website: "",
      warranty_text: "",
      payment_info: "",
    },
  });

  useEffect(() => {
    if (storeData) {
      form.reset({
        ...storeData,
        store_email: storeData.store_email ?? "",
        store_website: storeData.store_website ?? "",
      });
    }
  }, [storeData, form]);

  useEffect(() => {
    if (activeTab !== "integrations") {
      setIsWaActive(false);
    }
  }, [activeTab]);

  const watchedValues = useWatch({ control: form.control });

  const currentFormData: UpdateStoreSettingRequest = {
    id: 1,
    store_name: watchedValues.store_name || "",
    store_address: watchedValues.store_address || "",
    store_phone: watchedValues.store_phone || "",
    store_email: watchedValues.store_email || "",
    store_website: watchedValues.store_website || "",
    warranty_text: watchedValues.warranty_text || "",
    payment_info: watchedValues.payment_info || "",
  };

  const isButtonDisabled =
    isStorePending ||
    !watchedValues.store_name ||
    !watchedValues.store_address ||
    !watchedValues.store_phone ||
    !watchedValues.store_email ||
    !watchedValues.store_website ||
    !watchedValues.warranty_text ||
    !watchedValues.payment_info;

  const onHandlePreview = () => {
    setIsPreviewOpen(true);
  };

  const onFinalSubmit = async () => {
    const data = form.getValues();
    try {
      await updateMutation.mutateAsync({
        ...data,
        id: 1,
        store_email: data.store_email || "",
        store_website: data.store_website || "",
      });
      setIsPreviewOpen(false);
      form.reset(data);
    } catch {
      // Handle by hook
    }
  };

  if (isStoreLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isStoreLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const hasError = isStoreError || isWaError;
  const anyError = storeError || waError;

  if (hasError) {
    if (isAxiosError(anyError) && anyError.response?.status === 429) {
      const message = anyError.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return (
        <RateLimitFallback
          seconds={seconds}
          onRetry={() => {
            if (isStoreError) refetchStore();
            if (isWaError) refetchWa();
          }}
        />
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">
          Failed to load settings data.
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(anyError) ? anyError.message : "Unknown error occurred"}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            if (isStoreError) refetchStore();
            if (isWaError) refetchWa();
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }
  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";
  const textareaStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none";

  return (
    <div className="flex flex-col h-full space-y-6">
      <DashboardHeader title="Settings">
        <p className="text-sm text-muted-foreground">
          Manage your store details, integrations, and system preferences.
        </p>
      </DashboardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onHandlePreview)}
          className="flex flex-col flex-1 space-y-6"
        >
          <Tabs
            defaultValue="store"
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 p-1">
              <TabsTrigger value="store" className="gap-2 h-9">
                <Store className="h-4 w-4" /> Store
              </TabsTrigger>
              <TabsTrigger value="operational" className="gap-2 h-9">
                <Settings2 className="h-4 w-4" /> Policy
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2 h-9">
                <CreditCard className="h-4 w-4" /> Payment
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2 h-9">
                <Blocks className="h-4 w-4" /> Apps
              </TabsTrigger>
            </TabsList>
            <TabsContent value="store" className="mt-4 space-y-4">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle>Store Profile</CardTitle>
                  <CardDescription>
                    Public information for your receipts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="store_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Store Name</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            {...field}
                            className={inputStyle}
                            disabled={isStorePending}
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="store_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>Address</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            {...field}
                            className={inputStyle}
                            disabled={isStorePending}
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="store_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              {...field}
                              className={inputStyle}
                              disabled={isStorePending}
                              spellCheck={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="store_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>Email</FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              className={inputStyle}
                              {...field}
                              value={field.value || ""}
                              disabled={isStorePending}
                              spellCheck={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* OPERATIONAL TAB */}
            <TabsContent value="operational" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>
                    Default text for invoice footer.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="warranty_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>
                          Warranty Policy
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className={`${textareaStyle} min-h-37.5`}
                            disabled={isStorePending}
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            {/* PAYMENT TAB */}
            <TabsContent value="payment" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Bank accounts or payment instructions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="payment_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelStyle}>
                          Bank Details
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className={`${textareaStyle} min-h-25`}
                            disabled={isStorePending}
                            spellCheck={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="integrations" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" /> WhatsApp Integration
                  </CardTitle>
                  <CardDescription>
                    Hubungkan nomor WhatsApp untuk mengirim notifikasi otomatis
                    ke pelanggan.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* LOGIKA TAMPILAN BARU */}
                  {!isWaActive ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-muted/30 border border-dashed border-border rounded-lg text-center">
                      <Smartphone className="h-10 w-10 text-muted-foreground mb-3" />
                      <h3 className="text-sm font-semibold mb-1">
                        WhatsApp is Idle
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm mb-4">
                        Klik tombol di bawah untuk mengecek status koneksi saat
                        ini atau memunculkan QR Code baru.
                      </p>
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsWaActive(true);
                        }}
                        variant="outline"
                      >
                        Check Status / Connect Device
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-start gap-6 bg-muted/30 p-6 rounded-lg border border-border/50">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              waData?.status === "connected"
                                ? "bg-green-500 animate-pulse"
                                : "bg-destructive"
                            }`}
                          />
                          <span className="font-semibold text-sm">
                            Status:{" "}
                            {waData?.status === "connected"
                              ? "Connected"
                              : waData?.status === "loading_qr"
                                ? "Waiting for Scan..."
                                : "Disconnected"}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                          Gunakan WhatsApp Bisnis atau WA reguler toko Anda.
                          Jika nomor terblokir, klik "Disconnect" lalu scan
                          ulang menggunakan nomor yang baru.
                        </p>

                        <div className="pt-2 h-10 flex gap-2">
                          {waData?.status === "connected" ? (
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                disconnectMutation.mutate(undefined, {
                                  onSuccess: () => setIsWaActive(false),
                                });
                              }}
                              disabled={disconnectMutation.isPending}
                              variant="destructive"
                              size="sm"
                              className="gap-2 cursor-pointer"
                            >
                              {disconnectMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <PowerOff className="h-4 w-4" />
                              )}
                              Disconnect Device
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsWaActive(false);
                              }}
                              variant="secondary"
                              size="sm"
                            >
                              Stop Polling
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="w-full md:w-48 aspect-square bg-white border border-border rounded-xl flex items-center justify-center shadow-inner overflow-hidden p-2">
                        {isWaLoading ? (
                          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        ) : waData?.status === "connected" ? (
                          <div className="flex flex-col items-center text-center p-2">
                            <Smartphone className="h-10 w-10 text-green-500 mb-2" />
                            <p className="text-xs font-bold text-green-500">
                              Device Linked
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              Ready to send messages
                            </p>
                          </div>
                        ) : waData?.status === "loading_qr" &&
                          waData.qr_code ? (
                          <img
                            src={waData.qr_code}
                            alt="WhatsApp QR Code"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center text-center p-4">
                            <QrCode className="h-10 w-10 text-muted-foreground/30 mb-2 animate-pulse" />
                            <p className="text-[10px] text-muted-foreground">
                              Generating QR...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="mt-auto sticky bottom-0 z-20 flex justify-end gap-3 bg-background py-4 border-t border-border">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isButtonDisabled}
              className="w-full sm:w-auto bg-primary text-foreground cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Changes
            </Button>
          </div>
        </form>
      </Form>
      <PreviewSettingDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onConfirm={onFinalSubmit}
        isPending={updateMutation.isPending}
        data={currentFormData}
      />
    </div>
  );
};

export default DashboardSettingPage;
