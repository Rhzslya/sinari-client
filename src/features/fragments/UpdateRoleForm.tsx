import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { UserRole } from "@/enum/product-enum";
import { useCooldown } from "@/hooks/use-cooldown";
import { useUserQueries } from "@/hooks/user-queries";
import type {
  DetailedUserResponse,
  NotPublicUserResponse,
  UpdateRoleRequest,
} from "@/model/user-model";
import { UserValidation } from "@/validation/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface UpdateRoleFormProps {
  user: NotPublicUserResponse | DetailedUserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UpdateRoleForm({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UpdateRoleFormProps) {
  const { t } = useTranslation();
  const { updateRoleMutation } = useUserQueries();
  const {
    mutateAsync: updateRole,
    isPending,
    isError,
    error,
    reset,
  } = updateRoleMutation;

  const { cooldown, startCooldown } = useCooldown("update_role", "ratelimit_");

  const isRateLimited =
    isError && isAxiosError(error) && error.response?.status === 429;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<Pick<
    UpdateRoleRequest,
    "role"
  > | null>(null);

  const form = useForm<Pick<UpdateRoleRequest, "role">>({
    resolver: zodResolver(UserValidation.UPDATE_ROLE.pick({ role: true })),
    defaultValues: {
      role: user?.role,
    },
  });

  const selectedRole = useWatch({
    control: form.control,
    name: "role",
  });
  const { isSubmitting, isDirty } = form.formState;

  useEffect(() => {
    if (open && user) {
      form.reset({
        role: user.role,
      });
    }
  }, [user, open, form]);

  const onPreSubmit = (data: Pick<UpdateRoleRequest, "role">) => {
    if (!user) return;

    const isPromotingToOwner = data.role === UserRole.OWNER;
    const isDemotingOwner =
      user.role === UserRole.OWNER && data.role !== UserRole.OWNER;

    if (isPromotingToOwner || isDemotingOwner) {
      setPendingData(data);
      setShowConfirmDialog(true);
    } else {
      executeUpdate(data);
    }
  };

  const executeUpdate = async (data: Pick<UpdateRoleRequest, "role">) => {
    if (!user) return;

    try {
      await updateRole({
        id: user.id,
        role: data.role,
      });
      setShowConfirmDialog(false);
      onOpenChange(false);
      onSuccess();
    } catch {
      // Error handled by hook
      setShowConfirmDialog(false);
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

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const ROLE_OPTIONS = Object.values(UserRole);

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-2 text-xs sm:text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-9 sm:h-10";
  const labelStyle =
    "text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[95vw] sm:max-w-md p-4 sm:p-6 rounded-xl">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl">
              {t("users_management.forms.update_role.title")}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <div className="flex flex-wrap items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                  <span>{t("users_management.forms.update_role.desc_1")}</span>
                  <TruncatedTooltip
                    text={user?.username || ""}
                    className="font-bold text-foreground max-w-30 sm:max-w-50 truncate"
                  />
                  <span>.</span>
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground/80 leading-relaxed">
                  {t("users_management.forms.update_role.desc_2")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onPreSubmit)}
              className="space-y-5 sm:space-y-6 pt-2 sm:pt-4"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className={labelStyle}>
                      {t("users_management.forms.update_role.current_role")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || isPending}
                    >
                      <FormControl>
                        <SelectTrigger className={inputStyle}>
                          <SelectValue
                            placeholder={t(
                              "users_management.forms.update_role.select_role",
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ROLE_OPTIONS.map((role) => (
                          <SelectItem
                            key={role}
                            value={role}
                            className="text-xs sm:text-sm"
                          >
                            <span className="capitalize">{role}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <AnimatePresence initial={false}>
                      {field.value === UserRole.OWNER &&
                        user?.role !== UserRole.OWNER && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3">
                              <div className="flex items-start gap-2.5 rounded-lg bg-amber-500/10 p-3 sm:p-4 text-amber-600 dark:text-amber-500 border border-amber-500/20">
                                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                                    {t(
                                      "users_management.forms.update_role.warn_high_privilege",
                                    )}
                                  </p>
                                  <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed">
                                    {t(
                                      "users_management.forms.update_role.warn_high_privilege_desc",
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      {user?.role === UserRole.OWNER &&
                        field.value !== UserRole.OWNER && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-3">
                              <div className="flex items-start gap-2.5 rounded-lg bg-red-500/10 p-3 sm:p-4 text-red-600 dark:text-red-500 border border-red-500/20">
                                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                  <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                                    {t(
                                      "users_management.forms.update_role.warn_demote",
                                    )}
                                  </p>
                                  <p className="text-[10px] sm:text-xs opacity-90 leading-relaxed">
                                    {t(
                                      "users_management.forms.update_role.warn_demote_desc",
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                      {(cooldown > 0 || isRateLimited) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            <div className="flex flex-col items-center justify-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20 text-center">
                              <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 opacity-80" />
                              <div className="space-y-1">
                                <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                                  {t(
                                    "users_management.forms.common.action_paused",
                                  )}
                                </p>
                                <p
                                  className="text-[10px] sm:text-xs opacity-90 leading-relaxed"
                                  dangerouslySetInnerHTML={{
                                    __html: t(
                                      "users_management.forms.common.too_many_attempts",
                                    ).replace(
                                      "{{seconds}}",
                                      String(cooldown).padStart(2, "0"),
                                    ),
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <FormMessage className="text-[10px] sm:text-xs" />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-3 mt-6 sm:mt-8 flex-col sm:flex-row">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  className="w-full sm:w-1/4 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer duration-300 order-1 sm:order-0"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isPending}
                >
                  {t("users_management.forms.update_role.btn_cancel")}
                </Button>
                <Button
                  size="sm"
                  className="w-full sm:w-1/2 sm:px-8 h-9 sm:h-10 text-xs sm:text-sm text-foreground cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                  type="submit"
                  disabled={
                    isSubmitting || !isDirty || isPending || cooldown > 0
                  }
                  variant={
                    selectedRole === UserRole.OWNER ||
                    user?.role === UserRole.OWNER
                      ? "destructive"
                      : "default"
                  }
                >
                  {isSubmitting || isPending || isError ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    t("users_management.forms.update_role.btn_save")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="w-[90vw] sm:max-w-106.25 rounded-xl p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              {t("users_management.forms.update_role.confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
              {pendingData?.role === UserRole.OWNER ? (
                <span>
                  {t("users_management.forms.update_role.confirm_promote_1")}{" "}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  {t("users_management.forms.update_role.confirm_promote_2")}{" "}
                  <strong className="text-foreground">OWNER</strong>
                  {t("users_management.forms.update_role.confirm_promote_3")}
                </span>
              ) : (
                <span>
                  {t("users_management.forms.update_role.confirm_demote_1")}{" "}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  {t("users_management.forms.update_role.confirm_demote_2")}{" "}
                  <strong className="text-foreground">OWNER</strong>
                  {t("users_management.forms.update_role.confirm_demote_3")}
                </span>
              )}
              <br />
              <br />
              <span className="font-medium">
                {t("users_management.forms.update_role.confirm_proceed")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:mt-6 flex-col sm:flex-row gap-2 sm:gap-3">
            <AlertDialogCancel
              className="w-full sm:w-1/4 h-9 sm:h-10 text-xs sm:text-sm cursor-pointer duration-300 mt-0"
              disabled={isPending}
            >
              {t("users_management.forms.update_role.btn_cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-1/2 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm bg-destructive hover:bg-destructive/90 text-white cursor-pointer duration-300"
              disabled={isSubmitting || !isDirty || isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingData) executeUpdate(pendingData);
              }}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 sm:h-4 sm:w-4 animate-spin mr-2" />
              ) : (
                t("users_management.forms.update_role.btn_confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
