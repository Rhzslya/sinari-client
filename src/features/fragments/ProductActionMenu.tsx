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
import type { ProductResponse } from "@/model/product-model";
import { useUserQueries } from "@/hooks/user-queries";

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
      key={product.id}
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
                handleAction(onUpdateStock);
              }}
            >
              Update Stock
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                handleAction(onEditProduct);
              }}
            >
              Edit Product
            </DropdownMenuItem>
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleAction(onDeleteProduct)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Product
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <DropdownMenuItem
            onClick={onRestoreProduct}
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
