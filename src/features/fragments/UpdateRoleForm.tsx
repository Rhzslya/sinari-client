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
import { useUserQueries } from "@/hooks/user-queries";
import type {
  NotPublicUserResponse,
  UpdateRoleRequest,
} from "@/model/user-model";
import { UserValidation } from "@/validation/user-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

interface UpdateRoleFormProps {
  user: NotPublicUserResponse | null;
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
  const { updateRoleMutation } = useUserQueries();
  const { mutateAsync: updateRole, isPending } = updateRoleMutation;

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
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-1 text-muted-foreground text-sm">
                  <span>Change access level for</span>
                  <TruncatedTooltip
                    text={user?.username || ""}
                    className="font-semibold text-foreground max-w-37.5 truncate"
                  />

                  <span>.</span>
                </div>

                <span className="text-xs text-muted-foreground">
                  (Admin has full access, Customer has limited access)
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
                    <FormLabel className={labelStyle}>Current Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || isPending}
                    >
                      <FormControl>
                        <SelectTrigger className={inputStyle}>
                          <SelectValue placeholder="Select role" />
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
                              Warning: High Privilege
                            </p>
                            <p className="text-xs opacity-90">
                              You are granting full ownership access. This user
                              will have equal rights to you.
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
                              Warning: Demoting Owner
                            </p>
                            <p className="text-xs opacity-90">
                              You are removing ownership access. Ensure there is
                              at least one other Owner remaining.
                            </p>
                          </div>
                        </div>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  className="cursor-pointer duration-300"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || isPending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="w-1/3 text-foreground text-sm cursor-pointer bg-success hover:bg-success/80 focus:ring-success duration-300"
                  type="submit"
                  disabled={isSubmitting || !isDirty || isPending}
                  variant={
                    selectedRole === UserRole.OWNER ||
                    user?.role === UserRole.OWNER
                      ? "destructive"
                      : "default"
                  }
                >
                  {isSubmitting || isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
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
              Confirm Critical Action
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {pendingData?.role === UserRole.OWNER ? (
                <span>
                  You are about to promote{" "}
                  {/* Gunakan break-all agar string panjang tanpa spasi tetap turun ke bawah */}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  to <strong className="text-white">OWNER</strong>. They will
                  have full control over the system, including the ability to
                  manage other users.
                </span>
              ) : (
                <span>
                  You are about to demote{" "}
                  <span className="font-bold text-foreground break-all">
                    {user?.username}
                  </span>{" "}
                  from <strong className="text-white">OWNER</strong>. They will
                  lose administrative privileges.
                </span>
              )}
              <br />
              <br />
              Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer duration-300"
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-1/3 bg-destructive hover:bg-destructive/90 text-foreground! cursor-pointer duration-300"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingData) executeUpdate(pendingData);
              }}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                "Confirm Update"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
