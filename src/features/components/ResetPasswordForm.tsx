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
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CheckEmailCard } from "./fragments/CheckEmailCard";

type ResetPasswordRequest = z.infer<typeof UserValidation.RESET_PASSWORD>;

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ResetPasswordRequest>({
    resolver: zodResolver(UserValidation.RESET_PASSWORD),
    mode: "onChange",
    defaultValues: {
      token: token ?? "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(data: ResetPasswordRequest) {
    if (!data.token) {
      setGlobalError("Invalid link. Token is missing.");
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      await AuthServices.resetPassword(data);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-destructive/10 border-destructive border text-center shadow-none">
          <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
            <AlertCircle className="size-12 text-destructive" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-destructive">
                Invalid Link
              </h3>
              <p className="text-muted-foreground text-sm">
                The password reset link is invalid or missing. Please request a
                new one.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => navigate("/forgot-password")}
            >
              Back to Forgot Password
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <CheckEmailCard
        title="Password Reset!"
        variant="default"
        message={
          <>
            Your password has been successfully updated.
            <br />
            You can now login with your new password.
          </>
        }
        buttonResend="Resend Password Reset Email"
        buttonNavigate="Go to Login"
        onActionNavigate={() => navigate("/login")}
        isDisabled={true}
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
          <CardDescription className="text-center text-muted text-base">
            Create New Password
          </CardDescription>
        </CardHeader>

        <CardContent className="relative mt-6">
          {globalError && (
            <div className="absolute -top-12 flex justify-center left-0 w-full px-6 z-50 animate-in fade-in slide-in-from-top-2">
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
                name="new_password"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="off"
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-foreground border-muted-foreground text-muted placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2 pr-10"
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

              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <div className="relative">
                        <Input
                          autoComplete="off"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-foreground border-muted-foreground text-muted placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-0 focus-visible:ring-2 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-2.5 text-muted-foreground hover:text-primary transition-colors outline-none"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
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
                className="w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 text-foreground"
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
