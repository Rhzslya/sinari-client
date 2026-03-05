import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useProductQueries } from "@/hooks/product-queries";
import { format } from "date-fns";
import {
  ArrowLeft,
  Barcode,
  Box,
  CalendarClock,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  Factory,
  Layers,
  Package,
  PackagePlus,
  QrCode,
  ScanBarcode,
  Tag,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import type { ProductResponse } from "@/model/product-model";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EditProductForm } from "@/features/components/EditProductForm";
import UpdateStockForm from "@/features/fragments/UpdateStockForm";
import DeleteProductForm from "@/features/fragments/DeleteProductForm";
import { ProductLogTimeline } from "@/features/fragments/ProductLogTimeline";
import { useUserQueries } from "@/hooks/user-queries";
import { useTranslation } from "react-i18next";

const DetailProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useDetail } = useProductQueries();

  const id = Number(productId);
  const { data: product, isLoading, isError, refetch } = useDetail({ id });

  const userQueries = useUserQueries();

  const { data: currentUser } = userQueries.useProfile();
  const isOwner = currentUser?.role === "OWNER";

  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  //Edit Product States
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);

  //Update Stock States
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);

  //Delete Product States
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);

  const [showCost, setShowCost] = useState(false);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd MMM yyyy, HH:mm");
  };

  const handleEditProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  const handleUpdateStockOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsUpdateStockOpen(true);
  };

  const handleDeleteProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsDeleteProductOpen(true);
  };

  if (isLoading)
    return <div className="p-4">{t("products_management.detail.loading")}</div>;
  if (isError || !product)
    return (
      <NotFoundPage
        isDashboard={true}
        id={productId}
        entityName={t("products_management.detail.not_found_entity")}
        backUrl="/dashboard/products"
        variant="minimal"
      />
    );

  const profit = product.price - product.cost_price;
  const marginPercentage =
    product.price > 0 ? (profit / product.price) * 100 : 0;

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  let stockColor = "bg-emerald-500";
  if (isOutOfStock) stockColor = "bg-destructive";
  else if (isLowStock) stockColor = "bg-amber-500";

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard/products")}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {t("products_management.detail.header_title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("products_management.detail.header_subtitle")} {product.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-6 h-full">
              <Card className="flex flex-col overflow-hidden shrink-0">
                <CardHeader className="bg-muted/10 pb-8 border-b">
                  <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
                    <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-lg border-2 border-background shadow-sm bg-white flex items-center justify-center overflow-hidden p-2">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className="w-12 h-12 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px]">
                          {product.category}
                        </Badge>
                        {isOutOfStock && (
                          <Badge variant="destructive" className="text-[10px]">
                            {t("products_management.detail.out_of_stock_badge")}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl font-bold leading-tight">
                        <TruncatedTooltip text={product.name} />
                      </CardTitle>

                      <CardDescription className="flex items-center gap-2 text-base overflow-hidden">
                        <span className="font-semibold text-foreground shrink-0">
                          {product.brand}
                        </span>

                        <span className="shrink-0 text-muted-foreground">
                          •
                        </span>

                        <span
                          className="truncate max-w-37.5 sm:max-w-50"
                          title={product.manufacturer}
                        >
                          {product.manufacturer}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" />{" "}
                        {t(
                          "products_management.detail.price_card.selling_price",
                        )}
                      </label>
                      <div className="text-3xl font-bold font-mono text-primary">
                        {formatRupiah(product.price)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-xs uppercase text-muted-foreground font-semibold flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5" />{" "}
                          {t(
                            "products_management.detail.price_card.cost_price",
                          )}
                        </label>
                        <button
                          onClick={() => setShowCost(!showCost)}
                          className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          {showCost ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-2xl font-medium font-mono">
                        {showCost
                          ? formatRupiah(product.cost_price)
                          : t(
                              "products_management.detail.price_card.hidden_cost",
                            )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full text-emerald-600">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                            {t(
                              "products_management.detail.price_card.profit_unit",
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "products_management.detail.price_card.estimated",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-lg text-emerald-800 dark:text-emerald-300">
                        {showCost
                          ? `+${formatRupiah(profit)}`
                          : t(
                              "products_management.detail.price_card.hidden_profit",
                            )}
                      </div>
                    </div>

                    <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">
                            {t("products_management.detail.price_card.margin")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t(
                              "products_management.detail.price_card.percentage",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="font-mono font-bold text-lg text-blue-800 dark:text-blue-300">
                        {showCost
                          ? `${marginPercentage.toFixed(1)}%`
                          : t(
                              "products_management.detail.price_card.hidden_margin",
                            )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <ScanBarcode className="w-4 h-4" />{" "}
                      {t("products_management.detail.specs.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">
                        {t("products_management.detail.specs.category")}
                      </span>
                      <span className="text-sm font-medium">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">
                        {t("products_management.detail.specs.brand")}
                      </span>
                      <span className="text-sm font-medium">
                        {product.brand}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4 py-1">
                      <span className="text-sm text-muted-foreground shrink-0">
                        {t("products_management.detail.specs.manufacturer")}
                      </span>
                      <span
                        className="text-sm font-medium truncate max-w-37.5 sm:max-w-50 text-right"
                        title={product.manufacturer}
                      >
                        {product.manufacturer}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <QrCode className="w-4 h-4" />{" "}
                      {t("products_management.detail.identification.title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-3 pt-4">
                    <div className="w-full h-12 bg-foreground/10 rounded flex items-center justify-center overflow-hidden relative">
                      <Barcode className="w-32 h-full text-foreground opacity-80" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {t("products_management.detail.identification.sku")}
                      </p>
                      <p className="font-mono font-bold text-lg tracking-widest bg-muted px-3 py-1 rounded border">
                        PRD-{product.id.toString().padStart(6, "0")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6 h-full flex flex-col">
              <Card className="bg-muted/40 h-fit border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("products_management.detail.quick_actions.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start duration-300 cursor-pointer"
                    onClick={() => handleEditProductOpen(product)}
                  >
                    <Edit className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                    {t("products_management.detail.quick_actions.edit_product")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start duration-300 cursor-pointer"
                    onClick={() => handleUpdateStockOpen(product)}
                  >
                    <PackagePlus className="mr-2 h-4 w-4 text-blue-600" />{" "}
                    {t("products_management.detail.quick_actions.update_stock")}
                  </Button>
                  {isOwner && (
                    <>
                      <Separator className="my-1" />
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-red-700 hover:bg-red-50 duration-300 cursor-pointer"
                        onClick={() => handleDeleteProductOpen(product)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />{" "}
                        {t(
                          "products_management.detail.quick_actions.delete_product",
                        )}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Box className="w-4 h-4" />{" "}
                    {t("products_management.detail.inventory_status.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center py-4 bg-muted/20 rounded-lg border border-dashed">
                    <div className="text-5xl font-bold tracking-tighter text-foreground">
                      {product.stock}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
                      {t(
                        "products_management.detail.inventory_status.available_units",
                      )}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground uppercase">
                      <span>
                        {t(
                          "products_management.detail.inventory_status.critical",
                        )}
                      </span>
                      <span>
                        {t(
                          "products_management.detail.inventory_status.healthy",
                        )}
                      </span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-secondary">
                      <div
                        className={`h-full ${stockColor} transition-all duration-700 ease-out`}
                        style={{
                          width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-right text-muted-foreground">
                      {t("products_management.detail.inventory_status.target")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex gap-2 items-center">
                    <CalendarClock className="w-4 h-4" />{" "}
                    {t("products_management.detail.metadata.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm h-full flex flex-col justify-center">
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-muted-foreground flex items-center gap-2 text-xs shrink-0">
                      <Factory className="w-3.5 h-3.5" />{" "}
                      {t("products_management.detail.metadata.manufacturer")}
                    </span>
                    <span
                      className="font-medium truncate max-w-37.5 text-right"
                      title={product.manufacturer}
                    >
                      {product.manufacturer}
                    </span>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("products_management.detail.metadata.created")}
                      </span>
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {t("products_management.detail.metadata.updated")}
                      </span>
                      <span>{formatDate(product.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {isOwner && <ProductLogTimeline productId={product.id} />}
      </div>

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
                  refetch();
                }}
                onCancel={() => setIsEditProductOpen(false)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      <UpdateStockForm
        key={selectedProduct ? selectedProduct.id : "reset"}
        open={isUpdateStockOpen}
        onOpenChange={setIsUpdateStockOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsUpdateStockOpen(false);
        }}
      />

      <DeleteProductForm
        open={isDeleteProductOpen}
        onOpenChange={setIsDeleteProductOpen}
        product={selectedProduct}
        onSuccess={() => {
          setIsDeleteProductOpen(false);
          navigate("/dashboard/products");
        }}
      />
    </>
  );
};

export default DetailProductPage;
