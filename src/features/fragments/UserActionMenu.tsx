import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveRestore,
  MoreHorizontalIcon,
  UserCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { NotPublicUserResponse, UserResponse } from "@/model/user-model";
import { useTranslation } from "react-i18next";
import { UserRole } from "@/enum/enum";

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
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const isTargetOwner = user.role === UserRole.OWNER;
  const isTargetAdmin = user.role === UserRole.ADMIN;

  const isCurrentUserOwner = currentUser?.role === UserRole.OWNER;
  const isCurrentUserAdmin = currentUser?.role === UserRole.ADMIN;

  const isAdminDeletingAdmin = isCurrentUserAdmin && isTargetAdmin;

  const isDeleteDisabled =
    isCurrentUser || isTargetOwner || isAdminDeletingAdmin;

  const isEditRoleDisabled =
    isCurrentUser || isTargetOwner || !isCurrentUserOwner;

  const handleAction = (e: Event, callback: () => void) => {
    e.preventDefault();
    document.body.focus();
    setIsOpen(false);

    //Aria Hidden
    setTimeout(() => {
      callback();
    }, 250);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer hover:bg-muted transition-colors rounded-full"
        >
          <MoreHorizontalIcon className="size-4 text-muted-foreground" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 p-1"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {!isTrashView ? (
          <>
            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onViewDetails)}
              className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <UserCircle className="size-4 text-muted-foreground" />
              {t("users_management.action_menu.view_details")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onUpdateRole)}
              disabled={isEditRoleDisabled}
              className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm ${
                isEditRoleDisabled ? "opacity-50" : "cursor-pointer"
              }`}
            >
              <ShieldCheck className="size-4 text-muted-foreground" />
              {t("users_management.action_menu.edit_role")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onSelect={(e) => handleAction(e, onDeleteUser)}
              disabled={isDeleteDisabled}
              className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 ${
                isDeleteDisabled ? "opacity-50" : "cursor-pointer"
              }`}
            >
              <Trash2 className="size-4" />
              {t("users_management.action_menu.delete_user")}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => onRestoreUser && handleAction(e, onRestoreUser)}
            disabled={!isCurrentUserOwner}
            className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${
              !isCurrentUserOwner ? "opacity-50" : "cursor-pointer"
            }`}
          >
            <ArchiveRestore className="size-4" />
            {t("users_management.action_menu.restore_data")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
