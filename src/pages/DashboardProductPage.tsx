// pages/DashboardProductPage.tsx
import { DashboardProductTable } from "@/features/fragments/DashboardProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Check,
  X,
} from "lucide-react";
import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateProductForm } from "@/features/components/CreateProductForm";
import { PaginationComponent } from "@/features/fragments/Pagination";
import { useCallback, useEffect, useState } from "react";
import type { ProductResponse } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import { useSearchParams } from "react-router-dom";
import { Brand, Category } from "@/enum/product-enum";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NumberStepper } from "@/components/utils/numberStepper";
import { handleApiError } from "@/lib/utils";

const DashboardProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const nameParam = searchParams.get("name") || "";
  const brandParam = searchParams.get("brand") as Brand | undefined;
  const categoryParam = searchParams.get("category") as Category | undefined;
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const inStockOnlyParam = searchParams.get("in_stock_only") === "true";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  const [tempBrand, setTempBrand] = useState<string | undefined>(brandParam);
  const [tempCategory, setTempCategory] = useState<string | undefined>(
    categoryParam,
  );
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);
  const [tempInStock, setTempInStock] = useState(inStockOnlyParam);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [totalPage, setTotalPage] = useState(0);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(nameParam);

  const isSearching = !!nameParam;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await ProductServices.search({
        page: page,
        size: size,
        name: nameParam || undefined,
        brand: brandParam,
        category: categoryParam,
        min_price: minPriceParam ? Number(minPriceParam) : undefined,
        max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
        in_stock_only: inStockOnlyParam ? true : undefined,

        sort_by: sortByParam as "price" | "stock" | "created_at",
        sort_order: sortOrderParam as "asc" | "desc",
      });
      if (response.data) {
        setProducts(response.data);
      }

      if (response.paging) {
        setTotalPage(response.paging.total_page);
      }
    } catch (error) {
      handleApiError(error, "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    size,
    nameParam,
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
    sortByParam,
    sortOrderParam,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSearchTerm(nameParam);
  }, [nameParam]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempBrand(brandParam);
      setTempCategory(categoryParam);
      setTempMinPrice(minPriceParam);
      setTempMaxPrice(maxPriceParam);
      setTempInStock(inStockOnlyParam);
    }
  }, [
    isFilterOpen,
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
  ]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
    setSearchParams((prev) => {
      prev.set("page", "1");
      return prev;
    });
    if (page === 1) {
      fetchProducts();
    }
  };

  const applyFilters = () => {
    setSearchParams((prev) => {
      if (tempBrand && tempBrand !== "ALL") prev.set("brand", tempBrand);
      else prev.delete("brand");

      if (tempCategory && tempCategory !== "ALL")
        prev.set("category", tempCategory);
      else prev.delete("category");

      if (tempMinPrice) prev.set("min_price", tempMinPrice);
      else prev.delete("min_price");

      if (tempMaxPrice) prev.set("max_price", tempMaxPrice);
      else prev.delete("max_price");

      if (tempInStock) prev.set("in_stock_only", "true");
      else prev.delete("in_stock_only");

      prev.set("page", "1");

      return prev;
    });

    setIsFilterOpen(false);
  };

  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) {
        prev.set("name", searchTerm);
      } else {
        prev.delete("name");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSortChange = (
    sortBy: "price" | "stock" | "created_at",
    sortOrder: "asc" | "desc",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
      return prev;
    });
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("brand");
      prev.delete("category");
      prev.delete("min_price");
      prev.delete("max_price");
      prev.delete("in_stock_only");
      prev.set("page", "1");
      return prev;
    });
    setTempBrand(undefined);
    setTempCategory(undefined);
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempInStock(false);

    setIsFilterOpen(false);
  };

  const activeFiltersCount = [
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
  ].filter(Boolean).length;
  const isFiltering = activeFiltersCount > 0;
  const isDatabaseEmpty = products.length === 0 && !isFiltering && !isSearching;

  const isSortActive = (by: string, order: string) => {
    return sortByParam === by && sortOrderParam === order;
  };

  const normalize = (val: string | undefined | null) => {
    if (!val || val === "ALL") return "";
    return val;
  };

  const hasChanges =
    normalize(tempBrand) !== normalize(brandParam) ||
    normalize(tempCategory) !== normalize(categoryParam) ||
    normalize(tempMinPrice) !== normalize(minPriceParam) ||
    normalize(tempMaxPrice) !== normalize(maxPriceParam) ||
    tempInStock !== inStockOnlyParam;

  const handleClearSearch = () => {
    setSearchTerm("");
    if (nameParam) {
      setSearchParams((prev) => {
        prev.delete("name");
        prev.set("page", "1");
        return prev;
      });
    }
  };
  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Products Management">
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8 pr-8 bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2 [&::-webkit-search-cancel-button]:appearance-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={handleSearch}
            disabled={isLoading || isDatabaseEmpty}
          />

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              onMouseDown={(e) => e.preventDefault()}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              disabled={products.length === 0}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Sort
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="p-2 text-xs font-semibold text-muted-foreground">
              Sort By
            </div>
            <DropdownMenuItem
              onClick={() => handleSortChange("created_at", "desc")}
            >
              Newest Added
              {isSortActive("created_at", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleSortChange("created_at", "asc")}
            >
              Oldest Added
              {isSortActive("created_at", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => handleSortChange("price", "asc")}>
              Price: Low - High
              {isSortActive("price", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSortChange("price", "desc")}>
              Price: High - Low
              {isSortActive("price", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => handleSortChange("stock", "asc")}>
              Stock: Low - High
              {isSortActive("stock", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => handleSortChange("stock", "desc")}>
              Stock: High - Low
              {isSortActive("stock", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              disabled={isDatabaseEmpty}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="ml-1 rounded-sm bg-success px-1 font-normal text-foreground text-xs">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filters</h4>
                <p className="text-sm text-muted-foreground">
                  Refine the product list.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <Label htmlFor="brand">Brand</Label>
                <div className="col-span-2">
                  <Select
                    value={tempBrand || "ALL"}
                    onValueChange={setTempBrand}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Brands</SelectItem>
                      {Object.values(Brand).map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Label htmlFor="category">Category</Label>
                <div className="col-span-2">
                  <Select
                    value={tempCategory || "ALL"}
                    onValueChange={setTempCategory}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Category</SelectItem>
                      {Object.values(Category).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Label htmlFor="price" className="self-start mt-2">
                  Price
                </Label>
                <div className="col-span-2 grid gap-2">
                  <NumberStepper
                    value={tempMinPrice ? Number(tempMinPrice) : undefined}
                    onChange={(val) =>
                      setTempMinPrice(val !== undefined ? String(val) : "")
                    }
                    step={10000}
                    min={0}
                    prefix="Rp"
                    placeholder="Min"
                  />

                  <NumberStepper
                    value={tempMaxPrice ? Number(tempMaxPrice) : undefined}
                    onChange={(val) =>
                      setTempMaxPrice(val !== undefined ? String(val) : "")
                    }
                    step={10000}
                    min={0}
                    prefix="Rp"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="border-t my-2" />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in_stock"
                  checked={tempInStock}
                  onCheckedChange={(checked) =>
                    setTempInStock(checked as boolean)
                  }
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-foreground"
                />
                <Label
                  htmlFor="in_stock"
                  className="text-sm font-medium leading-none"
                >
                  In Stock Only
                </Label>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={applyFilters}
                  className="w-1/2 text-foreground text-sm bg-success hover:bg-success/80 cursor-pointer"
                  disabled={!hasChanges}
                >
                  Apply Filters
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-1/2 text-sm text-destructive hover:text-destructive cursor-pointer"
                  disabled={activeFiltersCount === 0}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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

          <SheetContent className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle className="text-xl text-primary">
                Add New Product
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="sr-only">
              Form to add a new product
            </SheetDescription>

            <div className="flex-1 overflow-hidden">
              <CreateProductForm onSuccess={handleCreateSuccess} />
            </div>
          </SheetContent>
        </Sheet>
      </DashboardHeader>

      <div className="flex-1 overflow-auto">
        <DashboardProductTable
          products={products}
          isLoading={isLoading}
          onSuccess={fetchProducts}
        />
      </div>
      <PaginationComponent
        currentPage={page}
        totalPages={totalPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DashboardProductPage;
