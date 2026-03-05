import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRoleBadgeColor } from "@/components/utils/roleBadge";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import DeleteUserForm from "@/features/fragments/DeleteUserForm";
import UpdateRoleForm from "@/features/fragments/UpdateRoleForm";
import { useCooldown } from "@/hooks/use-cooldown";
import { useUserQueries } from "@/hooks/user-queries";
import type { DetailedUserResponse } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import { isAxiosError } from "axios";
import { format } from "date-fns";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Loader2,
  Mail,
  Pen,
  RefreshCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const DetailUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useDetail, useProfile } = useUserQueries();

  const { data: currentUser } = useProfile();

  const id = Number(userId);
  const { data: user, isLoading, isError, refetch } = useDetail({ id });

  const isTargetOwner = user?.role === "OWNER";
  const isTargetAdmin = user?.role === "ADMIN";

  const isCurrentUserOwner = currentUser?.role === "OWNER";
  const isCurrentUserAdmin = currentUser?.role === "ADMIN";
  const isCurrentUser = currentUser?.id === user?.id;

  const isAdminDeletingAdmin = isCurrentUserAdmin && isTargetAdmin;

  const isDeleteDisabled =
    isCurrentUser || isTargetOwner || isAdminDeletingAdmin;

  const isChangeRoleDisabled =
    isCurrentUser || isTargetOwner || !isCurrentUserOwner;

  const [selectedUser, setSelectedUser] = useState<DetailedUserResponse | null>(
    null,
  );

  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

  const { cooldown: verifyCooldown, startCooldown: startVerifyCooldown } =
    useCooldown(`admin_resend_verify_${user?.email}`);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const { cooldown: resetCooldown, startCooldown: startResetCooldown } =
    useCooldown(`admin_resend_reset_${user?.email}`);
  const [resetLoading, setResetLoading] = useState(false);

  // --- Helper Functions ---
  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "??";

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMM yyyy, HH:mm");
  };

  const isRateLimited = (count: number) => count >= 5;

  const handleDeleteUserOpen = (user: DetailedUserResponse) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleUpdateRoleOpen = (user: DetailedUserResponse) => {
    setSelectedUser(user);
    setIsUpdateRoleOpen(true);
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;

    if (verifyCooldown > 0) {
      toast.error(t("users_management.detail.toast.wait_before_resend"));
      return;
    }

    setVerifyLoading(true);

    try {
      await AuthServices.resendVerification({ identifier: user.email });
      toast.success(
        t("users_management.detail.toast.verify_sent", { email: user.email }),
      );
      startVerifyCooldown(60);

      refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const rawMessage = error.response?.data?.errors || error.message;
        const mainMessage = rawMessage.split("|")[0];

        if (status === 400 && mainMessage.toLowerCase().includes("wait")) {
          const match = mainMessage.match(/(\d+) seconds/);
          if (match && match[1]) {
            startVerifyCooldown(parseInt(match[1], 10));
            toast.error(
              t("users_management.detail.toast.cooldown_msg", {
                seconds: match[1],
              }),
            );
          }
        } else if (
          status === 400 &&
          mainMessage.toLowerCase().includes("verified")
        ) {
          toast.info(t("users_management.detail.toast.already_verified"));
        } else if (status === 429) {
          const match = mainMessage.match(/(\d+)s|(\d+) seconds/);
          const seconds = match ? parseInt(match[1] || match[2], 10) : 60;
          startVerifyCooldown(seconds);
          toast.error(
            t("users_management.detail.toast.rate_limit", { seconds: seconds }),
          );
        } else {
          toast.error(mainMessage);
        }
      }
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendResetPassword = async () => {
    if (!user?.email) return;

    if (resetCooldown > 0) {
      toast.error(t("users_management.detail.toast.wait_before_resend"));
      return;
    }

    setResetLoading(true);

    try {
      await AuthServices.forgotPassword({ identifier: user.email });
      toast.success(
        t("users_management.detail.toast.reset_sent", { email: user.email }),
      );
      startResetCooldown(60);
      refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        const rawMessage = error.response?.data?.errors || error.message;

        const mainMessage = rawMessage.split("|")[0];

        if (status === 400 && mainMessage.toLowerCase().includes("wait")) {
          const match = mainMessage.match(/(\d+) seconds/);
          if (match && match[1]) {
            const seconds = parseInt(match[1], 10);
            startResetCooldown(seconds);
            toast.error(
              t("users_management.detail.toast.cooldown_msg", {
                seconds: seconds,
              }),
            );
          }
        } else if (status === 429) {
          const match = mainMessage.match(/(\d+)s|(\d+) seconds/);
          const seconds = match ? parseInt(match[1] || match[2], 10) : 60;
          startResetCooldown(seconds);

          if (mainMessage.toLowerCase().includes("daily")) {
            toast.error(t("users_management.detail.toast.daily_limit"));
          } else {
            toast.error(
              t("users_management.detail.toast.rate_limit", {
                seconds: seconds,
              }),
            );
          }
        } else {
          toast.error(mainMessage);
        }
      } else {
        toast.error(t("users_management.detail.toast.unexpected_error"));
      }
    } finally {
      setResetLoading(false);
    }
  };

  const haveGoogleAuth = user?.google_id !== null;

  if (isError || !user)
    return <div className="p-4">{t("users_management.detail.not_found")}</div>;

  if (isLoading)
    return <div className="p-4">{t("users_management.detail.loading")}</div>;

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/users")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t("users_management.detail.header_title")}
            </h1>
            <span className="text-sm text-muted-foreground truncate max-w-[320px]">
              {t("users_management.detail.header_subtitle")}
            </span>
            <span className="inline-flex align-middle max-w-37.5">
              <TruncatedTooltip
                text={user.username || ""}
                className="font-semibold text-sm text-foreground max-w-37.5 truncate"
              />
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 auto-rows-fr">
          <Card className="xl:col-span-2 h-full flex flex-col">
            <CardHeader className="bg-muted/10 pb-8">
              <div className="flex items-center gap-4">
                <Avatar className="w-17 h-17 border-2 border-background shadow-sm">
                  <AvatarFallback className="text-2xl font-bold text-foreground bg-primary border-3 border-muted">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <TruncatedTooltip
                      text={user.username}
                      className="max-w-100"
                    />
                    {user.is_online ? (
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50 border-green-200"
                      >
                        {t("users_management.table.status.online")}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {t("users_management.table.status.offline")}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="-mt-4 flex-1">
              <div className="bg-card border rounded-lg p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("users_management.detail.profile.email")}
                  </label>
                  <div className="font-medium flex items-center gap-2">
                    <TruncatedTooltip text={user.email} className="max-w-100" />
                    {user.is_verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-center">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("users_management.detail.profile.user_id")}
                  </label>
                  <div className="font-medium font-mono text-sm bg-muted/50 w-fit mx-auto px-2 py-0.5 rounded border">
                    #{user.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("users_management.detail.profile.auth_method")}
                  </label>
                  <div className="font-medium flex items-center gap-2">
                    {user.google_id ? (
                      <FcGoogle className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    )}
                    {user.google_id
                      ? t("users_management.detail.profile.google_oauth")
                      : t("users_management.detail.profile.standard_email")}
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    {t("users_management.detail.profile.role")}
                  </label>
                  <div className="font-medium">
                    <Badge
                      variant="outline"
                      className={`capitalize min-w-20 justify-center border ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role.toLowerCase()}
                    </Badge>{" "}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/40 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base">
                {t("users_management.detail.quick_actions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-1">
              <Button
                className="w-full justify-start duration-300 cursor-pointer"
                variant="outline"
                disabled={
                  isCurrentUser ||
                  verifyLoading ||
                  verifyCooldown > 0 ||
                  user.is_verified ||
                  isRateLimited(user.resend_count)
                }
                onClick={handleResendVerification}
              >
                {verifyLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}

                {verifyCooldown > 0
                  ? t("users_management.detail.quick_actions.resend_in", {
                      seconds: verifyCooldown,
                    })
                  : user.is_verified
                    ? t(
                        "users_management.detail.quick_actions.already_verified",
                      )
                    : t("users_management.detail.quick_actions.resend_verify")}
              </Button>
              <Button
                className="w-full justify-start duration-300 cursor-pointer"
                variant="outline"
                disabled={
                  isCurrentUser ||
                  resetLoading ||
                  resetCooldown > 0 ||
                  haveGoogleAuth ||
                  isRateLimited(user.pass_reset_count)
                }
                onClick={handleResendResetPassword}
              >
                {resetLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="mr-2 h-4 w-4" />
                )}

                {isRateLimited(user.pass_reset_count)
                  ? t("users_management.detail.quick_actions.daily_limit")
                  : resetCooldown > 0
                    ? t("users_management.detail.quick_actions.resend_in", {
                        seconds: resetCooldown,
                      })
                    : t("users_management.detail.quick_actions.resend_reset")}
              </Button>
              <Button
                onClick={() => handleUpdateRoleOpen(user)}
                className="w-full justify-start duration-300 cursor-pointer"
                variant="outline"
                disabled={isChangeRoleDisabled}
              >
                <Pen className="mr-2 h-4 w-4" />{" "}
                {t("users_management.detail.quick_actions.change_role")}
              </Button>
              <Button
                onClick={() => handleDeleteUserOpen(user)}
                className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer"
                variant="outline"
                disabled={isDeleteDisabled}
              >
                <Trash2 className="mr-2 h-4 w-4" />{" "}
                {t("users_management.detail.quick_actions.delete_user")}
              </Button>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex gap-2 items-center">
                <Activity className="w-5 h-5 text-orange-600" />{" "}
                {t("users_management.detail.activity_limits.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t(
                        "users_management.detail.activity_limits.verify_attempts",
                      )}
                    </span>
                    <span
                      className={
                        isRateLimited(user.resend_count)
                          ? "text-destructive font-bold"
                          : ""
                      }
                    >
                      {user.resend_count} / 5
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isRateLimited(user.resend_count)
                          ? "bg-destructive"
                          : "bg-primary"
                      }`}
                      style={{ width: `${(user.resend_count / 5) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {t("users_management.detail.activity_limits.last_attempt")}{" "}
                    {formatDate(user.last_resend_time)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t(
                        "users_management.detail.activity_limits.reset_attempts",
                      )}
                    </span>
                    <span
                      className={
                        isRateLimited(user.pass_reset_count)
                          ? "text-destructive font-bold"
                          : ""
                      }
                    >
                      {user.pass_reset_count} / 5
                    </span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        isRateLimited(user.pass_reset_count)
                          ? "bg-destructive"
                          : "bg-primary"
                      }`}
                      style={{
                        width: `${(user.pass_reset_count / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {t("users_management.detail.activity_limits.last_attempt")}{" "}
                    {formatDate(user.pass_reset_last_time)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base flex gap-2 items-center">
                <CalendarClock className="w-5 h-5 text-blue-600" />{" "}
                {t("users_management.detail.system_time.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground font-semibold">
                  {t("users_management.detail.system_time.created_at")}
                </label>
                <p className="font-medium text-sm border-b pb-2">
                  {formatDate(user.created_at)}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground font-semibold">
                  {t("users_management.detail.system_time.last_updated")}
                </label>
                <p className="font-medium text-sm border-b pb-2">
                  {formatDate(user.updated_at)}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div
                  className={`w-2 h-2 rounded-full ${user.updated_at === user.created_at ? "bg-slate-300" : "bg-emerald-500"}`}
                ></div>
                <span className="text-xs text-muted-foreground">
                  {user.updated_at === user.created_at
                    ? t("users_management.detail.system_time.no_modifications")
                    : t("users_management.detail.system_time.data_modified")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <UpdateRoleForm
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRoleOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsDeleteUserOpen(false);
        }}
      />

      <DeleteUserForm
        open={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsDeleteUserOpen(false);
          navigate("/dashboard/users");
        }}
      />
    </>
  );
};

export default DetailUserPage;
