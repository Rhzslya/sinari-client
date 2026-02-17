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
import type { TechnicianResponse } from "@/model/technician-model";
import { useUserQueries } from "@/hooks/user-queries";

interface ProductActionMenuProps {
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
}: ProductActionMenuProps) {
  const userQueries = useUserQueries();

  const { data: currentUser } = userQueries.useProfile();
  const isOwner = currentUser?.role === "OWNER";

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
      key={technician.id}
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
              onSelect={() => {
                handleAction(onEditTechnician);
              }}
            >
              Edit Technician
            </DropdownMenuItem>

            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleAction(onDeleteTechnician)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Technician
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <DropdownMenuItem
            onClick={onRestoreTechnician}
            className="text-emerald-600 focus:text-emerald-600 cursor-pointer"
            disabled={!isOwner}
          >
            <ArchiveRestore className="mr-2 h-4 w-4" />
            Restore Data
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
