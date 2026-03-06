import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/validation/user-validation";
import { useContactQueries } from "@/hooks/contact-queries";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCooldown } from "@/hooks/use-cooldown";
import type { ContactUsRequest } from "@/model/contact-model";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreSettingQueries } from "@/hooks/store-setting-queries";
import { motion, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const ContactPage = () => {
  const { t } = useTranslation();

  const { useGetPublicSettings } = useStoreSettingQueries();
  const { data: storeData, isLoading: isStoreLoading } = useGetPublicSettings();

  const { sendEmailMutation } = useContactQueries();
  const {
    mutateAsync: sendEmail,
    isPending,
    isError,
    error,
    reset,
  } = sendEmailMutation;

  const { cooldown, startCooldown } = useCooldown("contact_form", "delay_");
  const { cooldown: cooldownRateLimit, startCooldown: startCooldownRateLimit } =
    useCooldown("contact_form", "ratelimit_");

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const location = useLocation();
  const prefilledSubject = location.state?.defaultSubject || "";
  const prefilledMessage = location.state?.defaultMessage || "";

  const isPrivacyRequestMode = !!prefilledSubject && !!prefilledMessage;

  const form = useForm<ContactUsRequest>({
    resolver: zodResolver(UserValidation.CONTACT_US),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      subject: prefilledSubject,
      message: prefilledMessage,
    },
  });

  const isButtonDisabled =
    isPending ||
    !form.formState.isValid ||
    cooldown > 0 ||
    cooldownRateLimit > 0;

  const onSubmit = async (data: ContactUsRequest) => {
    try {
      await sendEmail(data);
      form.reset();
      startCooldown(120);
    } catch {
      // Error
    }
  };

  useEffect(() => {
    if (isRateLimited) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)/);
      const seconds = match ? parseInt(match[1]) : 60;

      if (cooldownRateLimit === 0) {
        startCooldownRateLimit(seconds);
        reset();
      }
    }
  }, [isRateLimited, error, cooldownRateLimit, startCooldownRateLimit, reset]);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary h-12 md:h-10";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-background text-foreground py-12 sm:py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* HEADER SECTION */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* INFO SECTION */}
          <motion.div
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6"
            >
              {t("contact.info.title")}
            </motion.h2>

            <motion.div variants={fadeInUp} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <MapPin className="size-5 sm:size-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {t("contact.info.address")}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {isStoreLoading
                    ? t("contact.info.loading")
                    : storeData?.store_address}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Clock className="size-5 sm:size-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {t("contact.info.hours")}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {isStoreLoading
                    ? t("contact.info.loading")
                    : storeData?.store_hours}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Phone className="size-5 sm:size-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {t("contact.info.phone")}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  {isStoreLoading
                    ? t("contact.info.loading")
                    : storeData?.store_phone}
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Mail className="size-5 sm:size-6" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {t("contact.info.email")}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground break-all">
                  {isStoreLoading
                    ? t("contact.info.loading")
                    : storeData?.store_email}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* FORM SECTION */}
          <motion.div
            className="bg-muted/20 border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm h-fit"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {t("contact.form.title")}
            </h2>

            {isPrivacyRequestMode && (
              <div
                className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-foreground"
                dangerouslySetInnerHTML={{
                  __html: t("contact.form.privacy_mode"),
                }}
              />
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {(cooldownRateLimit > 0 || isRateLimited) && (
                  <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                    <div className="space-y-1 flex flex-col justify-center items-center">
                      <AlertTriangle className="h-7 w-7 shrink-0" />
                      <p className="font-semibold text-xs uppercase text-center">
                        {t("contact.form.rate_limit_title")}
                      </p>
                      <p
                        className="text-xs opacity-90 text-center"
                        dangerouslySetInnerHTML={{
                          __html: t("contact.form.rate_limit_desc").replace(
                            "{{seconds}}",
                            String(cooldownRateLimit).padStart(2, "0"),
                          ),
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="relative grid gap-2 space-y-0 mb-4 sm:mb-4">
                        <FormLabel className={labelStyle}>
                          {t("contact.form.labels.name")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder={t("contact.form.placeholders.name")}
                            disabled={isPending || cooldown > 0}
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative grid gap-2 space-y-0 mb-4 sm:mb-4">
                        <FormLabel className={labelStyle}>
                          {t("contact.form.labels.email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="email"
                            placeholder={t("contact.form.placeholders.email")}
                            disabled={isPending || cooldown > 0}
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem className="relative grid gap-2 space-y-0 mb-4 sm:mb-4">
                        <FormLabel className={labelStyle}>
                          {t("contact.form.labels.phone")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            type="tel"
                            placeholder={t("contact.form.placeholders.phone")}
                            disabled={isPending || cooldown > 0}
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem className="relative grid gap-2 space-y-0 mb-4 sm:mb-4">
                        <FormLabel className={labelStyle}>
                          {t("contact.form.labels.subject")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="off"
                            placeholder={t("contact.form.placeholders.subject")}
                            disabled={isPending || cooldown > 0}
                            readOnly={isPrivacyRequestMode}
                            className={inputStyle}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="relative grid gap-2 space-y-0 mb-6 sm:mb-8">
                      <FormLabel className={labelStyle}>
                        {t("contact.form.labels.message")}
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={isPrivacyRequestMode ? 12 : 5}
                          placeholder={t("contact.form.placeholders.message")}
                          disabled={isPending || cooldown > 0}
                          className={`flex w-full bg-input/50 border border-border rounded-md px-3 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none 
                            [&::-webkit-scrollbar]:w-1 
                            [&::-webkit-scrollbar-track]:bg-transparent 
                            [&::-webkit-scrollbar-thumb]:bg-primary/20 
                            [&::-webkit-scrollbar-thumb]:rounded-full 
                            hover:[&::-webkit-scrollbar-thumb]:bg-primary`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full sm:w-1/2 lg:w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300 mt-4 h-12 md:h-10"
                  type="submit"
                  disabled={isButtonDisabled}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("contact.form.processing")}
                    </>
                  ) : cooldown > 0 ? (
                    t("contact.form.cooldown").replace(
                      "{{seconds}}",
                      String(cooldown),
                    )
                  ) : (
                    t("contact.form.submit")
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
