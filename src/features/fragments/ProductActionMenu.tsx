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
  Eye,
  PackagePlus,
  Pencil,
  Trash2,
} from "lucide-react";
import type { ProductResponse } from "@/model/product-model";
import { useUserQueries } from "@/hooks/user-queries";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface ProductActionMenuProps {
  product: ProductResponse;
  onViewDetails: () => void;
  onUpdateStock: () => void;
  onEditProduct: () => void;
  onDeleteProduct: () => void;
  onRestoreProduct?: () => void;
  isTrashView: boolean;
}

export function ProductActionMenu({
  product,
  onViewDetails,
  onUpdateStock,
  onEditProduct,
  onDeleteProduct,
  onRestoreProduct,
  isTrashView,
}: ProductActionMenuProps) {
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
      key={product.id}
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
                onClick={() => handleAction(onViewDetails)}
                className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <Eye className="size-4 text-muted-foreground" />
                {t("products_management.action_menu.view_details")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => handleAction(onUpdateStock)}
                className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <PackagePlus className="size-4 text-muted-foreground" />
                {t("products_management.action_menu.update_stock")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => handleAction(onEditProduct)}
                className="cursor-pointer gap-2 h-9 sm:h-10 text-xs sm:text-sm"
              >
                <Pencil className="size-4 text-muted-foreground" />
                {t("products_management.action_menu.edit_product")}
              </DropdownMenuItem>

              {isOwner && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => handleAction(onDeleteProduct)}
                    className="gap-2 h-9 sm:h-10 text-xs sm:text-sm text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                    {t("products_management.action_menu.delete_product")}
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
                onClick={onRestoreProduct}
                disabled={!isOwner}
                className={`gap-2 h-9 sm:h-10 text-xs sm:text-sm text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 ${!isOwner ? "opacity-50" : "cursor-pointer"}`}
              >
                <ArchiveRestore className="size-4" />
                {t("products_management.action_menu.restore_data")}
              </DropdownMenuItem>
            </motion.div>
          )}
        </AnimatePresence>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
