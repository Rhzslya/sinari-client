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
import { motion, type Variants } from "framer-motion";

// 👇 Setup Animasi
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-muted-foreground flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        {t("users_management.detail.loading")}
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-4 text-sm text-destructive">
        {t("users_management.detail.not_found")}
      </div>
    );
  }

  const labelStyle =
    "text-[10px] sm:text-xs uppercase text-muted-foreground font-semibold tracking-wider";
  const valueStyle = "font-medium text-xs sm:text-sm";

  return (
    <>
      <motion.div
        className="space-y-4 sm:space-y-6 pb-10 overflow-x-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 sm:gap-4 w-full"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/users")}
            className="cursor-pointer shrink-0 h-8 w-8 sm:h-10 sm:w-10"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">
              {t("users_management.detail.header_title")}
            </h1>
            <div className="flex items-center text-xs sm:text-sm text-muted-foreground truncate">
              <span className="truncate mr-1">
                {t("users_management.detail.header_subtitle")}
              </span>
              <TruncatedTooltip
                text={user.username || ""}
                className="font-semibold text-foreground truncate"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr">
          {/* 1. PROFILE CARD */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 flex h-full"
          >
            <Card className="w-full flex flex-col shadow-sm">
              <CardHeader className="pb-6 sm:pb-8">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="w-14 h-14 sm:w-20 sm:h-20  outline-2 outline-offset-2 outline-primary/20 shadow-sm shrink-0">
                    <AvatarFallback className="text-xl sm:text-3xl font-bold text-primary bg-primary/5 border border-primary/10">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-2xl truncate pr-2">
                      {user.name}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5">
                      <TruncatedTooltip
                        text={user.username}
                        className="max-w-30 sm:max-w-xs text-xs sm:text-sm"
                      />
                      {user.is_online ? (
                        <Badge
                          variant="outline"
                          className="text-green-600 bg-green-50 border-green-200 text-[10px] sm:text-xs py-0 h-5"
                        >
                          {t("users_management.table.status.online")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] sm:text-xs py-0 h-5 text-muted-foreground"
                        >
                          {t("users_management.table.status.offline")}
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="-mt-4 sm:-mt-6 flex-1 px-4 sm:px-6">
                <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 h-full">
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className={labelStyle}>
                      {t("users_management.detail.profile.email")}
                    </label>
                    <div className={`${valueStyle} flex items-center gap-2`}>
                      <TruncatedTooltip
                        text={user.email}
                        className="max-w-45 sm:max-w-55"
                      />
                      {user.is_verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5 md:text-center">
                    <label className={labelStyle}>
                      {t("users_management.detail.profile.user_id")}
                    </label>
                    <div
                      className={`${valueStyle} font-mono bg-muted/50 w-fit md:mx-auto px-2 py-0.5 rounded border`}
                    >
                      #{user.id}
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <label className={labelStyle}>
                      {t("users_management.detail.profile.auth_method")}
                    </label>
                    <div className={`${valueStyle} flex items-center gap-2`}>
                      {user.google_id ? (
                        <FcGoogle className="w-4 h-4 shrink-0" />
                      ) : (
                        <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="truncate">
                        {user.google_id
                          ? t("users_management.detail.profile.google_oauth")
                          : t("users_management.detail.profile.standard_email")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5 md:text-center">
                    <label className={labelStyle}>
                      {t("users_management.detail.profile.role")}
                    </label>
                    <div>
                      <Badge
                        variant="outline"
                        className={`capitalize min-w-20 justify-center border text-[10px] sm:text-xs ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.role.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 2. QUICK ACTIONS CARD */}
          <motion.div variants={itemVariants} className="flex h-full">
            <Card className="bg-muted/30 w-full flex flex-col shadow-sm border-dashed sm:border-solid border-2 sm:border">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-sm sm:text-base">
                  {t("users_management.detail.quick_actions.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2.5 sm:gap-3 flex-1">
                <Button
                  className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
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
                    <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin shrink-0" />
                  ) : (
                    <Mail className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  )}

                  <span className="truncate">
                    {verifyCooldown > 0
                      ? t("users_management.detail.quick_actions.resend_in", {
                          seconds: verifyCooldown,
                        })
                      : user.is_verified
                        ? t(
                            "users_management.detail.quick_actions.already_verified",
                          )
                        : t(
                            "users_management.detail.quick_actions.resend_verify",
                          )}
                  </span>
                </Button>

                <Button
                  className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
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
                    <Loader2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin shrink-0" />
                  ) : (
                    <RefreshCcw className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  )}

                  <span className="truncate">
                    {isRateLimited(user.pass_reset_count)
                      ? t("users_management.detail.quick_actions.daily_limit")
                      : resetCooldown > 0
                        ? t("users_management.detail.quick_actions.resend_in", {
                            seconds: resetCooldown,
                          })
                        : t(
                            "users_management.detail.quick_actions.resend_reset",
                          )}
                  </span>
                </Button>

                <Button
                  onClick={() => handleUpdateRoleOpen(user)}
                  className="w-full justify-start duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                  variant="outline"
                  disabled={isChangeRoleDisabled}
                >
                  <Pen className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {t("users_management.detail.quick_actions.change_role")}
                  </span>
                </Button>

                <Button
                  onClick={() => handleDeleteUserOpen(user)}
                  className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer h-9 sm:h-10 text-xs sm:text-sm"
                  variant="outline"
                  disabled={isDeleteDisabled}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span className="truncate">
                    {t("users_management.detail.quick_actions.delete_user")}
                  </span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* 3. ACTIVITY LIMITS CARD */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 flex h-full"
          >
            <Card className="w-full flex flex-col shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg flex gap-2 items-center">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                  {t("users_management.detail.activity_limits.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-end text-xs sm:text-sm">
                      <span className="text-muted-foreground font-medium">
                        {t(
                          "users_management.detail.activity_limits.verify_attempts",
                        )}
                      </span>
                      <span
                        className={`font-mono ${isRateLimited(user.resend_count) ? "text-destructive font-bold" : "text-foreground font-semibold"}`}
                      >
                        {user.resend_count} / 5
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/50">
                      <div
                        className={`h-full transition-all duration-1000 ${isRateLimited(user.resend_count) ? "bg-destructive" : "bg-orange-500"}`}
                        style={{ width: `${(user.resend_count / 5) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-right">
                      {t(
                        "users_management.detail.activity_limits.last_attempt",
                      )}{" "}
                      <span className="font-medium">
                        {formatDate(user.last_resend_time)}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-end text-xs sm:text-sm">
                      <span className="text-muted-foreground font-medium">
                        {t(
                          "users_management.detail.activity_limits.reset_attempts",
                        )}
                      </span>
                      <span
                        className={`font-mono ${isRateLimited(user.pass_reset_count) ? "text-destructive font-bold" : "text-foreground font-semibold"}`}
                      >
                        {user.pass_reset_count} / 5
                      </span>
                    </div>
                    <div className="h-2 w-full bg-secondary/60 rounded-full overflow-hidden border border-border/50">
                      <div
                        className={`h-full transition-all duration-1000 ${isRateLimited(user.pass_reset_count) ? "bg-destructive" : "bg-orange-500"}`}
                        style={{
                          width: `${(user.pass_reset_count / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-right">
                      {t(
                        "users_management.detail.activity_limits.last_attempt",
                      )}{" "}
                      <span className="font-medium">
                        {formatDate(user.pass_reset_last_time)}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 4. SYSTEM TIME CARD */}
          <motion.div variants={itemVariants} className="flex h-full">
            <Card className="w-full flex flex-col shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-sm sm:text-base flex gap-2 items-center">
                  <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  {t("users_management.detail.system_time.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center space-y-5 sm:space-y-6">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className={labelStyle}>
                    {t("users_management.detail.system_time.created_at")}
                  </label>
                  <p className={`${valueStyle} border-b border-border/50 pb-2`}>
                    {formatDate(user.created_at)}
                  </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className={labelStyle}>
                    {t("users_management.detail.system_time.last_updated")}
                  </label>
                  <p className={`${valueStyle} border-b border-border/50 pb-2`}>
                    {formatDate(user.updated_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1 sm:pt-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${user.updated_at === user.created_at ? "bg-slate-300 dark:bg-slate-600" : "bg-emerald-500 animate-pulse"}`}
                  ></div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                    {user.updated_at === user.created_at
                      ? t(
                          "users_management.detail.system_time.no_modifications",
                        )
                      : t("users_management.detail.system_time.data_modified")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* DIALOGS */}
      <UpdateRoleForm
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRoleOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsUpdateRoleOpen(false);
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
