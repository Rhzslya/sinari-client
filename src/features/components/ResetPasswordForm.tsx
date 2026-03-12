import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/utils";
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CheckEmailCard } from "../fragments/CheckEmailCard";
import { useCooldown } from "@/hooks/use-cooldown";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

type ResetPasswordRequest = z.infer<typeof UserValidation.RESET_PASSWORD>;

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("reset_pass_block", "ratelimit_");

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(UserValidation.RESET_PASSWORD),
    mode: "onChange",
    defaultValues: {
      token: token ?? "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(data: ResetPasswordRequest) {
    if (!data.token) {
      setGlobalError(t("auth.reset.missing_token"));
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      await AuthServices.resetPassword(data);
      setIsSuccess(true);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        const rawMessage =
          error.response.data?.errors || getErrorMessage(error);
        const match = rawMessage.match(/(\d+)(?:s|\s+seconds)/i);
        const seconds = match && match[1] ? parseInt(match[1], 10) : 60;

        startBlockCooldown(seconds);
        setGlobalError(null);
        return;
      }

      const msg = getErrorMessage(error, t("auth.reset.failed_reset"));
      setGlobalError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (
      blockCooldown === 0 &&
      globalError === t("auth.common.too_many_attempts")
    ) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError, t]);

  if (!token) {
    return (
      <motion.div
        className="w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-destructive/10 border-destructive border text-center shadow-none">
          <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
            <AlertCircle className="size-12 text-destructive" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-destructive">
                {t("auth.reset.invalid_link_title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("auth.reset.invalid_link_desc")}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => navigate("/forgot-password")}
              className="cursor-pointer h-11 sm:h-10"
            >
              {t("auth.reset.btn_back_forgot")}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckEmailCard
          title={t("auth.reset.success_title")}
          variant="default"
          message={
            <div className="text-center">
              {t("auth.reset.success_msg_1")}
              <br />
              {t("auth.reset.success_msg_2")}
            </div>
          }
          buttonResend=""
          buttonNavigate={t("auth.reset.btn_go_login")}
          onActionNavigate={() => navigate("/login")}
          isDisabled={true}
        />
      </motion.div>
    );
  }

  const isFormDisabled = isLoading || blockCooldown > 0;

  return (
    <motion.div
      className="w-full max-w-md mx-auto space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="bg-transparent border-none shadow-none text-foreground">
        <motion.div variants={itemVariants}>
          <CardHeader className="space-y-1 sm:space-y-2 pt-8">
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {t("auth.reset.title")}
            </CardTitle>
            <CardDescription className="text-center text-muted text-sm sm:text-base px-2">
              {t("auth.reset.subtitle")}
            </CardDescription>
          </CardHeader>
        </motion.div>

        <CardContent className="relative mt-2 sm:mt-6 pb-8 px-0 sm:px-6">
          <AnimatePresence initial={false}>
            {globalError && blockCooldown === 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-destructive/15 px-4 py-3 rounded-lg text-destructive flex items-start gap-3 border border-destructive/20 shadow-sm">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm font-medium leading-relaxed">
                    {globalError}
                  </span>
                </div>
              </motion.div>
            )}

            {blockCooldown > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex justify-center gap-2 rounded-lg bg-destructive/15 p-4 text-sm text-destructive border border-destructive/20 shadow-sm">
                  <div className="space-y-1 flex flex-col justify-center items-center">
                    <AlertTriangle className="h-6 w-6 shrink-0 mb-1" />
                    <p className="font-semibold text-xs uppercase text-center tracking-wider">
                      {t("auth.login.rate_limit_title", {
                        defaultValue: "Terlalu Banyak Percobaan",
                      })}
                    </p>
                    <p
                      className="text-xs opacity-90 text-center font-medium"
                      dangerouslySetInnerHTML={{
                        __html: t("auth.login.rate_limit_desc", {
                          defaultValue:
                            "Harap tunggu <strong class='font-bold text-sm'>{{seconds}}</strong> detik sebelum mencoba lagi.",
                        }).replace("{{seconds}}", String(blockCooldown)),
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem className="relative mb-6 sm:mb-8">
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="nope"
                            type={showPassword ? "text" : "password"}
                            placeholder={t(
                              "auth.reset.placeholders.new_password",
                            )}
                            {...field}
                            disabled={isFormDisabled}
                            className="bg-foreground border-muted-foreground text-muted placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2 pr-10 h-11 sm:h-10 text-base sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isFormDisabled}
                            className="absolute right-3 top-3 sm:top-2.5 text-muted-foreground hover:text-primary transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            tabIndex={-1}
                          >
                            {showPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 sm:-bottom-4 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="confirm_new_password"
                  render={({ field }) => (
                    <FormItem className="relative mb-8 sm:mb-8">
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="nope"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder={t(
                              "auth.reset.placeholders.confirm_password",
                            )}
                            {...field}
                            disabled={isFormDisabled}
                            className="bg-foreground border-muted-foreground text-muted placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2 pr-10 h-11 sm:h-10 text-base sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isFormDisabled}
                            className="absolute right-3 top-3 sm:top-2.5 text-muted-foreground hover:text-primary transition-colors outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-5" />
                            ) : (
                              <Eye className="size-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 sm:-bottom-4 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  className="w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 text-foreground cursor-pointer h-11 sm:h-10"
                  type="submit"
                  disabled={!form.formState.isValid || isFormDisabled}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    </>
                  ) : blockCooldown > 0 ? (
                    t("auth.common.try_again", {
                      defaultValue: "Coba lagi dalam {{seconds}} dtk",
                    }).replace("{{seconds}}", String(blockCooldown))
                  ) : (
                    t("auth.reset.btn_submit")
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
