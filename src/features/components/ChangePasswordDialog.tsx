import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Key,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { UserValidation } from "@/validation/user-validation";
import { useUserQueries } from "@/hooks/user-queries";
import { useCooldown } from "@/hooks/use-cooldown";
import { isAxiosError } from "axios";
import { getErrorMessage } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type ChangePasswordRequest = z.infer<typeof UserValidation.CHANGE_PASSWORD>;

export function ChangePasswordDialog() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const [generalError, setGeneralError] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { changePasswordMutation } = useUserQueries();
  const {
    mutateAsync: changePassword,
    isPending: isLoading,
    isError,
    error,
    reset,
  } = changePasswordMutation;

  const { cooldown, startCooldown } = useCooldown(
    "change_pwd_block",
    "ratelimit_",
  );

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(UserValidation.CHANGE_PASSWORD),
    mode: "all",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
      setGeneralError(null);
      form.reset();
    }
  };

  const onSubmit = async (data: ChangePasswordRequest) => {
    setGeneralError(null);
    try {
      await changePassword(data);
      form.reset();
      setIsOpen(false);
    } catch (err) {
      if (!(isAxiosError(err) && err.response?.status === 429)) {
        setGeneralError(getErrorMessage(err));
      }
    }
  };

  useEffect(() => {
    if (isRateLimited) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)/);
      const seconds = match ? parseInt(match[1]) : 60;

      if (cooldown === 0) {
        startCooldown(seconds);
        reset();
      }
    }
  }, [isRateLimited, error, cooldown, startCooldown, reset]);

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold border-2 shrink-0">
          <Key className="w-4 h-4 mr-2" />{" "}
          {t("profile.change_password.trigger_btn")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{t("profile.change_password.title")}</DialogTitle>
          <DialogDescription className="sr-only">
            {t("profile.change_password.desc")}
          </DialogDescription>
        </DialogHeader>

        {/* AREA PESAN GENERAL ERROR */}
        <div className="min-h-13 w-full flex items-center -mb-2 mt-1">
          {generalError && cooldown === 0 ? (
            <div className="bg-destructive/10 w-full px-4 py-2.5 rounded-md text-destructive flex items-start gap-2 border border-destructive/20 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span className="text-sm font-medium leading-tight">
                {generalError}
              </span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground animate-in fade-in duration-300">
              {t("profile.change_password.desc")}
            </p>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 pt-2"
          >
            {(cooldown > 0 || isRateLimited) && (
              <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                <div className="space-y-1 flex flex-col justify-center items-center">
                  <AlertTriangle className="h-7 w-7 shrink-0" />
                  <p className="font-semibold text-xs uppercase">
                    {t("profile.change_password.rate_limit_title")}
                  </p>
                  <p
                    className="text-xs opacity-90"
                    dangerouslySetInnerHTML={{
                      __html: t(
                        "profile.change_password.rate_limit_desc",
                      ).replace(
                        "{{seconds}}",
                        String(cooldown).padStart(2, "0"),
                      ),
                    }}
                  />
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0 pb-5">
                  <FormLabel className={labelStyle}>
                    {t("profile.change_password.labels.old_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showOld ? "text" : "password"}
                        placeholder={t(
                          "profile.change_password.placeholders.old_password",
                        )}
                        disabled={isLoading || isSubmitting || cooldown > 0}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground outline-none"
                      >
                        {showOld ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0 pb-5">
                  <FormLabel className={labelStyle}>
                    {t("profile.change_password.labels.new_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showNew ? "text" : "password"}
                        placeholder={t(
                          "profile.change_password.placeholders.new_password",
                        )}
                        disabled={isLoading || isSubmitting || cooldown > 0}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground outline-none"
                      >
                        {showNew ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0 pb-5">
                  <FormLabel className={labelStyle}>
                    {t("profile.change_password.labels.confirm_password")}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showConfirm ? "text" : "password"}
                        placeholder={t(
                          "profile.change_password.placeholders.confirm_password",
                        )}
                        disabled={isLoading || isSubmitting || cooldown > 0}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground outline-none"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/4 text-sm font-semibold shadow-sm cursor-pointer duration-300"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading || isSubmitting}
              >
                {t("profile.change_password.btn_cancel")}
              </Button>
              <Button
                variant="default"
                className="w-1/3 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground duration-300"
                type="submit"
                disabled={isLoading || isSubmitting || !isValid || cooldown > 0}
              >
                {isLoading || isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  t("profile.change_password.btn_save")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
