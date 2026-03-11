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
  Pencil,
  Trash2,
} from "lucide-react";
import type { TechnicianResponse } from "@/model/technician-model";
import { useUserQueries } from "@/hooks/user-queries";
import { useTranslation } from "react-i18next";
import { UserRole } from "@/enum/enum";

interface TechnicianActionMenuProps {
  technician: TechnicianResponse;
  onEditTechnician: () => void;
  onDeleteTechnician: () => void;
  onRestoreTechnician: () => void;
  isTrashView: boolean;
}

export function TechnicianActionMenu({
  technician,
  onEditTechnician,
  onDeleteTechnician,
  onRestoreTechnician,
  isTrashView,
}: TechnicianActionMenuProps) {
  const { t } = useTranslation();
  const userQueries = useUserQueries();

  const { data: currentUser } = userQueries.useProfile();
  const isOwner = currentUser?.role === UserRole.OWNER;

  const [isOpen, setIsOpen] = useState(false);

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
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={false}
      key={technician.id}
    >
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
              onSelect={(e) => handleAction(e, onEditTechnician)}
              className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
            >
              <Pencil className="size-4 text-muted-foreground" />
              {t("technicians_management.action_menu.edit_technician")}
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => handleAction(e, onDeleteTechnician)}
                  className="gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                >
                  <Trash2 className="size-4" />
                  {t("technicians_management.action_menu.delete_technician")}
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => handleAction(e, onRestoreTechnician)}
            disabled={!isOwner}
            className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${!isOwner ? "opacity-50" : "cursor-pointer"}`}
          >
            <ArchiveRestore className="size-4" />
            {t("technicians_management.action_menu.restore_data")}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
