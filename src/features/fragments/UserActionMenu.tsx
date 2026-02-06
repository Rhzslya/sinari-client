import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import type { ListUserResponse } from "@/model/user-model";

interface UserActionMenuProps {
  user: ListUserResponse;
  onViewDetails: () => void;
  onUpdateRole: () => void;
  onDeleteUser: () => void;
  isCurrentUser?: boolean;
}

export function UserActionMenu({
  user,
  onViewDetails,
  onUpdateRole,
  onDeleteUser,
  isCurrentUser = false,
}: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

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
          disabled={isCurrentUser}
          className={
            isCurrentUser ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }
        >
          Edit Role
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => handleAction(onDeleteUser)}
          disabled={isCurrentUser}
          className={`text-destructive focus:text-destructive ${
            isCurrentUser ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
