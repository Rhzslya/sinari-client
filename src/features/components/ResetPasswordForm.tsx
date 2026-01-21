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

// Gunakan Tipe Data Asli dari Schema (Ada tokennya)
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
    // 2. MASUKKAN TOKEN KE DEFAULT VALUES
    mode: "onChange",
    defaultValues: {
      token: token ?? "", // Jika null, isi string kosong (nanti kena validasi error di bawah)
      new_password: "",
      confirm_new_password: "",
    },
  });

  async function onSubmit(data: ResetPasswordRequest) {
    // Safety check: Kalau token ga ada di URL, jangan lanjut
    if (!data.token) {
      setGlobalError("Invalid link. Token is missing.");
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      // 3. KIRIM DATA KE SERVICE (Data sudah berisi token + password baru)
      await AuthServices.resetPassword(data);
      setIsSuccess(true);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  // --- JIKA TOKEN TIDAK ADA DI URL (Langsung Block) ---
  if (!token) {
    return (
      <Card className="bg-destructive/10 border-destructive border text-center shadow-none">
        <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
          <AlertCircle className="size-12 text-destructive" />
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-destructive">Invalid Link</h3>
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
    );
  }

  // --- TAMPILAN SUKSES ---
  if (isSuccess) {
    return (
      <CheckEmailCard
        title="Password Reset!"
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
            Create New Password
          </CardDescription>
        </CardHeader>
        <CardContent className="relative mt-2">
          {globalError && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-1">
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="size-4 shrink-0" />
                <span>{globalError}</span>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Kita tidak perlu menampilkan Field Token, tapi dia ada di 'background' state form */}

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="New Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-muted/30 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors outline-none"
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New Password"
                          {...field}
                          disabled={isLoading}
                          className="bg-muted/30 border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors outline-none"
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-11 mt-2 text-base font-semibold shadow-lg shadow-primary/20"
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>

          {/* ... Footer link ... */}
        </CardContent>
      </Card>
    </div>
  );
}
