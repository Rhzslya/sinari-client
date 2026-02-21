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

const DetailUserPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
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

  //Delete User States
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  //Update Role States
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

  //Send Verification Email States
  const { cooldown: verifyCooldown, startCooldown: startVerifyCooldown } =
    useCooldown(`admin_resend_verify_${user?.email}`);
  const [verifyLoading, setVerifyLoading] = useState(false);

  //Resend Reset Password States
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
      toast.error("Please wait before resending again");
      return;
    }

    setVerifyLoading(true);

    try {
      await AuthServices.resendVerification({ identifier: user.email });
      toast.success(`Verification email sent to ${user.email}`);
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
            toast.error(`User is in cooldown. Try again in ${match[1]}s.`);
          }
        } else if (
          status === 400 &&
          mainMessage.toLowerCase().includes("verified")
        ) {
          toast.info("User is already verified.");
        } else if (status === 429) {
          const match = mainMessage.match(/(\d+)s|(\d+) seconds/);
          const seconds = match ? parseInt(match[1] || match[2], 10) : 60;
          startVerifyCooldown(seconds);
          toast.error(`Rate limit reached. Try again in ${seconds}s.`);
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
      toast.error("Please wait before resending again");
      return;
    }

    setResetLoading(true);

    try {
      await AuthServices.forgotPassword({ identifier: user.email });
      toast.success(`Reset password email sent to ${user.email}`);
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
            toast.error(`User is in cooldown. Try again in ${seconds}s.`);
          }
        } else if (status === 429) {
          const match = mainMessage.match(/(\d+)s|(\d+) seconds/);
          const seconds = match ? parseInt(match[1] || match[2], 10) : 60;
          startResetCooldown(seconds);

          if (mainMessage.toLowerCase().includes("daily")) {
            toast.error("Daily limit reached for this action.");
          } else {
            toast.error(`Rate limit reached. Try again in ${seconds}s.`);
          }
        } else {
          toast.error(mainMessage);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setResetLoading(false);
    }
  };

  const haveGoogleAuth = user?.google_id !== null;

  if (isError || !user) return <div>User Not Found</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/users")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">User Details</h1>
            <span className="text-sm text-muted-foreground truncate max-w-[320px]">
              Manage information for{" "}
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
          {/* 1. Main Profile Card  */}
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
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="outline">Offline</Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="-mt-4 flex-1">
              <div className="bg-card border rounded-lg p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    Email
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
                    User ID
                  </label>
                  <div className="font-medium font-mono text-sm bg-muted/50 w-fit mx-auto px-2 py-0.5 rounded border">
                    #{user.id}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    Auth Method
                  </label>
                  <div className="font-medium flex items-center gap-2">
                    {user.google_id ? (
                      <FcGoogle className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    )}
                    {user.google_id ? "Google OAuth" : "Standard Email"}
                  </div>
                </div>
                <div className="space-y-1 text-center">
                  <label className="text-xs uppercase text-muted-foreground font-semibold">
                    Role
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
              <CardTitle className="text-base">Quick Actions</CardTitle>
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
                  ? `Resend in ${verifyCooldown}s`
                  : user.is_verified
                    ? "Already Verified"
                    : "Resend Verification"}
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
                  ? "Daily Limit Reached"
                  : resetCooldown > 0
                    ? `Resend in ${resetCooldown}s`
                    : "Resend Reset Password"}
              </Button>
              <Button
                onClick={() => handleUpdateRoleOpen(user)}
                className="w-full justify-start duration-300 cursor-pointer"
                variant="outline"
                disabled={isChangeRoleDisabled}
              >
                <Pen className="mr-2 h-4 w-4" /> Change Role
              </Button>
              <Button
                onClick={() => handleDeleteUserOpen(user)}
                className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer"
                variant="outline"
                disabled={isDeleteDisabled}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete User
              </Button>
            </CardContent>
          </Card>

          {/* 3. Activity Limits */}
          <Card className="xl:col-span-2 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex gap-2 items-center">
                <Activity className="w-5 h-5 text-orange-600" /> Activity Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Verify Attempts
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
                    Last attempt: {formatDate(user.last_resend_time)}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Reset Attempts
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
                    Last attempt: {formatDate(user.pass_reset_last_time)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. System Time */}
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="text-base flex gap-2 items-center">
                <CalendarClock className="w-5 h-5 text-blue-600" /> System Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground font-semibold">
                  Created At
                </label>
                <p className="font-medium text-sm border-b pb-2">
                  {formatDate(user.created_at)}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase text-muted-foreground font-semibold">
                  Last Updated
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
                    ? "No modifications"
                    : "Data modified"}
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
