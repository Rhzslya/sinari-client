import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArchiveRestore, MoreHorizontalIcon } from "lucide-react";
import type { NotPublicUserResponse, UserResponse } from "@/model/user-model";

interface UserActionMenuProps {
  user: NotPublicUserResponse;
  currentUser: UserResponse | undefined;
  onViewDetails: () => void;
  onUpdateRole: () => void;
  onDeleteUser: () => void;
  isCurrentUser?: boolean;
  onRestoreUser?: () => void;
  isTrashView?: boolean;
}

export function UserActionMenu({
  user,
  currentUser,
  onViewDetails,
  onUpdateRole,
  onDeleteUser,
  isCurrentUser = false,
  isTrashView,
  onRestoreUser,
}: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isTargetOwner = user.role === "OWNER";
  const isTargetAdmin = user.role === "ADMIN";

  const isCurrentUserOwner = currentUser?.role === "OWNER";
  const isCurrentUserAdmin = currentUser?.role === "ADMIN";

  const isAdminDeletingAdmin = isCurrentUserAdmin && isTargetAdmin;

  const isDeleteDisabled =
    isCurrentUser || isTargetOwner || isAdminDeletingAdmin;

  const isEditRoleDisabled =
    isCurrentUser || isTargetOwner || !isCurrentUserOwner;

  const handleAction = (callback: () => void) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        callback();
      }, 0);
    });
  };

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={false}
      key={user.id}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontalIcon className="size-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {!isTrashView ? (
          <>
            <DropdownMenuItem
              onClick={() => handleAction(onViewDetails)}
              className="cursor-pointer"
            >
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                handleAction(onUpdateRole);
              }}
              disabled={isDeleteDisabled}
              className={
                isEditRoleDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }
            >
              Edit Role
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => handleAction(onDeleteUser)}
              disabled={isDeleteDisabled}
              className={`text-destructive focus:text-destructive ${
                isDeleteDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              Delete User
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={onRestoreUser}
            className="text-emerald-600 focus:text-emerald-600 cursor-pointer"
            disabled={!isCurrentUserOwner}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Restore Data
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
