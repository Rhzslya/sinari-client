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
import type { NotPublicUserResponse } from "@/model/user-model"; // Ensure this matches your new NotPublicUserResponse type
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

const DashboardUserTable = ({
  users,
  currentUser,
  isLoading,
  onSuccess,
}: ExtendedTableProps) => {
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] =
    useState<NotPublicUserResponse | null>(null);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

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

  if (isLoading) {
    return <UserSkeletonTable />;
  }

  if (users.length === 0) {
    return (
      <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
        No users found.
      </div>
    );
  }

  if (isLoading) return <UserSkeletonTable />;

  return (
    <>
      <TooltipProvider>
        <div className="rounded-md border bg-card">
          <Table className="min-w-250">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 font-bold border-r border-border/60 text-center">
                  ID
                </TableHead>

                <TableHead className="w-50 font-bold">Email</TableHead>

                <TableHead className="w-37.5 font-bold">Username</TableHead>

                <TableHead className="w-30 text-center font-bold">
                  Role
                </TableHead>

                <TableHead className="w-30 text-center font-bold">
                  Status
                </TableHead>

                <TableHead className="w-35 font-bold">Created At</TableHead>
                <TableHead className="w-35 font-bold">Updated At</TableHead>

                <TableHead className="w-15 text-right font-bold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedUsers.map((user) => {
                const isCurrentUser = user.id === currentUser?.id;
                const rowClass = isCurrentUser
                  ? "bg-primary/20 hover:bg-primary/15 border-b-2 border-primary/20"
                  : "";

                return (
                  <TableRow key={user.id} className={rowClass}>
                    <TableCell className="border-r border-border/60 text-center font-medium">
                      <span className="text-xs text-muted-foreground">
                        {user.id}
                      </span>
                    </TableCell>

                    <TableCell>
                      <EmailCell email={user.email} />
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TruncatedTooltip
                          text={user.username}
                          className={`font-medium text-md max-w-35 truncate ${isCurrentUser ? "text-primary font-bold" : ""}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        <Badge
                          variant="outline"
                          className={`capitalize min-w-20 justify-center border ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.role.toLowerCase()}
                        </Badge>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center items-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border min-w-21.25 justify-center ${
                            user.is_online
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span className={`relative flex h-2 w-2`}>
                            {user.is_online && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            )}
                            <span
                              className={`relative inline-flex rounded-full h-2 w-2 ${
                                user.is_online
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            ></span>
                          </span>
                          {user.is_online ? "Online" : "Offline"}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono">
                        {format(new Date(user.created_at), "dd MMM yyyy")}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono">
                        {user.updated_at
                          ? format(new Date(user.updated_at), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right">
                      <UserActionMenu
                        currentUser={currentUser}
                        isCurrentUser={isCurrentUser}
                        user={user}
                        onViewDetails={() => handleViewDetail(user)}
                        onUpdateRole={() => handleUpdateRoleOpen(user)}
                        onDeleteUser={() => handleDeleteUserOpen(user)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

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
    </>
  );
};

export default DashboardUserTable;
