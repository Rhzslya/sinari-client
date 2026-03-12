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
import { AlertCircle, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CheckEmailCard } from "../fragments/CheckEmailCard";
import type { ForgotPasswordRequest } from "@/model/user-model";
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

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const { cooldown, startCooldown } = useCooldown(identifier, "reset_pass_");

  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("forgot_pass_block", "ratelimit_");

  const [isDailyLimit, setIsDailyLimit] = useState(false);

  const form = useForm<ForgotPasswordRequest>({
    resolver: zodResolver(UserValidation.FORGOT_PASSWORD),
    mode: "onChange",
    defaultValues: {
      identifier: "",
    },
  });

  const handleBackToLogin = () => {
    navigate("/login");
  };

  async function onSubmit(data: ForgotPasswordRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setIdentifier(data.identifier);
    setIsDailyLimit(false);

    try {
      const response = await AuthServices.forgotPassword(data);
      setEmail(response.email);
      startCooldown(60, data.identifier);
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

      const message = getErrorMessage(error);
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400 && message.toLowerCase().includes("wait")) {
          const [cooldownMsg, cachedEmail] = message.split("|");

          const match = cooldownMsg.match(/(\d+)(?:s|\s+seconds)/i);
          if (match && match[1]) {
            const seconds = parseInt(match[1], 10);
            startCooldown(seconds, data.identifier);

            if (cachedEmail) {
              setEmail(cachedEmail);
            }

            setIsSuccess(true);
            return;
          }
        } else if (status === 429) {
          setIsDailyLimit(true);
          setGlobalError(message.split("|")[0]);
          return;
        }
      }
      setGlobalError(message.split("|")[0]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    if (!identifier) return;

    setResendLoading(true);
    setCardError(null);

    try {
      const response = await AuthServices.forgotPassword({ identifier });
      if (response && response.email) {
        setEmail(response.email);
      }
      startCooldown(60, identifier);
      setIsDailyLimit(false);
    } catch (error) {
      const message = getErrorMessage(error);

      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400 && message.toLowerCase().includes("wait")) {
          const [cooldownMsg, cachedEmail] = message.split("|");

          const match = cooldownMsg.match(/(\d+)(?:s|\s+seconds)/i);
          if (match && match[1]) {
            const seconds = parseInt(match[1], 10);
            startCooldown(seconds, identifier);

            if (cachedEmail) {
              setEmail(cachedEmail);
            }
            setCardError(null);
            return;
          }
        } else if (status === 429) {
          setCardError(message.split("|")[0]);
          setIsDailyLimit(true);
          return;
        }
      }

      setCardError(message.split("|")[0]);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    if (
      blockCooldown === 0 &&
      globalError === t("auth.common.too_many_attempts")
    ) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError, t]);

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckEmailCard
          title={
            cardError
              ? t("auth.forgot.failed_title")
              : t("auth.forgot.check_email_title")
          }
          message={
            cardError ? (
              <div className="text-center">
                <span className="text-destructive font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="size-4" />
                  {cardError}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span>
                  {t("auth.forgot.check_email_msg_1")}
                  <br />
                  {t("auth.forgot.check_email_msg_2")}{" "}
                  <strong>
                    {email ? email : t("auth.forgot.registered_email")}
                  </strong>
                  .
                </span>
              </div>
            )
          }
          buttonResend={
            isDailyLimit
              ? t("auth.forgot.limit_reached")
              : t("auth.forgot.btn_resend")
          }
          buttonNavigate={t("auth.forgot.btn_back")}
          onActionResend={handleResend}
          onActionNavigate={handleBackToLogin}
          isLoading={resendLoading}
          cooldown={cooldown}
          isDisabled={isDailyLimit}
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
      <Card className="bg-card-foreground border-none shadow-2xl shadow-black/10">
        <motion.div variants={itemVariants}>
          <CardHeader className="space-y-1 sm:space-y-2 pt-8">
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {t("auth.forgot.title")}
            </CardTitle>
            <CardDescription className="text-center text-muted text-sm sm:text-base px-2">
              {t("auth.forgot.subtitle_1")}
              <br className="hidden sm:block" />
              {t("auth.forgot.subtitle_2")}
            </CardDescription>
          </CardHeader>
        </motion.div>

        <CardContent className="relative mt-2 sm:mt-6 pb-8">
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
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="relative mb-6 sm:mb-8">
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t("auth.forgot.identifier")}
                          {...field}
                          disabled={isFormDisabled || isDailyLimit}
                          className="bg-card-foreground border-muted text-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none h-11 sm:h-10 text-base sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 sm:-bottom-4 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  className="w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 text-secondary-foreground cursor-pointer h-11 sm:h-10"
                  type="submit"
                  disabled={
                    !form.formState.isValid || isFormDisabled || isDailyLimit
                  }
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
                    t("auth.forgot.btn_submit")
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div variants={itemVariants} className="mt-6 text-center">
            <button
              type="button"
              disabled={isFormDisabled}
              className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer outline-none focus-visible:ring-1 rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="size-4" />
              {t("auth.forgot.btn_back")}
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
