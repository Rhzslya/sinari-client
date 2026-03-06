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
import { maskEmail, type LoginUserRequest } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { AlertCircle, AlertTriangle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckEmailCard } from "../fragments/CheckEmailCard";
import { GoogleSignInFragments } from "../fragments/GoogleSignIn";
import { useGoogleLogin } from "@react-oauth/google";
import { useCooldown } from "@/hooks/use-cooldown";
import { clearAuthCache } from "@/components/utils/clearAuthCache";
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

export function LoginForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [showUnverifiedCard, setShowUnverifiedCard] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const [email, setEmail] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  const { cooldown, startCooldown } = useCooldown(identifier);

  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("login_block");

  const [isVerifiedNow, setIsVerifiedNow] = useState(false);
  const [isDailyLimit, setIsDailyLimit] = useState(false);

  const [showInitialCheckEmail, setShowInitialCheckEmail] = useState(true);

  useEffect(() => {
    if (!identifier) return;

    const targetKey = `resend_verif_${identifier.toLowerCase()}`;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === targetKey && e.newValue) {
        const targetTime = parseInt(e.newValue);
        const now = Date.now();
        const remaining = Math.ceil((targetTime - now) / 1000);

        if (remaining > 0) {
          startCooldown(remaining, identifier);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [identifier, startCooldown]);

  const form = useForm<LoginUserRequest>({
    resolver: zodResolver(UserValidation.LOGIN),
    mode: "all",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const handleBackToLogin = () => {
    setShowUnverifiedCard(false);
    setGlobalError(null);
    setEmail(null);
    setCardError(null);
    setIsVerifiedNow(false);
  };

  async function onSubmit(data: LoginUserRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setShowUnverifiedCard(false);
    setEmail(null);
    setCardError(null);
    setIsDailyLimit(false);

    try {
      setIdentifier(data.identifier);

      await AuthServices.login(data);

      clearAuthCache(data.identifier);
      navigate("/");
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

      if (isAxiosError(error) && error.response?.status === 403) {
        if (message.toLowerCase().includes("not verified")) {
          setShowInitialCheckEmail(true);
          setGlobalError(null);

          try {
            const res = await AuthServices.resendVerification({
              identifier: data.identifier,
            });

            if (res && res.email) {
              setEmail(res.email);
            }
            startCooldown(60, data.identifier);
          } catch (resendError) {
            const resendMsg = getErrorMessage(resendError);

            if (isAxiosError(resendError)) {
              const status = resendError.response?.status;

              if (status === 400 && resendMsg.toLowerCase().includes("wait")) {
                const [cooldownMsg, cachedEmail] = resendMsg.split("|");

                const match = cooldownMsg.match(/(\d+)(?:s|\s+seconds)/i);
                if (match && match[1]) {
                  startCooldown(parseInt(match[1], 10), data.identifier);

                  if (cachedEmail) {
                    setEmail(cachedEmail);
                  }
                }
              } else if (status === 429) {
                setShowInitialCheckEmail(false);
                setCardError(resendMsg.split("|")[0]);
                setIsDailyLimit(true);
              } else {
                setCardError(resendMsg.split("|")[0]);
              }
            } else {
              setCardError(resendMsg.split("|")[0]);
            }
          } finally {
            setShowUnverifiedCard(true);
          }
        } else {
          setGlobalError(message);
        }
      } else {
        setGlobalError(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!identifier) return;
    setResendLoading(true);
    setIsVerifiedNow(false);
    setCardError(null);
    setShowInitialCheckEmail(true);

    try {
      const response = await AuthServices.resendVerification({ identifier });

      if (response && response.email) {
        setEmail(response.email);
        startCooldown(60, response.email);
      }

      startCooldown(60, identifier);
    } catch (error) {
      const message = getErrorMessage(error);

      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400 && message.toLowerCase().includes("wait")) {
          const [cooldownMsg, cachedEmail] = message.split("|");

          const match = cooldownMsg.match(/(\d+) seconds/);
          if (match && match[1]) {
            startCooldown(parseInt(match[1], 10), identifier);

            if (cachedEmail) {
              setEmail(cachedEmail);
            }
          }
          setCardError(null);
          return;
        }

        if (status === 400 && message.toLowerCase().includes("verified")) {
          setIsVerifiedNow(true);
          setCardError(null);
          return;
        }

        if (status === 429) {
          setShowInitialCheckEmail(false);
          setCardError(message.split("|")[0]);
          setIsDailyLimit(true);
          return;
        }
      }

      setCardError(message.split("|")[0]);
    } finally {
      setResendLoading(false);
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      setIsGoogleLoading(true);
      setGlobalError(null);
      try {
        await AuthServices.googleLogin({
          token: codeResponse.code,
        });
        navigate("/");
      } catch (error) {
        setGlobalError(getErrorMessage(error));
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setGlobalError(t("auth.common.google_failed"));
    },
  });

  useEffect(() => {
    if (
      blockCooldown === 0 &&
      globalError === t("auth.common.too_many_attempts")
    ) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError, t]);

  if (showUnverifiedCard) {
    const isWaitingEmail =
      !isVerifiedNow && !cardError && (cooldown > 0 || showInitialCheckEmail);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckEmailCard
          variant="default"
          title={
            isVerifiedNow
              ? t("auth.verify.verified_title")
              : cardError
                ? t("auth.verify.failed_title")
                : isWaitingEmail
                  ? t("auth.verify.check_email_title")
                  : t("auth.verify.not_verified_title")
          }
          message={
            isVerifiedNow ? (
              <div className="text-center">
                <span className="text-sm text-muted-foreground mt-2 block">
                  {t("auth.verify.verified_msg")}
                </span>
              </div>
            ) : cardError ? (
              <div className="text-center">
                <span className="text-destructive font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="size-4" />
                  {cardError}
                </span>
                <br />
              </div>
            ) : isWaitingEmail ? (
              <div className="text-center">
                <span>
                  {t("auth.verify.check_email_msg_1")}
                  <br />
                  {t("auth.verify.check_email_msg_2")}{" "}
                  <br className="sm:hidden" />
                  <strong className="break-all">
                    {email ? email : t("auth.verify.registered_email")}
                  </strong>
                  .
                </span>
              </div>
            ) : (
              <div className="text-center px-1">
                <span>
                  {t("auth.verify.not_verified_msg_1")}{" "}
                  <strong className="break-all">{identifier}</strong>{" "}
                  {t("auth.verify.not_verified_msg_2")}
                </span>

                {email && (
                  <div className="mt-1">
                    {t("auth.verify.linked_email")}{" "}
                    <strong className="break-all">{maskEmail(email)}</strong>
                  </div>
                )}

                <p className="mt-2 text-sm text-muted-foreground">
                  {t("auth.verify.check_inbox")}
                </p>
              </div>
            )
          }
          buttonResend={
            isVerifiedNow
              ? t("auth.verify.btn_login_now")
              : t("auth.verify.btn_resend")
          }
          buttonNavigate={
            isVerifiedNow ? null : t("auth.verify.btn_back_login")
          }
          onActionResend={isVerifiedNow ? handleBackToLogin : handleResend}
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
              {t("auth.login.title")}
            </CardTitle>
            <CardDescription className="text-center text-muted text-sm sm:text-base px-2">
              {t("auth.login.subtitle")}
            </CardDescription>
          </CardHeader>
        </motion.div>

        <CardContent className="relative mt-2 sm:mt-6 pb-8">
          {/* Animated Error Banner */}
          <AnimatePresence initial={false}>
            {globalError && (
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
                      {t("auth.login.rate_limit_title")}
                    </p>
                    <p
                      className="text-xs opacity-90 text-center font-medium"
                      dangerouslySetInnerHTML={{
                        __html: t("auth.login.rate_limit_desc").replace(
                          "{{seconds}}",
                          String(blockCooldown),
                        ),
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
                          autoComplete="off"
                          placeholder={t("auth.login.identifier")}
                          {...field}
                          disabled={isLoading}
                          className="bg-card-foreground border-muted text-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none h-11 sm:h-10 text-base sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 sm:-bottom-4 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative mb-8 sm:mb-8">
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="off"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.login.password")}
                            {...field}
                            disabled={isLoading}
                            className="bg-card-foreground border-muted text-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pr-10 shadow-none h-11 sm:h-10 text-base sm:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 sm:top-2.5 text-muted-foreground hover:text-primary transition-colors outline-none cursor-pointer"
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
                      <FormMessage className="absolute top-11 sm:top-10 left-0 text-[10px] sm:text-xs" />
                      <div className="text-right mt-1 sm:mt-1.5">
                        <button
                          type="button"
                          className="text-[11px] sm:text-xs text-muted font-medium hover:text-primary transition-colors cursor-pointer outline-none focus-visible:underline"
                          onClick={() => navigate("/forgot-password")}
                        >
                          {t("auth.login.forgot_pwd")}
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  className="w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-secondary-foreground h-11 sm:h-10"
                  type="submit"
                  disabled={!form.formState.isValid || isFormDisabled}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    </>
                  ) : blockCooldown > 0 ? (
                    t("auth.common.try_again").replace(
                      "{{seconds}}",
                      String(blockCooldown),
                    )
                  ) : (
                    t("auth.login.btn_submit")
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div variants={itemVariants} className="mt-6">
            <GoogleSignInFragments
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading || isFormDisabled}
              variant="light"
            />
          </motion.div>
        </CardContent>
      </Card>

      <motion.nav
        variants={itemVariants}
        className="w-full text-center text-xs sm:text-sm text-muted-foreground mt-4"
      >
        {t("auth.login.no_account")}{" "}
        <button
          className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer outline-none focus-visible:ring-1 rounded px-1"
          onClick={() => navigate("/register")}
        >
          {t("auth.login.create_account")}
        </button>
      </motion.nav>
    </motion.div>
  );
}
