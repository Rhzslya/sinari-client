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
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { SettingSkeleton } from "@/features/fragments/Skeleton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const DashboardSettingPage = () => {
  const { t } = useTranslation();
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
      store_hours: "",
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
    store_hours: watchedValues.store_hours || "",
  };

  const isButtonDisabled =
    isStorePending ||
    !watchedValues.store_name ||
    !watchedValues.store_address ||
    !watchedValues.store_phone ||
    !watchedValues.store_email ||
    !watchedValues.store_website ||
    !watchedValues.warranty_text ||
    !watchedValues.payment_info ||
    !watchedValues.store_hours;

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

  const hasError = isStoreError || isWaError;
  const anyError = storeError || waError;

  if (isStoreLoading) {
    return <SettingSkeleton />;
  }

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
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 px-4 text-center">
        <p className="text-destructive font-medium text-lg">
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
          className="text-foreground cursor-pointer duration-300"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // GLOBAL STYLES
  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-xs sm:text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-9";
  const labelStyle =
    "text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider";
  const textareaStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-2 text-xs sm:text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 resize-none leading-relaxed";

  return (
    <motion.div
      className="flex flex-col h-full space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <DashboardHeader title={t("settings.header.title")}>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
            {t("settings.header.subtitle")}
          </p>
        </DashboardHeader>
      </motion.div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onHandlePreview)}
          className="flex flex-col flex-1"
        >
          <motion.div variants={itemVariants} className="flex-1">
            <Tabs
              defaultValue="store"
              className="w-full flex flex-col"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              {/* TABS MENU */}
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 p-1 h-auto shrink-0 mb-2">
                <TabsTrigger
                  value="store"
                  className="gap-2 h-9 sm:h-10 text-[10px] sm:text-xs font-medium cursor-pointer"
                >
                  <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{t("settings.tabs.store")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="operational"
                  className="gap-2 h-9 sm:h-10 text-[10px] sm:text-xs font-medium cursor-pointer"
                >
                  <Settings2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{t("settings.tabs.policy")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  className="gap-2 h-9 sm:h-10 text-[10px] sm:text-xs font-medium cursor-pointer"
                >
                  <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{t("settings.tabs.payment")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="integrations"
                  className="gap-2 h-9 sm:h-10 text-[10px] sm:text-xs font-medium cursor-pointer"
                >
                  <Blocks className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">{t("settings.tabs.apps")}</span>
                </TabsTrigger>
              </TabsList>

              {/* TABS CONTENT: STORE */}
              <TabsContent value="store" className="mt-2 outline-none">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/30">
                    <CardTitle className="text-base sm:text-lg">
                      {t("settings.store_profile.title")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("settings.store_profile.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="store_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            {t("settings.store_profile.name")}
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
                          <FormMessage className="text-[10px] sm:text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="store_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            {t("settings.store_profile.address")}
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
                          <FormMessage className="text-[10px] sm:text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Split 2 Kolom di Desktop, Atas-Bawah di Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="store_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelStyle}>
                              {t("settings.store_profile.phone")}
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
                            <FormMessage className="text-[10px] sm:text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="store_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelStyle}>
                              {t("settings.store_profile.email")}
                            </FormLabel>
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
                            <FormMessage className="text-[10px] sm:text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="store_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            {t("settings.store_profile.hours")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Senin - Sabtu: 09.00 - 21.00 WIB&#10;Minggu: Tutup"
                              className={`${textareaStyle} min-h-25`}
                              disabled={isStorePending}
                              spellCheck={false}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] sm:text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TABS CONTENT: OPERATIONAL */}
              <TabsContent value="operational" className="mt-2 outline-none">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/30">
                    <CardTitle className="text-base sm:text-lg">
                      {t("settings.operational.title")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("settings.operational.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <FormField
                      control={form.control}
                      name="warranty_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            {t("settings.operational.warranty_label")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className={`${textareaStyle} min-h-37.5 sm:min-h-50`}
                              disabled={isStorePending}
                              spellCheck={false}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] sm:text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TABS CONTENT: PAYMENT */}
              <TabsContent value="payment" className="mt-2 outline-none">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/30">
                    <CardTitle className="text-base sm:text-lg">
                      {t("settings.payment_info.title")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("settings.payment_info.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <FormField
                      control={form.control}
                      name="payment_info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelStyle}>
                            {t("settings.payment_info.bank_label")}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className={`${textareaStyle} min-h-37.5 sm:min-h-50`}
                              disabled={isStorePending}
                              spellCheck={false}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] sm:text-xs" />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* TABS CONTENT: INTEGRATIONS */}
              <TabsContent value="integrations" className="mt-2 outline-none">
                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4 border-b border-border/30">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                      {t("settings.whatsapp.title")}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {t("settings.whatsapp.desc")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    {!isWaActive ? (
                      <div className="flex flex-col items-center justify-center p-6 sm:p-10 bg-muted/20 border border-dashed border-border/60 rounded-xl text-center transition-colors hover:bg-muted/30">
                        <Smartphone className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-sm sm:text-base font-semibold mb-1">
                          {t("settings.whatsapp.idle_title")}
                        </h3>
                        <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                          {t("settings.whatsapp.idle_desc")}
                        </p>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsWaActive(true);
                          }}
                          className="w-full sm:w-1/4 cursor-pointer text-foreground duration-300"
                        >
                          {t("settings.whatsapp.btn_check")}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 bg-muted/10 p-5 sm:p-8 rounded-xl border border-border/50 shadow-inner">
                        {/* Info Section */}
                        <div className="flex-1 space-y-4 w-full text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2.5">
                            <span className="relative flex h-3 w-3">
                              {waData?.status === "connected" && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              )}
                              <span
                                className={`relative inline-flex rounded-full h-3 w-3 ${
                                  waData?.status === "connected"
                                    ? "bg-green-500"
                                    : "bg-destructive"
                                }`}
                              ></span>
                            </span>
                            <span className="font-semibold text-xs sm:text-sm">
                              {t("settings.whatsapp.status_label")}:{" "}
                              {waData?.status === "connected"
                                ? t("settings.whatsapp.status_connected")
                                : waData?.status === "loading_qr"
                                  ? t("settings.whatsapp.status_waiting")
                                  : t("settings.whatsapp.status_disconnected")}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed md:max-w-sm mx-auto md:mx-0">
                            {t("settings.whatsapp.instruction")}
                          </p>

                          <div className="pt-2 flex gap-3 justify-center md:justify-start w-full">
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
                                className="gap-2 cursor-pointer w-full sm:w-1/4 h-9 duration-300"
                              >
                                {disconnectMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <PowerOff className="h-4 w-4" />
                                )}
                                <span className="text-xs sm:text-sm">
                                  {t("settings.whatsapp.btn_disconnect")}
                                </span>
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
                                className="w-full sm:w-1/4 h-9 cursor-pointer duration-300 text-foreground"
                              >
                                <span className="text-xs sm:text-sm">
                                  {t("settings.whatsapp.btn_stop")}
                                </span>
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="w-48 sm:w-56 shrink-0 aspect-square bg-white border border-border/80 rounded-2xl flex items-center justify-center shadow-sm overflow-hidden p-3 transition-all duration-500">
                          {isWaLoading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          ) : waData?.status === "connected" ? (
                            <div className="flex flex-col items-center text-center p-2">
                              <Smartphone className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-2 sm:mb-3 drop-shadow-sm" />
                              <p className="text-xs sm:text-sm font-bold text-green-600">
                                {t("settings.whatsapp.linked_title")}
                              </p>
                              <p className="text-[10px] sm:text-xs text-muted-foreground/80 mt-1 leading-tight">
                                {t("settings.whatsapp.linked_desc")}
                              </p>
                            </div>
                          ) : waData?.status === "loading_qr" &&
                            waData.qr_code ? (
                            <img
                              src={waData.qr_code}
                              alt="WhatsApp QR Code"
                              className="w-full h-full object-contain rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center text-center p-4">
                              <QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/20 mb-2 sm:mb-3 animate-pulse" />
                              <p className="text-[10px] sm:text-xs text-muted-foreground/60 leading-tight">
                                {t("settings.whatsapp.generating_qr")}
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
          </motion.div>

          {/* FOOTER ACTION (STICKY) */}
          <motion.div
            variants={itemVariants}
            className="sticky bottom-0 z-30 pt-4 pb-2 sm:py-4 mt-6 bg-background/95 backdrop-blur border-t border-border flex justify-end px-1"
          >
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isButtonDisabled}
              className="w-full sm:w-1/4 bg-primary text-foreground cursor-pointer h-10 sm:h-11 font-medium shadow-sm transition-all duration-300 active:scale-[0.98]"
            >
              <Eye className="mr-2 h-4 w-4" />
              <span className="text-sm">
                {t("settings.footer.btn_preview")}
              </span>
            </Button>
          </motion.div>
        </form>
      </Form>

      <PreviewSettingDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onConfirm={onFinalSubmit}
        isPending={updateMutation.isPending}
        data={currentFormData}
      />
    </motion.div>
  );
};

export default DashboardSettingPage;
