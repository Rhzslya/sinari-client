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
import { motion, AnimatePresence } from "framer-motion";

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
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-10 sm:h-9"; // 👈 Diperbesar untuk mobile
  const labelStyle =
    "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="font-bold border-2 shrink-0 w-full sm:w-1/2 cursor-pointer"
        >
          <Key className="w-4 h-4 mr-2" />{" "}
          {t("profile.change_password.trigger_btn")}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] sm:max-w-106.25 rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {t("profile.change_password.title")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("profile.change_password.desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-12 w-full flex items-center -mb-2 mt-1">
          <AnimatePresence mode="wait">
            {generalError && cooldown === 0 ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-destructive/10 w-full px-4 py-2.5 rounded-md text-destructive flex items-start gap-2 border border-destructive/20 shadow-sm"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium leading-tight">
                  {generalError}
                </span>
              </motion.div>
            ) : (
              <motion.p
                key="desc"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs sm:text-sm text-muted-foreground"
              >
                {t("profile.change_password.desc")}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <AnimatePresence>
              {(cooldown > 0 || isRateLimited) && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex justify-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 shadow-sm">
                    <div className="space-y-1 flex flex-col justify-center items-center">
                      <AlertTriangle className="h-6 w-6 shrink-0 mb-1" />
                      <p className="font-semibold text-[10px] sm:text-xs uppercase text-center">
                        {t("profile.change_password.rate_limit_title")}
                      </p>
                      <p
                        className="text-[10px] sm:text-xs opacity-90 text-center"
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
                </motion.div>
              )}
            </AnimatePresence>

            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-1 sm:gap-2 space-y-0 pb-4 sm:pb-5">
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
                        className="absolute right-3 top-2.5 sm:top-2 text-muted-foreground hover:text-foreground outline-none cursor-pointer"
                      >
                        {showOld ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-1 sm:gap-2 space-y-0 pb-4 sm:pb-5">
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
                        className="absolute right-3 top-2.5 sm:top-2 text-muted-foreground hover:text-foreground outline-none cursor-pointer"
                      >
                        {showNew ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-1 sm:gap-2 space-y-0 pb-4 sm:pb-5">
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
                        className="absolute right-3 top-2.5 sm:top-2 text-muted-foreground hover:text-foreground outline-none cursor-pointer"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                          <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute bottom-0 left-0 text-[10px] sm:text-xs" />
                </FormItem>
              )}
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                className="w-full sm:w-1/4 text-sm font-semibold cursor-pointer"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading || isSubmitting}
              >
                {t("profile.change_password.btn_cancel")}
              </Button>
              <Button
                variant="default"
                className="w-full sm:w-1/2 text-sm font-semibold shadow-lg shadow-primary/20 cursor-pointer text-foreground px-6"
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
