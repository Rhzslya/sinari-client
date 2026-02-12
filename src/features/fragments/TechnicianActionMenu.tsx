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
import type { TechnicianResponse } from "@/model/technician-model";

interface ProductActionMenuProps {
  technician: TechnicianResponse;
  onEditTechnician: () => void;
  onDeleteTechnician: () => void;
}

export function TechnicianActionMenu({
  technician,
  onEditTechnician,
  onDeleteTechnician,
}: ProductActionMenuProps) {
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
        <DropdownMenuItem
          onSelect={() => {
            handleAction(onEditTechnician);
          }}
        >
          Edit Technician
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => handleAction(onDeleteTechnician)}
          className="text-destructive focus:text-destructive"
        >
          Delete Product
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
