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
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
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

export function LoginForm() {
  const navigate = useNavigate();

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

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleBackToLogin = () => {
    setShowUnverifiedCard(false);
    setGlobalError(null);
    setEmail(null);
    setCardError(null);
    setIsVerifiedNow(false);
  };

  async function onSubmit(data: LoginUserRequest) {
    setIsLoading(true);
    // Reset states
    setGlobalError(null);
    setShowUnverifiedCard(false);
    setEmail(null);
    setCardError(null);
    setIsDailyLimit(false);

    try {
      setIdentifier(data.identifier);

      const result = await AuthServices.login(data);
      localStorage.setItem("token", result.token!);
      localStorage.setItem("role", result.role);

      clearAuthCache(data.identifier);
      navigate("/");
    } catch (error) {
      const message = getErrorMessage(error);

      if (isAxiosError(error) && error.response?.status === 403) {
        if (message.toLowerCase().includes("not verified")) {
          // JANGAN set showUnverifiedCard(true) di sini!
          setShowInitialCheckEmail(true);
          setGlobalError(null);

          // Lakukan proses Auto-Resend sementara tombol Login masih berputar
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

                const match = cooldownMsg.match(/(\d+) seconds/);
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
        const result = await AuthServices.googleLogin({
          token: codeResponse.code,
        });
        localStorage.setItem("token", result.token!);
        navigate("/");
      } catch (error) {
        setGlobalError(getErrorMessage(error));
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      setGlobalError("Failed to connect to Google.");
    },
  });

  if (showUnverifiedCard) {
    const isWaitingEmail =
      !isVerifiedNow && !cardError && (cooldown > 0 || showInitialCheckEmail);
    return (
      <CheckEmailCard
        variant="default"
        title={
          isVerifiedNow
            ? "Account Verified!"
            : cardError
              ? "Failed to Send"
              : isWaitingEmail
                ? "Check Your Email"
                : "Account Not Verified"
        }
        message={
          isVerifiedNow ? (
            <div className="text-center">
              <span className="text-sm text-muted-foreground mt-2 block">
                Your account is active. Please login to continue.
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
                Please check your email to verify your account.
                <br />A verification link has been sent to{" "}
                <br className="sm:hidden" />
                <strong className="break-all">
                  {email ? email : "your registered email"}
                </strong>
                .
              </span>
            </div>
          ) : (
            <div className="text-center px-1">
              <span>
                Your account <strong className="break-all">{identifier}</strong>{" "}
                is not verified yet.
              </span>

              {email && (
                <div className="mt-1">
                  Linked email:
                  <strong className="break-all">{maskEmail(email)}</strong>
                </div>
              )}

              <p className="mt-2 text-sm text-muted-foreground">
                Please check your inbox or click the button below to resend the
                link.
              </p>
            </div>
          )
        }
        buttonResend={isVerifiedNow ? "Login Now" : "Resend Verification Email"}
        buttonNavigate={isVerifiedNow ? null : "Back to Login"}
        onActionResend={isVerifiedNow ? handleBackToLogin : handleResend}
        onActionNavigate={handleBackToLogin}
        isLoading={resendLoading}
        cooldown={cooldown}
        isDisabled={isDailyLimit}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="bg-card-foreground border-none shadow-xl shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl font-bold text-primary tracking-tight">
            Sinari Cell
          </CardTitle>
          <CardDescription className="text-center text-muted text-base">
            Welcome back! Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative mt-6">
          {globalError && (
            <div className="absolute -top-10 flex justify-center left-0 w-full px-6 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-destructive/20 w-full px-4 py-2 rounded-md text-destructive flex items-center justify-center gap-2 border border-destructive/20 shadow-sm">
                <AlertCircle className="size-4" />
                <span className="text-xs font-medium">{globalError}</span>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Email or Username"
                        {...field}
                        disabled={isLoading}
                        className="bg-card-foreground  border-muted text-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="off"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-card-foreground border-muted text-background placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pr-10 shadow-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors outline-none"
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
                    <FormMessage className="absolute top-10 left-0 text-xs" />
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        className="text-xs text-muted font-medium hover:text-primary transition-colors cursor-pointer"
                        onClick={() => navigate("/forgot-password")}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                className={`w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-secondary-foreground`}
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <GoogleSignInFragments
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
              variant="light"
            />
          </div>
        </CardContent>
      </Card>

      <nav className="w-full text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Create an account
        </button>
      </nav>
    </div>
  );
}
