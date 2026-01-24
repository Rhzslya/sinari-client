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
import { handleApiError } from "@/lib/utils";
import { type LoginRequest } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckEmailCard } from "./fragments/CheckEmailCard";
import { GoogleSignInFragments } from "./fragments/GoogleSignIn";
import { useGoogleLogin } from "@react-oauth/google";
import { useCooldown } from "@/hooks/use-cooldown";

export function LoginForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [showUnverifiedCard, setShowUnverifiedCard] = useState(false);

  const [resendLoading, setResendLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");

  const { cooldown, startCooldown, setCooldown } = useCooldown(identifier);

  const [email, setEmail] = useState<string | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);

  const [isVerifiedNow, setIsVerifiedNow] = useState(false);

  const [isDailyLimit, setIsDailyLimit] = useState(false);

  // useEffect(() => {
  //   if (cooldown <= 0) return;
  //   const timer = setInterval(() => {
  //     setCooldown((prev) => prev - 1);
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, [cooldown]);

  const form = useForm<LoginRequest>({
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

  async function onSubmit(data: LoginRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setShowUnverifiedCard(false);
    setEmail(null);
    setCardError(null);
    setIsDailyLimit(false);

    try {
      setIdentifier(data.identifier);

      const result = await AuthServices.login(data);
      localStorage.setItem("token", result.token!);
      navigate("/");
    } catch (error) {
      const rawMessage = handleApiError(error);

      try {
        if (rawMessage.includes("ZodError")) {
          const jsonString = rawMessage.substring(rawMessage.indexOf("{"));
          const errorObj = JSON.parse(jsonString);
          if (errorObj.name === "ZodError" && errorObj.message) {
            const issues = JSON.parse(errorObj.message);
            if (issues.length > 0) {
              setGlobalError(issues[0].message);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Gagal parsing error validation:", e);
      }

      if (rawMessage.toLowerCase().includes("not verified")) {
        setShowUnverifiedCard(true);

        const currentId = data.identifier.toLowerCase();

        let targetTime = localStorage.getItem(`resend_verif_${currentId}`);
        let emailFound = null;

        if (!targetTime) {
          const cacheKey = `verif_email_cache_${currentId}`;
          const cachedEmail = localStorage.getItem(cacheKey);

          console.log("Checking Cache for:", currentId, "Found:", cachedEmail);

          if (cachedEmail) {
            emailFound = cachedEmail;
            targetTime = localStorage.getItem(
              `resend_verif_${cachedEmail.toLowerCase()}`,
            );
          }
        } else {
          emailFound = currentId.includes("@") ? currentId : null;
        }

        if (targetTime) {
          const remaining = Math.ceil(
            (parseInt(targetTime) - Date.now()) / 1000,
          );

          if (remaining > 0) {
            startCooldown(remaining, data.identifier);
            setCooldown(remaining);
          }
        }

        if (emailFound) {
          setEmail(emailFound);
        }
      } else {
        setGlobalError(rawMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!identifier) return;
    setResendLoading(true);
    setIsVerifiedNow(false);

    try {
      const response = await AuthServices.resendVerification(identifier);

      if (response && response.email) {
        setEmail(response.email);

        const cacheKey = `verif_email_cache_${identifier.toLowerCase()}`;
        localStorage.setItem(cacheKey, response.email);

        startCooldown(60, response.email);
      }

      startCooldown(60, identifier);
    } catch (error) {
      const errorMessage = handleApiError(error);

      if (
        errorMessage.toLowerCase().includes("wait") &&
        errorMessage.includes("seconds")
      ) {
        const match = errorMessage.match(/(\d+) seconds/);
        if (match && match[1]) {
          startCooldown(parseInt(match[1], 10));
        }

        setCardError(null);
      } else if (errorMessage.toLowerCase().includes("limit")) {
        setEmail(null);
        setCardError(errorMessage);
        setIsDailyLimit(true);
      } else if (errorMessage.toLowerCase().includes("already verified")) {
        setIsVerifiedNow(true);
        setCardError(null);
      } else {
        setCardError(errorMessage);
      }
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
        console.error("Backend Google Login Failed", error);
        setGlobalError(handleApiError(error));
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => {
      console.error("Google Login Failed from Provider");
      setGlobalError("Failed to connect to Google.");
    },
  });

  if (showUnverifiedCard) {
    return (
      <CheckEmailCard
        variant="default"
        title={
          isVerifiedNow
            ? "Account Verified!"
            : email
              ? "Check Your Email"
              : cardError
                ? "Failed to Send"
                : "Account Not Verified"
        }
        message={
          isVerifiedNow ? (
            <div className="text-center">
              <span className="text-sm text-muted-foreground mt-2 block">
                Your account is active. Please login to continue.
              </span>
            </div>
          ) : email ? (
            <div className="text-center">
              <span>
                Please check your email to verify your account.
                <br />A verification link has been sent to{" "}
                <strong>{email}</strong>.
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
            <>
              Your account <strong>{identifier}</strong> is not verified yet.
              <br />
              Please check your inbox or click the button below to resend the
              link.
            </>
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
          {/* Global Error Alert */}
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
