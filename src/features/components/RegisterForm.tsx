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
import { type RegisterRequest } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckEmailCard } from "./fragments/CheckEmailCard";
import { GoogleSignInFragments } from "./fragments/GoogleSignInFragments";
import { useGoogleLogin } from "@react-oauth/google";

export function RegisterForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [cardError, setCardError] = useState<string | null>(null);
  const [isVerifiedNow, setIsVerifiedNow] = useState(false);

  const [isDailyLimit, setIsDailyLimit] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(UserValidation.REGISTER),
    mode: "all",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(data: RegisterRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setIsDailyLimit(false);

    try {
      await AuthServices.register(data);
      setRegisteredEmail(data.email);
      setIsSuccess(true);
      setCooldown(60);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setCardError(null);
    setIsVerifiedNow(false);

    try {
      await AuthServices.resendVerification(registeredEmail);
      setCooldown(60);
    } catch (error) {
      const errorMessage = handleApiError(error);

      if (
        errorMessage.toLowerCase().includes("wait") &&
        errorMessage.includes("seconds")
      ) {
        const match = errorMessage.match(/(\d+) seconds/);
        if (match && match[1]) {
          setCooldown(parseInt(match[1], 10));
        }
      } else if (errorMessage.toLowerCase().includes("limit")) {
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

  if (isSuccess) {
    return (
      <CheckEmailCard
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
              <span className="text-green-600 font-medium text-lg">
                Successfully Verified!
              </span>
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
                <strong>{registeredEmail}</strong>.
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
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2"
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
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2"
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
                        className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2"
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
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2"
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
                className="w-full mt-2 text-base font-semibold shadow-lg shadow-primary/20"
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
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
