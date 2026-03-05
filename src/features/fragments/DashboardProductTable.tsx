import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { Eye, EyeOff } from "lucide-react";
import type { DashboardProductTableProps } from "@/types/type";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ProductResponse } from "@/model/product-model";
import UpdateStockForm from "./UpdateStockForm";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditProductForm } from "../components/EditProductForm";
import DeleteProductForm from "./DeleteProductForm";
import { ProductActionMenu } from "./ProductActionMenu";
import { ProductSkeletonTable } from "./Skeleton";
import RestoreProductForm from "./RestoreProductForm";
import NotFoundPage from "@/pages/NotFoundPage";
import { useTranslation } from "react-i18next";

export function DashboardProductTable({
  products,
  isLoading,
  onSuccess,
  isTrashView,
}: DashboardProductTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showCost, setShowCost] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  const [isRestoreProductOpen, setIsRestoreProductOpen] = useState(false);

  const handleViewDetail = (product: ProductResponse) => {
    navigate(`/dashboard/products/detail/${product.id}`);
  };

  const handleUpdateStockOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsUpdateStockOpen(true);
  };

  if (isLoading) {
    return <ProductSkeletonTable />;
  }

  if (products.length === 0) {
    return (
      <NotFoundPage
        variant="minimal"
        isDashboard={true}
        entityName={t("products_management.table.not_found_entity")}
        onGoBack={() => navigate("/dashboard/products", { replace: true })}
      />
    );
  }

  const handleEditProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleDeleteProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsDeleteProductOpen(true);
  };

  const handleRestoreProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsRestoreProductOpen(true);
  };

  return (
    <>
      <TooltipProvider>
        <div className="rounded-md border bg-card">
          <Table className="min-w-200">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-14 font-bold border-r border-border/60 text-center">
                  {t("products_management.table.headers.id")}
                </TableHead>
                <TableHead className="w-87.5 font-bold">
                  {t("products_management.table.headers.name")}
                </TableHead>
                <TableHead className="w-37.5 font-bold">
                  {t("products_management.table.headers.brand")}
                </TableHead>
                <TableHead className="w-37.5 font-bold">
                  {t("products_management.table.headers.category")}
                </TableHead>
                <TableHead className="w-25 font-bold">
                  {t("products_management.table.headers.stock")}
                </TableHead>
                <TableHead className="w-37.5 font-bold">
                  <div className="flex items-center gap-2">
                    <span>{t("products_management.table.headers.cost")}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setShowCost(!showCost)}
                      title={
                        showCost
                          ? t("products_management.table.tooltips.hide_cost")
                          : t("products_management.table.tooltips.show_cost")
                      }
                    >
                      {showCost ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="w-37.5 font-bold">
                  {t("products_management.table.headers.price")}
                </TableHead>
                <TableHead className="w-12.5 text-right font-bold">
                  {t("products_management.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="border-r border-border/60 text-center font-medium">
                    <span className="text-xs text-muted-foreground">
                      {product.id}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <TruncatedTooltip
                        text={product.name}
                        className="font-medium text-md max-w-[320px]"
                      />
                      <span className="text-xs text-muted-foreground truncate max-w-[320px]">
                        {product.manufacturer}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground font-medium">
                      {product.brand}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {product.category}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`font-medium ${
                        product.stock > 0
                          ? "text-emerald-600"
                          : "text-destructive"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </TableCell>

                  <TableCell className="text-muted-foreground font-mono text-sm truncate">
                    {showCost ? (
                      formatRupiah(product.cost_price)
                    ) : (
                      <span className="tracking-widest text-muted-foreground/50 select-none">
                        •••••••
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="font-medium font-mono text-sm truncate">
                    {formatRupiah(product.price)}
                  </TableCell>

                  <TableCell className="text-right">
                    <ProductActionMenu
                      product={product}
                      onViewDetails={() => handleViewDetail(product)}
                      onEditProduct={() => handleEditProductOpen(product)}
                      onUpdateStock={() => handleUpdateStockOpen(product)}
                      onDeleteProduct={() => handleDeleteProductOpen(product)}
                      onRestoreProduct={() => handleRestoreProductOpen(product)}
                      isTrashView={isTrashView ?? false}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      <UpdateStockForm
        key={selectedProduct ? selectedProduct.id : "reset"}
        open={isUpdateStockOpen}
        onOpenChange={setIsUpdateStockOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsUpdateStockOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />

      <Sheet open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <SheetContent
          className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl text-primary">
              {t("products_management.sheet.edit_title")}
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            {t("products_management.sheet.edit_desc")}
          </SheetDescription>

          <div className="flex-1 overflow-hidden">
            {selectedProduct && (
              <EditProductForm
                product={selectedProduct}
                onSuccess={() => {
                  setIsEditProductOpen(false);
                  if (onSuccess) onSuccess();
                }}
                onCancel={() => setIsEditProductOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
      <DeleteProductForm
        open={isDeleteProductOpen}
        onOpenChange={setIsDeleteProductOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsDeleteProductOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />

      <RestoreProductForm
        open={isRestoreProductOpen}
        onOpenChange={setIsRestoreProductOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsRestoreProductOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        }}
      />
    </>
  );
}
