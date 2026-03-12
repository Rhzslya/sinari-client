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
import { type RegisterUserRequest } from "@/model/user-model";
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

export function RegisterForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredUsername, setRegisteredUsername] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const { cooldown, startCooldown } = useCooldown(registeredEmail);

  // Cooldown untuk Rate Limit / Brute Force
  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("register_block", "ratelimit_");

  const [cardError, setCardError] = useState<string | null>(null);
  const [isVerifiedNow, setIsVerifiedNow] = useState(false);
  const [isDailyLimit, setIsDailyLimit] = useState(false);

  useEffect(() => {
    if (
      blockCooldown === 0 &&
      globalError === t("auth.common.too_many_attempts")
    ) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError, t]);

  useEffect(() => {
    if (!registeredUsername || !registeredEmail) return;

    const usernameKey = `resend_verif_${registeredUsername.toLowerCase()}`;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === usernameKey && e.newValue) {
        const targetTime = parseInt(e.newValue);
        const now = Date.now();
        const remaining = Math.ceil((targetTime - now) / 1000);

        if (remaining > 0) {
          startCooldown(remaining, registeredEmail);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [registeredUsername, registeredEmail, startCooldown]);

  const form = useForm<RegisterUserRequest>({
    resolver: zodResolver(UserValidation.REGISTER),
    mode: "all",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
      secondary_number: "", // Honeypot
    },
  });

  async function onSubmit(data: RegisterUserRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setIsDailyLimit(false);

    const usernameKey = `verif_email_cache_${data.username.toLowerCase()}`;
    const emailKey = `verif_email_cache_${data.email.toLowerCase()}`;

    try {
      await AuthServices.register(data);
      setRegisteredEmail(data.email);
      setRegisteredUsername(data.username);
      setIsSuccess(true);

      localStorage.setItem(usernameKey, data.email);
      localStorage.setItem(emailKey, data.email);

      startCooldown(60, data.email);
      startCooldown(60, data.username);
    } catch (error) {
      // Tangkap error Rate Limit (429) secara spesifik
      if (isAxiosError(error) && error.response?.status === 429) {
        const rawMessage =
          error.response.data?.errors || getErrorMessage(error);
        const match = rawMessage.match(/(\d+)(?:s|\s+seconds)/i);
        const seconds = match && match[1] ? parseInt(match[1], 10) : 60;

        startBlockCooldown(seconds);
        setGlobalError(null);
        return;
      }

      setGlobalError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setIsVerifiedNow(false);

    try {
      await AuthServices.resendVerification({ identifier: registeredEmail });

      startCooldown(60, registeredEmail);
      if (registeredUsername) {
        startCooldown(60, registeredUsername);
      }

      setCardError(null);
    } catch (error) {
      const message = getErrorMessage(error);
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 400 && message.toLowerCase().includes("verified")) {
          setIsVerifiedNow(true);
          setCardError(null);
          return;
        }

        if (status === 400 && message.toLowerCase().includes("wait")) {
          const match = message.match(/(\d+)(?:s|\s+seconds)/i);
          if (match && match[1]) {
            startCooldown(parseInt(match[1], 10));
          }
          setCardError(null);
          return;
        }

        if (status === 429) {
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

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <CheckEmailCard
          variant="transparent"
          title={
            isVerifiedNow
              ? t("auth.verify.verified_title")
              : cardError
                ? t("auth.verify.failed_title")
                : t("auth.verify.reg_success_title")
          }
          message={
            isVerifiedNow ? (
              <div className="text-center">
                <br />
                <span className="text-sm text-muted-foreground mt-2 block">
                  {t("auth.verify.verified_reg_msg")}
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
            ) : (
              <div className="text-center">
                <span>
                  {t("auth.verify.check_email_msg_1")}
                  <br />
                  {t("auth.verify.check_email_msg_2")}{" "}
                  <br className="sm:hidden" />
                  <strong className="break-all">{registeredEmail}</strong>.
                </span>
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
          onActionResend={
            isVerifiedNow ? () => navigate("/login") : handleResend
          }
          onActionNavigate={() => navigate("/login")}
          isLoading={resendLoading}
          cooldown={cooldown}
          isDisabled={isDailyLimit}
        />
      </motion.div>
    );
  }

  // Cek apakah seluruh form harus dinonaktifkan
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
          <CardHeader className="space-y-1 sm:space-y-2 px-0 pt-8">
            <CardTitle className="text-center text-2xl sm:text-3xl font-bold text-primary tracking-tight">
              {t("auth.register.title")}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm sm:text-base px-2">
              {t("auth.register.subtitle")}
            </CardDescription>
          </CardHeader>
        </motion.div>

        <CardContent className="relative mt-2 sm:mt-6 px-0 pb-8">
          {/* Animated Error Banner */}
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

            {/* Banner Khusus Rate Limit (Too many attempts) */}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="relative mb-6 sm:mb-8">
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t("auth.register.email")}
                          {...field}
                          disabled={isFormDisabled}
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 h-11 sm:h-10 text-base sm:text-sm"
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
                  name="username"
                  render={({ field }) => (
                    <FormItem className="relative mb-6 sm:mb-8">
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t("auth.register.username")}
                          {...field}
                          disabled={isFormDisabled}
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 h-11 sm:h-10 text-base sm:text-sm"
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="relative mb-6 sm:mb-8">
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          placeholder={t("auth.register.name")}
                          {...field}
                          disabled={isFormDisabled}
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 h-11 sm:h-10 text-base sm:text-sm"
                        />
                      </FormControl>
                      <FormMessage className="absolute -bottom-5 sm:-bottom-4 left-0 text-[10px] sm:text-xs" />
                    </FormItem>
                  )}
                />
              </motion.div>

              {/* HONEYPOT FIELD - DONT TOUCH IT */}
              <div
                className="absolute opacity-0 w-0 h-0 -z-50 overflow-hidden pointer-events-none select-none"
                aria-hidden="true"
              >
                <FormField
                  control={form.control}
                  name="secondary_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="nope"
                          tabIndex={-1}
                          placeholder="Secondary Phone Number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative mb-8">
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="nope"
                            type={showPassword ? "text" : "password"}
                            placeholder={t("auth.register.password")}
                            {...field}
                            disabled={isFormDisabled}
                            className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 pr-10 h-11 sm:h-10 text-base sm:text-sm"
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
                <Button
                  className="w-full mt-2 text-sm text-foreground font-semibold shadow-lg shadow-primary/20 cursor-pointer h-11 sm:h-10"
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
                    t("auth.register.btn_submit")
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>

          <motion.div variants={itemVariants} className="mt-6">
            <GoogleSignInFragments
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading || isFormDisabled}
              variant="default"
            />
          </motion.div>
        </CardContent>
      </Card>

      <motion.nav
        variants={itemVariants}
        className="w-full text-center text-xs sm:text-sm text-muted-foreground"
      >
        {t("auth.register.have_account")}{" "}
        <button
          className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer outline-none focus-visible:ring-1 rounded px-1 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => !isFormDisabled && navigate("/login")}
          disabled={isFormDisabled}
        >
          {t("auth.register.sign_in")}
        </button>
      </motion.nav>
    </motion.div>
  );
}
