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
import { motion, AnimatePresence } from "framer-motion";

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
  const isOwner = currentUser?.role === "OWNER";

  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (callback: () => void) => {
    setIsOpen(false);
    setTimeout(() => {
      callback();
    }, 150);
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

      <DropdownMenuContent align="end" className="w-48 p-1">
        <AnimatePresence>
          {!isTrashView ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <DropdownMenuItem
                onSelect={() => handleAction(onEditTechnician)}
                className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <Pencil className="size-4 text-muted-foreground" />
                {t("technicians_management.action_menu.edit_technician")}
              </DropdownMenuItem>

              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => handleAction(onDeleteTechnician)}
                    className="gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    {t("technicians_management.action_menu.delete_technician")}
                  </DropdownMenuItem>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <DropdownMenuItem
                onClick={onRestoreTechnician}
                disabled={!isOwner}
                className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${!isOwner ? "opacity-50" : "cursor-pointer"}`}
              >
                <ArchiveRestore className="size-4" />
                {t("technicians_management.action_menu.restore_data")}
              </DropdownMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
