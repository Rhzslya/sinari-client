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
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckEmailCard } from "../fragments/CheckEmailCard";
import { GoogleSignInFragments } from "../fragments/GoogleSignIn";
import { useGoogleLogin } from "@react-oauth/google";
import { useCooldown } from "@/hooks/use-cooldown";
import { isAxiosError } from "axios";

export function RegisterForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [registeredUsername, setRegisteredUsername] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const { cooldown, startCooldown } = useCooldown(registeredEmail);

  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("register_block");

  const [cardError, setCardError] = useState<string | null>(null);
  const [isVerifiedNow, setIsVerifiedNow] = useState(false);
  const [isDailyLimit, setIsDailyLimit] = useState(false);

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
      const message = getErrorMessage(error);

      if (isAxiosError(error) && error.response?.status === 429) {
        const match = message.match(/(\d+) seconds/);
        if (match && match[1]) {
          const seconds = parseInt(match[1], 10);
          startBlockCooldown(seconds);
          setGlobalError("Too many attempts. Please wait before trying again.");
          return;
        }
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
          const match = message.match(/(\d+) seconds/);
          if (match && match[1]) {
            startCooldown(parseInt(match[1], 10));
          }
          setCardError(null);
          return;
        }

        if (status === 429) {
          setCardError(message);
          setIsDailyLimit(true);
          return;
        }
      }
      setCardError(message);
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

  useEffect(() => {
    if (blockCooldown === 0 && globalError?.includes("Too many attempts")) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError]);

  if (isSuccess) {
    return (
      <CheckEmailCard
        variant="transparent"
        title={
          isVerifiedNow
            ? "Account Verified!"
            : cardError
              ? "Failed to Send"
              : "Registration Success"
        }
        message={
          isVerifiedNow ? (
            <div className="text-center">
              <br />
              <span className="text-sm text-muted-foreground mt-2 block">
                Your account is active. You can now login.
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
                Please check your email to verify your account.
                <br />A verification link has been sent to{" "}
                <br className="sm:hidden" />
                <strong className="break-all">{registeredEmail}</strong>.
              </span>
            </div>
          )
        }
        buttonResend={isVerifiedNow ? "Login Now" : "Resend Verification Email"}
        buttonNavigate={isVerifiedNow ? null : "Back to Login"}
        onActionResend={isVerifiedNow ? () => navigate("/login") : handleResend}
        onActionNavigate={() => navigate("/login")}
        isLoading={resendLoading}
        cooldown={cooldown}
        isDisabled={isDailyLimit}
      />
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="bg-transparent border-none shadow-none text-foreground">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-primary tracking-tight">
            Sinari Cell
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base">
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="relative mt-6">
          {globalError && (
            <div className="absolute -top-10 flex justify-center left-0 w-full px-6 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-destructive/20 w-full px-4 py-2 rounded-md text-destructive flex items-center justify-center gap-2 border border-destructive/20 shadow-sm">
                <AlertCircle className="size-4" />
                <span className="text-sm font-medium">{globalError}</span>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Email"
                        {...field}
                        disabled={isLoading}
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Username"
                        {...field}
                        disabled={isLoading}
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2"
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        autoComplete="off"
                        placeholder="Full Name"
                        {...field}
                        disabled={isLoading}
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2"
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
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2"
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
                    <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full mt-2 text-sm text-foreground font-semibold shadow-lg shadow-primary/20"
                type="submit"
                disabled={
                  !form.formState.isValid || isLoading || blockCooldown > 0
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  </>
                ) : blockCooldown > 0 ? (
                  `Try again in ${blockCooldown}s`
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <GoogleSignInFragments
              onClick={handleGoogleLogin}
              isLoading={isGoogleLoading}
            />
          </div>
        </CardContent>
      </Card>

      <nav className="w-full text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Sign in
        </button>
      </nav>
    </div>
  );
}
