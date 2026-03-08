import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { Badge } from "@/components/ui/badge";
import type { NotPublicUserResponse } from "@/model/user-model";
import type { ExtendedTableProps } from "@/types/type";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserActionMenu } from "./UserActionMenu";
import DeleteUserForm from "./DeleteUserForm";
import UpdateRoleForm from "./UpdateRoleForm";
import EmailCell from "./EmailCell";
import { getRoleBadgeColor } from "@/components/utils/roleBadge";
import { UserSkeletonTable } from "./Skeleton";
import NotFoundPage from "@/pages/NotFoundPage";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import RestoreUserForm from "./RestoreUserForm";

const tableRowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const DashboardUserTable = ({
  users,
  currentUser,
  isLoading,
  onSuccess,
  isTrashView,
}: ExtendedTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedUser, setSelectedUser] =
    useState<NotPublicUserResponse | null>(null);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);
  const [isRestoreUserOpen, setIsRestoreUserOpen] = useState(false);

  const sortedUsers = useMemo(() => {
    if (!currentUser?.id) return users;

    return [...users].sort((a, b) => {
      if (a.id === currentUser?.id) return -1;
      if (b.id === currentUser?.id) return 1;
      return 0;
    });
  }, [users, currentUser?.id]);

  const handleViewDetail = (user: NotPublicUserResponse) => {
    navigate(`/dashboard/users/detail/${user.id}`);
  };

  const handleDeleteUserOpen = (user: NotPublicUserResponse) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleUpdateRoleOpen = (user: NotPublicUserResponse) => {
    setSelectedUser(user);
    setIsUpdateRoleOpen(true);
  };

  const handleRestoreUser = (user: NotPublicUserResponse) => {
    setSelectedUser(user);
    setIsRestoreUserOpen(true);
  };

  if (isLoading) {
    return <UserSkeletonTable />;
  }

  if (users.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <NotFoundPage
          variant="minimal"
          isDashboard={true}
          entityName={t("users_management.table.not_found_entity")}
          onGoBack={() => navigate("/dashboard/users", { replace: true })}
        />
      </motion.div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div
          className="rounded-md border bg-card shadow-sm w-full overflow-x-auto pb-2 sm:pb-0
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:bg-primary/20 
            [&::-webkit-scrollbar-thumb]:rounded-full
            hover:[&::-webkit-scrollbar-thumb]:bg-primary
            transition-colors
            "
        >
          <Table className="min-w-250 w-full text-sm table-fixed">
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/30">
                <TableHead className="w-12 font-bold border-r border-border/60 text-center">
                  {t("users_management.table.headers.id")}
                </TableHead>

                <TableHead className="w-48 font-bold">
                  {t("users_management.table.headers.email")}
                </TableHead>

                <TableHead className="w-40 font-bold">
                  {t("users_management.table.headers.username")}
                </TableHead>

                <TableHead className="w-28 text-center font-bold">
                  {t("users_management.table.headers.role")}
                </TableHead>

                <TableHead className="w-32 text-center font-bold">
                  {t("users_management.table.headers.status")}
                </TableHead>

                <TableHead className="w-32 font-bold">
                  {t("users_management.table.headers.created_at")}
                </TableHead>

                <TableHead className="w-32 font-bold">
                  {t("users_management.table.headers.updated_at")}
                </TableHead>

                <TableHead className="w-20 text-right pr-6 font-bold">
                  {t("users_management.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedUsers.map((user, index) => {
                const isCurrentUser = user.id === currentUser?.id;
                const rowClass = isCurrentUser
                  ? "bg-primary/5 hover:bg-primary/10"
                  : "transition-colors hover:bg-muted/50";

                return (
                  <motion.tr
                    key={user.id}
                    className={`border-b border-border ${rowClass}`}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.04 }}
                  >
                    <TableCell className="border-r border-border/60 text-center font-medium">
                      <span className="text-xs text-muted-foreground">
                        {user.id}
                      </span>
                    </TableCell>

                    <TableCell className="truncate">
                      <EmailCell email={user.email} />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TruncatedTooltip
                          text={user.username}
                          className={`font-medium text-xs sm:text-sm truncate ${isCurrentUser ? "text-primary font-bold" : ""}`}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Badge
                          variant="outline"
                          className={`capitalize text-[10px] sm:text-xs min-w-18.75 justify-center border shadow-sm ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.toLowerCase()}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center items-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-medium border min-w-21.25 justify-center shadow-sm ${
                            user.is_online
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            {user.is_online && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            )}
                            <span
                              className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                user.is_online
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            ></span>
                          </span>
                          {user.is_online
                            ? t("users_management.table.status.online")
                            : t("users_management.table.status.offline")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                        {format(new Date(user.created_at), "dd MMM yyyy")}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-[10px] sm:text-xs text-muted-foreground font-mono">
                        {user.updated_at
                          ? format(new Date(user.updated_at), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end">
                        <UserActionMenu
                          currentUser={currentUser}
                          isCurrentUser={isCurrentUser}
                          user={user}
                          onViewDetails={() => handleViewDetail(user)}
                          onUpdateRole={() => handleUpdateRoleOpen(user)}
                          onDeleteUser={() => handleDeleteUserOpen(user)}
                          onRestoreUser={() => handleRestoreUser(user)}
                          isTrashView={isTrashView ?? false}
                        />
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* MODALS */}
      <UpdateRoleForm
        open={isUpdateRoleOpen}
        onOpenChange={setIsUpdateRoleOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsUpdateRoleOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
      <DeleteUserForm
        open={isDeleteUserOpen}
        onOpenChange={setIsDeleteUserOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsDeleteUserOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
      <RestoreUserForm
        open={isRestoreUserOpen}
        onOpenChange={setIsRestoreUserOpen}
        user={selectedUser}
        onSuccess={() => {
          setIsRestoreUserOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
    </>
  );
};

export default DashboardUserTable;
