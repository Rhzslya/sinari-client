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
import { motion, AnimatePresence } from "framer-motion";

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
    setIsOpen(false);
    setTimeout(() => {
      callback();
    }, 150);
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

      <DropdownMenuContent align="end" className="w-48 p-1">
        <AnimatePresence>
          {!isTrashView ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <DropdownMenuItem
                onClick={() => handleAction(onViewDetails)}
                className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <UserCircle className="size-4 text-muted-foreground" />
                {t("users_management.action_menu.view_details")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => handleAction(onUpdateRole)}
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
                onSelect={() => handleAction(onDeleteUser)}
                disabled={isDeleteDisabled}
                className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 ${
                  isDeleteDisabled ? "opacity-50" : "cursor-pointer"
                }`}
              >
                <Trash2 className="size-4" />
                {t("users_management.action_menu.delete_user")}
              </DropdownMenuItem>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DropdownMenuItem
                onClick={onRestoreUser}
                disabled={!isCurrentUserOwner}
                className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${
                  !isCurrentUserOwner ? "opacity-50" : "cursor-pointer"
                }`}
              >
                <ArchiveRestore className="size-4" />
                {t("users_management.action_menu.restore_data")}
              </DropdownMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
