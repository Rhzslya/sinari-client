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
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

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
      const errorMessage = handleApiError(error);

      setGlobalError(errorMessage);

      if (errorMessage.toLowerCase().includes("not verified")) {
        setShowResend(true);
      }
      setGlobalError(errorMessage);
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
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Sinari Cell</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {globalError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4" />
              <span>{globalError}</span>
            </div>

            {showResend && (
              <Button
                variant="outline"
                size="sm"
                className="w-full border-destructive text-destructive hover:bg-destructive/10 mt-1"
                onClick={handleResend}
                disabled={resendLoading || cooldown > 0}
              >
                {resendLoading ? (
                  <Loader2 className="animate-spin size-3 mr-2" />
                ) : null}

                {cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : "Resend Verification Email"}
              </Button>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <Input
                      placeholder="Username or Email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
