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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatRupiah } from "@/components/utils/formatRupiah";
import type { ProductResponse } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { MoreHorizontalIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { SkeletonTable } from "./Skeleton";

export function DashboardProductTable() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const [paging, setPaging] = useState({
    page: 1,
    size: 10,
    total_page: 0,
  });

  const fetchProducts = useCallback(async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    setIsLoading(true);
    try {
      const response = await ProductServices.search({
        page: paging.page,
        size: paging.size,
      });

      if (response.data) {
        setProducts(response.data);
      }

      if (response.paging) {
        setPaging((prev) => ({
          ...prev,
          current_page: response.paging!.current_page,
          total_page: response.paging!.total_page,
        }));
      }
    } catch (error) {
      console.error("Failed to load products", error);
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [paging.page, paging.size]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (isLoading) {
    return <SkeletonTable />;
  }
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
              <TableHead className="w-37.5 font-bold">Cost</TableHead>
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
                    <Tooltip delayDuration={300}>
                      <TooltipTrigger asChild>
                        <span className="font-medium text-md truncate max-w-[320px] cursor-default">
                          {product.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-200 wrap-break-word">
                        <p>{product.name}</p>
                      </TooltipContent>
                    </Tooltip>

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
                  {formatRupiah(product.cost_price)}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Update Stock</DropdownMenuItem>
                      <DropdownMenuItem>Edit Product</DropdownMenuItem>
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
    </TooltipProvider>
  );
}
