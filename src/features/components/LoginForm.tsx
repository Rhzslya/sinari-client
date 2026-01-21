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
import { GoogleSignIn } from "./fragments/GoogleSignIn";

export function LoginForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState("");

  const [isResendSuccess, setIsResendSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(UserValidation.LOGIN),
    mode: "onChange",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleBackToLogin = () => {
    setIsResendSuccess(false);
    setShowResend(false);
    setGlobalError(null);
  };

  async function onSubmit(data: LoginRequest) {
    setIsLoading(true);
    setGlobalError(null);
    setShowResend(false);

    try {
      setLastEmail(data.identifier);

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
              const cleanMessage = issues[0].message;

              setGlobalError(cleanMessage);

              return;
            }
          }
        }
      } catch (e) {
        console.error("Gagal parsing error validation:", e);
      }

      setGlobalError(rawMessage);

      if (rawMessage.toLowerCase().includes("not verified")) {
        setShowResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (!lastEmail) return;
    setResendLoading(true);
    try {
      const email = await AuthServices.resendVerification(lastEmail);

      setSuccessEmail(email);

      setIsResendSuccess(true);

      setCooldown(60);
    } catch (error) {
      const errorMessage = handleApiError(error);

      setGlobalError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    console.log("Login with Google...");
  };

  if (isResendSuccess) {
    return (
      <CheckEmailCard
        title="Email Sent!"
        message={
          <>
            A new verification link has been sent to{" "}
            <strong>{successEmail}</strong>.
            <br />
            Please check your Inbox or Spam folder.
          </>
        }
        buttonText="Back to Login"
        onAction={handleBackToLogin}
      />
    );
  }
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="bg-card border-none shadow-xl shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl font-bold text-primary tracking-tight">
            Sinari Cell
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base">
            Welcome back! Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative mt-6">
          {/* Global Error Alert */}
          {globalError && (
            <div className="absolute -top-10 flex justify-center  left-0 w-full px-6 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="bg-destructive/20 w-full px-4 py-1 rounded-xs text-destructive flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 font-medium text-sm">
                  <AlertCircle className="size-4" />
                  <span>{globalError}</span>
                </div>

                {showResend && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors h-8 text-xs"
                    onClick={handleResend}
                    disabled={resendLoading || cooldown > 0}
                  >
                    {resendLoading ? (
                      <Loader2 className="animate-spin size-3 mr-2" />
                    ) : null}
                    {cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend Verification Email"}
                  </Button>
                )}
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
                        className="bg-muted/30 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-none"
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
                      <div>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-muted/30 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary pr-10 shadow-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2 text-muted-foreground hover:text-primary transition-colors outline-none"
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
                    <FormMessage className="absolute top-9 left-0 text-xs" />
                    <div className="text-right mt-1">
                      <a
                        href="#"
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
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
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <GoogleSignIn onClick={handleGoogleLogin} isLoading={isLoading} />
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
