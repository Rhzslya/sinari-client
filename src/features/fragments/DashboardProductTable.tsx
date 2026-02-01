import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Eye, EyeOff, MoreHorizontalIcon, PlusCircle } from "lucide-react";
import { SkeletonTable } from "./Skeleton";
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
  SheetTrigger,
} from "@/components/ui/sheet";
import { EditProductForm } from "../components/EditProductForm";

export function DashboardProductTable({
  products,
  isLoading,
  onSuccess,
}: DashboardProductTableProps) {
  const navigate = useNavigate();

  const [showCost, setShowCost] = useState(false);

  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const [isEditProductOpen, setIsEditProductOpen] = useState(false);

  const handleUpdateStockOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsUpdateStockOpen(true);
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  if (products.length === 0) {
    return (
      <div className="rounded-md border bg-card p-8 text-center text-muted-foreground">
        No products found.
      </div>
    );
  }

  const handleEditProductOpen = (product: ProductResponse) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="rounded-md border bg-card">
        <Table className="min-w-200">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-14 font-bold border-r border-border/60 text-center">
                ID
              </TableHead>
              <TableHead className="w-87.5 font-bold">Product Name</TableHead>
              <TableHead className="w-37.5 font-bold">Brand</TableHead>
              <TableHead className="w-37.5 font-bold">Category</TableHead>
              <TableHead className="w-25 font-bold">Stock</TableHead>
              <TableHead className="w-37.5 font-bold">
                <div className="flex items-center gap-2">
                  <span>Cost</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCost(!showCost)}
                    title={showCost ? "Hide Cost" : "Show Cost"}
                  >
                    {showCost ? (
                      <Eye className="size-3.5" />
                    ) : (
                      <EyeOff className="size-3.5" />
                    )}
                  </Button>
                </div>
              </TableHead>
              <TableHead className="w-37.5 font-bold">Price</TableHead>
              <TableHead className="w-12.5 text-right font-bold">
                Actions
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(`/dashboard/products/detail/${product.id}`)
                        }
                        className="cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleUpdateStockOpen(product)}
                      >
                        Update Stock
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onSelect={() => handleEditProductOpen(product)}
                      >
                        {" "}
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 cursor-pointer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Product
            </span>
          </Button>
        </SheetTrigger>

        <SheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl text-primary">
              Edit Product
            </SheetTitle>
          </SheetHeader>
          <SheetDescription className="sr-only">
            Form to add a new product
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
    </TooltipProvider>
  );
}
