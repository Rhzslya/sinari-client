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
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { CheckEmailCard } from "../fragments/CheckEmailCard";
import { useCooldown } from "@/hooks/use-cooldown";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

type ResetPasswordRequest = z.infer<typeof UserValidation.RESET_PASSWORD>;

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { cooldown: blockCooldown, startCooldown: startBlockCooldown } =
    useCooldown("reset_pass_block");

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
      setGlobalError(t("auth.reset.missing_token"));
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    try {
      await AuthServices.resetPassword(data);
      setIsSuccess(true);
    } catch (error) {
      const message = getErrorMessage(error);

      const msg = getErrorMessage(error, t("auth.reset.failed_reset"));

      if (isAxiosError(error) && error.response?.status === 429) {
        const match = message.match(/(\d+) seconds/);
        if (match && match[1]) {
          const seconds = parseInt(match[1], 10);
          startBlockCooldown(seconds);
          setGlobalError(t("auth.common.too_many_attempts"));
          return;
        }
      }
      setGlobalError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (
      blockCooldown === 0 &&
      globalError === t("auth.common.too_many_attempts")
    ) {
      setGlobalError(null);
    }
  }, [blockCooldown, globalError, t]);

  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-destructive/10 border-destructive border text-center shadow-none">
          <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
            <AlertCircle className="size-12 text-destructive" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-destructive">
                {t("auth.reset.invalid_link_title")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("auth.reset.invalid_link_desc")}
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => navigate("/forgot-password")}
            >
              {t("auth.reset.btn_back_forgot")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <CheckEmailCard
        title={t("auth.reset.success_title")}
        variant="default"
        message={
          <>
            {t("auth.reset.success_msg_1")}
            <br />
            {t("auth.reset.success_msg_2")}
          </>
        }
        buttonResend=""
        buttonNavigate={t("auth.reset.btn_go_login")}
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
            {t("auth.reset.title")}
          </CardTitle>
          <CardDescription className="text-center text-muted text-base">
            {t("auth.reset.subtitle")}
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
                          placeholder={t(
                            "auth.reset.placeholders.new_password",
                          )}
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
                          placeholder={t(
                            "auth.reset.placeholders.confirm_password",
                          )}
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
                className="w-full mt-2 text-sm font-semibold shadow-lg shadow-primary/20 text-foreground cursor-pointer"
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  </>
                ) : blockCooldown > 0 ? (
                  t("auth.common.try_again").replace(
                    "{{seconds}}",
                    String(blockCooldown),
                  )
                ) : (
                  t("auth.reset.btn_submit")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
