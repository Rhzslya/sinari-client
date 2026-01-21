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
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CheckEmailCard } from "./fragments/CheckEmailCard";
import type { ForgotPasswordRequest } from "@/model/user-model";

export function ForgotPasswordForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [identifier, setIdentifier] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const [isDailyLimit, setIsDailyLimit] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

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
      setIsSuccess(true);
      setCooldown(60);
    } catch (error) {
      const errorMessage = handleApiError(error);

      if (
        errorMessage.toLowerCase().includes("wait") &&
        errorMessage.includes("seconds")
      ) {
        const match = errorMessage.match(/(\d+) seconds/);
        if (match && match[1]) setCooldown(parseInt(match[1], 10));

        setGlobalError(errorMessage);
      } else if (errorMessage.toLowerCase().includes("limit")) {
        setGlobalError(errorMessage);
        setIsDailyLimit(true);
      } else {
        setGlobalError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleResend = async () => {
    if (!identifier) return;

    setResendLoading(true);
    setCardError(null);

    try {
      await AuthServices.forgotPassword({ identifier });
      setCooldown(60);
      setIsDailyLimit(false);
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
      } else {
        setCardError(errorMessage);
      }
    } finally {
      setResendLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <CheckEmailCard
        title={cardError ? "Failed to Send" : "Check Your Email"}
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
                Please check your email address for instructions to reset your
                password.
                <br />A reset link has been sent to <strong>{email}</strong>.
              </span>
            </div>
          )
        }
        buttonResend={
          isDailyLimit ? "Daily Limit Reached" : "Resend Reset Link"
        }
        buttonNavigate="Back to Login"
        onActionResend={handleResend}
        onActionNavigate={handleBackToLogin}
        isLoading={resendLoading}
        cooldown={cooldown}
        isDisabled={isDailyLimit}
      />
    );
  }

  return (
    // ... (kode form input bawah tetap sama)
    <div className="w-full max-w-md mx-auto space-y-6">
      <Card className="bg-card border-none shadow-xl shadow-black/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-3xl font-bold text-primary tracking-tight">
            Sinari Cell
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground text-base">
            Forgot your password?
            <br />
            Enter your email or username below.
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

              <Button
                className="w-full mt-2 text-base font-semibold shadow-lg shadow-primary/20"
                type="submit"
                disabled={!form.formState.isValid || isLoading || isDailyLimit}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="size-4" />
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
