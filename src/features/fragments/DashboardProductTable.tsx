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
import { motion, type Variants } from "framer-motion";

const tableRowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

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

  if (isLoading) {
    return <ProductSkeletonTable />;
  }

  if (products.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <NotFoundPage
          variant="minimal"
          isDashboard={true}
          entityName={t("products_management.table.not_found_entity")}
          onGoBack={() => navigate("/dashboard/products", { replace: true })}
        />
      </motion.div>
    );
  }

  return (
    <>
      <TooltipProvider>
        {/* Responsive Wrapper */}
        <div className="rounded-md border bg-card overflow-x-auto w-full shadow-sm custom-scrollbar">
          {/* Lebar Kolom Asli Dipertahankan */}
          <Table className="min-w-200 w-full text-sm table-fixed">
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
                <TableHead className="w-12.5 text-right pr-6 font-bold">
                  {t("products_management.table.headers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className="border-b border-border transition-colors hover:bg-muted/50"
                  variants={tableRowVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.03 }}
                >
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
                      formatRupiah(product.cost_price ?? 0)
                    ) : (
                      <span className="tracking-widest text-muted-foreground/50 select-none">
                        •••••••
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="font-medium font-mono text-sm truncate">
                    {formatRupiah(product.price)}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end">
                      <ProductActionMenu
                        product={product}
                        onViewDetails={() => handleViewDetail(product)}
                        onEditProduct={() => handleEditProductOpen(product)}
                        onUpdateStock={() => handleUpdateStockOpen(product)}
                        onDeleteProduct={() => handleDeleteProductOpen(product)}
                        onRestoreProduct={() =>
                          handleRestoreProductOpen(product)
                        }
                        isTrashView={isTrashView ?? false}
                      />
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* Modals & Forms Dipertahankan Ukuran/Style Aslinya */}
      <UpdateStockForm
        key={selectedProduct ? selectedProduct.id : "reset"}
        open={isUpdateStockOpen}
        onOpenChange={setIsUpdateStockOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsUpdateStockOpen(false);
          if (onSuccess) onSuccess();
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
          if (onSuccess) onSuccess();
        }}
      />

      <RestoreProductForm
        open={isRestoreProductOpen}
        onOpenChange={setIsRestoreProductOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsRestoreProductOpen(false);
          if (onSuccess) onSuccess();
        }}
      />
    </>
  );
}
