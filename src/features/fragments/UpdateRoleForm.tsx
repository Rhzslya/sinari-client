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
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>
              {t("users_management.forms.update_role.title")}
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-1 text-muted-foreground text-sm">
                  <span>{t("users_management.forms.update_role.desc_1")}</span>
                  <TruncatedTooltip
                    text={user?.username || ""}
                    className="font-semibold text-foreground max-w-37.5 truncate"
                  />
                  <span>.</span>
                </div>

                <span className="text-xs text-muted-foreground">
                  {t("users_management.forms.update_role.desc_2")}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onPreSubmit)}
              className="space-y-6 py-2"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
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
                          <SelectItem key={role} value={role}>
                            <span className="capitalize">{role}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value === UserRole.OWNER &&
                      user?.role !== UserRole.OWNER && (
                        <div className="flex items-start gap-2 mt-2 rounded-md bg-amber-500/15 p-3 text-sm text-amber-600 dark:text-amber-500 border border-amber-500/20">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <div className="space-y-1">
                            <p className="font-semibold text-xs uppercase">
                              {t(
                                "users_management.forms.update_role.warn_high_privilege",
                              )}
                            </p>
                            <p className="text-xs opacity-90">
                              {t(
                                "users_management.forms.update_role.warn_high_privilege_desc",
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                    {user?.role === UserRole.OWNER &&
                      field.value !== UserRole.OWNER && (
                        <div className="flex items-start gap-2 mt-2 rounded-md bg-red-500/15 p-3 text-sm text-red-600 dark:text-red-500 border border-red-500/20">
                          <AlertTriangle className="h-5 w-5 shrink-0" />
                          <div className="space-y-1">
                            <p className="font-semibold text-xs uppercase">
                              {t(
                                "users_management.forms.update_role.warn_demote",
                              )}
                            </p>
                            <p className="text-xs opacity-90">
                              {t(
                                "users_management.forms.update_role.warn_demote_desc",
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(cooldown > 0 || isRateLimited) && (
                <div className="flex justify-center gap-2 mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/20 animate-in fade-in zoom-in duration-300">
                  <div className="space-y-1 flex flex-col justify-center items-center">
                    <AlertTriangle className="h-7 w-7 shrink-0" />
                    <p className="font-semibold text-xs uppercase">
                      {t("users_management.forms.common.action_paused")}
                    </p>
                    <p
                      className="text-xs opacity-90"
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
              )}
              <DialogFooter>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  className="cursor-pointer duration-300"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isPending}
                >
                  {t("users_management.forms.update_role.btn_cancel")}
                </Button>
                <Button
                  size="sm"
                  className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t("users_management.forms.update_role.confirm_title")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {pendingData?.role === UserRole.OWNER ? (
                <span>
                  {t("users_management.forms.update_role.confirm_promote_1")}{" "}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  {t("users_management.forms.update_role.confirm_promote_2")}{" "}
                  <strong className="text-white">OWNER</strong>
                  {t("users_management.forms.update_role.confirm_promote_3")}
                </span>
              ) : (
                <span>
                  {t("users_management.forms.update_role.confirm_demote_1")}{" "}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  {t("users_management.forms.update_role.confirm_demote_2")}{" "}
                  <strong className="text-white">OWNER</strong>
                  {t("users_management.forms.update_role.confirm_demote_3")}
                </span>
              )}
              <br />
              <br />
              {t("users_management.forms.update_role.confirm_proceed")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer duration-300"
              disabled={isPending}
            >
              {t("users_management.forms.update_role.btn_cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-1/3 bg-destructive hover:bg-destructive/90 text-foreground! cursor-pointer duration-300"
              disabled={isSubmitting || !isDirty || isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingData) executeUpdate(pendingData);
              }}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
