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
  Trash2,
  Menu,
} from "lucide-react";
import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { CreateProductForm } from "@/features/components/CreateProductForm";
import { PaginationComponent } from "@/features/fragments/Pagination";
import { useEffect, useState } from "react";
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
import { useProductQueries } from "@/hooks/product-queries";
import { isAxiosError } from "axios";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const DashboardProductPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrashMode = searchParams.get("is_deleted") === "true";

  // --- QUERY PARAMS ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const searchParam = searchParams.get("name") || "";
  const brandParam = searchParams.get("brand") as Brand | undefined;
  const categoryParam = searchParams.get("category") as Category | undefined;
  const isDeletedApplied = searchParams.get("is_deleted") === "true";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const inStockOnlyParam = searchParams.get("in_stock_only") === "true";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- STATES (Desktop) ---
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempBrand, setTempBrand] = useState<string | undefined>(brandParam);
  const [tempCategory, setTempCategory] = useState<string | undefined>(
    categoryParam,
  );
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);
  const [tempInStock, setTempInStock] = useState(inStockOnlyParam);

  // --- STATES (Mobile & Form Add) ---
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isControlSheetOpen, setIsControlSheetOpen] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(searchParam);
  const [mobileBrand, setMobileBrand] = useState<string | undefined>(
    brandParam,
  );
  const [mobileCategory, setMobileCategory] = useState<string | undefined>(
    categoryParam,
  );
  const [mobileMinPrice, setMobileMinPrice] = useState(minPriceParam);
  const [mobileMaxPrice, setMobileMaxPrice] = useState(maxPriceParam);
  const [mobileInStock, setMobileInStock] = useState(inStockOnlyParam);
  const [mobileSort, setMobileSort] = useState(
    `${sortByParam}-${sortOrderParam}`,
  );
  const [mobileTrash, setMobileTrash] = useState(isDeletedApplied);

  const productQueries = useProductQueries();

  const { data, isLoading, isError, error, refetch } = productQueries.useList({
    page: page,
    size: size,
    name: searchParam || undefined,
    brand: brandParam,
    category: categoryParam,
    min_price: minPriceParam ? Number(minPriceParam) : undefined,
    max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
    in_stock_only: inStockOnlyParam ? true : undefined,
    sort_by: sortByParam as "price" | "stock" | "created_at",
    sort_order: sortOrderParam as "asc" | "desc",
    is_deleted: isDeletedApplied,
  });

  const products = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;
  const isSearching = !!searchParam;

  useEffect(() => {
    if (isError) {
      handleApiError(error, t("products_management.error_load"));
    }
  }, [isError, error, t]);

  // Sync Desktop States
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

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

  // Sync Mobile States
  useEffect(() => {
    if (isControlSheetOpen) {
      setMobileSearch(searchParam);
      setMobileBrand(brandParam);
      setMobileCategory(categoryParam);
      setMobileMinPrice(minPriceParam);
      setMobileMaxPrice(maxPriceParam);
      setMobileInStock(inStockOnlyParam);
      setMobileSort(`${sortByParam}-${sortOrderParam}`);
      setMobileTrash(isDeletedApplied);
    }
  }, [
    isControlSheetOpen,
    searchParam,
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
    sortByParam,
    sortOrderParam,
    isDeletedApplied,
  ]);

  // --- HANDLERS (Desktop) ---
  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) prev.set("name", searchTerm);
      else prev.delete("name");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchParam) {
      setSearchParams((prev) => {
        prev.delete("name");
        prev.set("page", "1");
        return prev;
      });
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

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
      return prev;
    });
  };

  const toggleTrashMode = () => {
    setSearchParams((prev) => {
      if (isTrashMode) prev.delete("is_deleted");
      else prev.set("is_deleted", "true");

      prev.set("page", "1");
      return prev;
    });
    setSearchTerm("");
    setMobileTrash(!isTrashMode);
  };

  const handleCreateSuccess = () => {
    setIsAddSheetOpen(false);
    if (page === 1) {
      refetch();
    } else {
      setSearchParams((prev) => {
        prev.set("page", "1");
        return prev;
      });
    }
  };

  // --- HANDLERS (Mobile) ---
  const applyMobileSettings = () => {
    setSearchParams((prev) => {
      if (mobileSearch) prev.set("name", mobileSearch);
      else prev.delete("name");

      if (mobileBrand && mobileBrand !== "ALL") prev.set("brand", mobileBrand);
      else prev.delete("brand");

      if (mobileCategory && mobileCategory !== "ALL")
        prev.set("category", mobileCategory);
      else prev.delete("category");

      if (mobileMinPrice) prev.set("min_price", mobileMinPrice);
      else prev.delete("min_price");

      if (mobileMaxPrice) prev.set("max_price", mobileMaxPrice);
      else prev.delete("max_price");

      if (mobileInStock) prev.set("in_stock_only", "true");
      else prev.delete("in_stock_only");

      if (mobileTrash) prev.set("is_deleted", "true");
      else prev.delete("is_deleted");

      const [sortBy, sortOrder] = mobileSort.split("-");
      if (sortBy && sortOrder) {
        prev.set("sort_by", sortBy);
        prev.set("sort_order", sortOrder);
      }

      prev.set("page", "1");
      return prev;
    });
    setIsControlSheetOpen(false);
  };

  const clearMobileSettings = () => {
    setSearchParams((prev) => {
      prev.delete("name");
      prev.delete("brand");
      prev.delete("category");
      prev.delete("min_price");
      prev.delete("max_price");
      prev.delete("in_stock_only");
      prev.delete("is_deleted");
      prev.set("sort_by", "created_at");
      prev.set("sort_order", "desc");
      prev.set("page", "1");
      return prev;
    });
    setIsControlSheetOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  // --- HELPERS ---
  const activeFiltersCount = [
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
  ].filter(Boolean).length;
  const isFiltering = activeFiltersCount > 0;
  const isDatabaseEmpty = products.length === 0 && !isFiltering && !isSearching;

  const isSortActive = (by: string, order: string) =>
    sortByParam === by && sortOrderParam === order;

  const normalize = (val: string | undefined | null | boolean) => {
    if (!val || val === "ALL") return "";
    return String(val);
  };

  const hasChanges =
    normalize(tempBrand) !== normalize(brandParam) ||
    normalize(tempCategory) !== normalize(categoryParam) ||
    normalize(tempMinPrice) !== normalize(minPriceParam) ||
    normalize(tempMaxPrice) !== normalize(maxPriceParam) ||
    tempInStock !== inStockOnlyParam;

  // Indikator Badge Mobile
  const activeMobileFiltersCount = [
    searchParam,
    brandParam,
    categoryParam,
    minPriceParam,
    maxPriceParam,
    inStockOnlyParam,
    isDeletedApplied,
    sortByParam !== "created_at" || sortOrderParam !== "desc",
  ].filter(Boolean).length;

  if (isError && !data) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const match = (error.response?.data?.errors || "").match(
        /(\d+)(?:s| seconds)/,
      );
      return (
        <RateLimitFallback
          seconds={match ? parseInt(match[1]) : 60}
          onRetry={() => refetch()}
        />
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 px-4 text-center">
        <p className="text-destructive font-medium text-lg">
          {t("products_management.error_load")}
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error)
            ? error.message
            : t("products_management.unknown_error")}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("products_management.btn_try_again")}
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col h-full space-y-4 sm:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <DashboardHeader title={t("products_management.title")}>
          {/* ========================================================= */}
          {/* DESKTOP CONTROLS (Hidden on Mobile)                       */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-3 w-full justify-end">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("products_management.search_placeholder")}
                className="pl-8 pr-8 bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2 h-9 [&::-webkit-search-cancel-button]:appearance-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onBlur={handleSearch}
                disabled={isLoading || isDatabaseEmpty}
              />
              {searchTerm && (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleClearSearch();
                  }}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
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
                  className="h-9 gap-1.5 cursor-pointer shadow-sm"
                  disabled={products.length === 0}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span className="text-sm">
                    {t("products_management.btn_sort")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-xs font-semibold text-muted-foreground">
                  {t("products_management.sort.label")}
                </div>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "desc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.newest")}{" "}
                  {isSortActive("created_at", "desc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "asc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.oldest")}{" "}
                  {isSortActive("created_at", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSortChange("price", "asc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.price_asc")}{" "}
                  {isSortActive("price", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("price", "desc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.price_desc")}{" "}
                  {isSortActive("price", "desc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSortChange("stock", "asc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.stock_asc")}{" "}
                  {isSortActive("stock", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("stock", "desc")}
                  className="cursor-pointer"
                >
                  {t("products_management.sort.stock_desc")}{" "}
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
                  className="h-9 gap-1.5 cursor-pointer shadow-sm"
                  disabled={isDatabaseEmpty}
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span className="text-sm">
                    {t("products_management.btn_filter")}
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-0.5 rounded-sm bg-primary px-1.5 py-0.5 font-bold text-primary-foreground text-[10px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-sm">
                      {t("products_management.filter.title")}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t("products_management.filter.desc")}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="brand" className="text-xs">
                      {t("products_management.filter.brand_label")}
                    </Label>
                    <div className="col-span-2">
                      <Select
                        value={tempBrand || "ALL"}
                        onValueChange={setTempBrand}
                      >
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                          <SelectValue
                            placeholder={t(
                              "products_management.filter.brand_placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">
                            {t("products_management.filter.brand_all")}
                          </SelectItem>
                          {Object.values(Brand).map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Label htmlFor="category" className="text-xs">
                      {t("products_management.filter.category_label")}
                    </Label>
                    <div className="col-span-2">
                      <Select
                        value={tempCategory || "ALL"}
                        onValueChange={setTempCategory}
                      >
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                          <SelectValue
                            placeholder={t(
                              "products_management.filter.category_placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">
                            {t("products_management.filter.category_all")}
                          </SelectItem>
                          {Object.values(Category).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Label htmlFor="price" className="self-start mt-2 text-xs">
                      {t("products_management.filter.price_label")}
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
                        placeholder={t("products_management.filter.price_min")}
                      />
                      <NumberStepper
                        value={tempMaxPrice ? Number(tempMaxPrice) : undefined}
                        onChange={(val) =>
                          setTempMaxPrice(val !== undefined ? String(val) : "")
                        }
                        step={10000}
                        min={0}
                        prefix="Rp"
                        placeholder={t("products_management.filter.price_max")}
                      />
                    </div>
                  </div>

                  <div className="border-t my-2" />

                  <div className="flex items-center space-x-3 border p-3 rounded-lg bg-muted/30">
                    <Checkbox
                      id="in_stock"
                      checked={tempInStock}
                      onCheckedChange={(checked) =>
                        setTempInStock(checked as boolean)
                      }
                      className="mt-0.5 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-foreground cursor-pointer"
                    />
                    <div className="grid gap-1">
                      <Label
                        htmlFor="in_stock"
                        className="text-sm font-medium cursor-pointer"
                      >
                        {t("products_management.filter.in_stock")}
                      </Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t mt-1">
                    <Button
                      size="sm"
                      onClick={applyFilters}
                      className="flex-1 text-xs h-9 text-foreground cursor-pointer duration-300"
                      disabled={!hasChanges}
                    >
                      {t("products_management.filter.btn_apply")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex-1 text-xs h-9 text-destructive hover:text-destructive cursor-pointer duration-300"
                      disabled={activeFiltersCount === 0}
                    >
                      {t("products_management.filter.btn_clear")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {!isTrashMode && (
              <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-1.5 cursor-pointer shadow-sm text-foreground duration-300"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="text-sm">
                      {t("products_management.btn_add")}
                    </span>
                  </Button>
                </SheetTrigger>

                <SheetContent className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0">
                  <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle className="text-xl text-primary">
                      {t("products_management.sheet.add_title")}
                    </SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="sr-only">
                    {t("products_management.sheet.add_desc")}
                  </SheetDescription>

                  <div className="flex-1 overflow-hidden">
                    <CreateProductForm onSuccess={handleCreateSuccess} />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            <Button
              variant={isTrashMode ? "destructive" : "outline"}
              size="sm"
              className="h-9 gap-1.5 w-24 shrink-0 cursor-pointer shadow-sm transition-colors"
              onClick={toggleTrashMode}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="text-sm">
                {isTrashMode
                  ? t("products_management.btn_exit")
                  : t("products_management.btn_trash")}
              </span>
            </Button>
          </div>

          {/* ========================================================= */}
          {/* MOBILE CONTROLS (HAMBURGER SHEET)                         */}
          {/* ========================================================= */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            {/* ADD BUTTON MOBILE */}
            {!isTrashMode && (
              <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full shadow-sm cursor-pointer text-foreground duration-300"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span className="sr-only">
                      {t("products_management.btn_add")}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[95vw] sm:max-w-xl flex flex-col h-full p-0 gap-0 overflow-y-auto">
                  <SheetHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b">
                    <SheetTitle className="text-lg sm:text-xl text-primary outline-none">
                      {t("products_management.sheet.add_title")}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      {t("products_management.sheet.add_desc")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-x-hidden p-1">
                    <CreateProductForm onSuccess={handleCreateSuccess} />
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* CONTROLS HAMBURGER MOBILE */}
            <Sheet
              open={isControlSheetOpen}
              onOpenChange={setIsControlSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2 shadow-sm cursor-pointer relative pr-3"
                  disabled={isDatabaseEmpty && !isFiltering}
                >
                  <Menu className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {t("users_management.btn_filter", {
                      defaultValue: "Settings",
                    })}
                  </span>

                  {activeMobileFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold leading-none pt-px text-primary-foreground shadow-sm">
                      {activeMobileFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[85vw] sm:max-w-md flex flex-col p-0"
              >
                <SheetHeader className="p-4 sm:p-6 border-b border-border/50 text-left">
                  <SheetTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                    {t("users_management.controls_title", {
                      defaultValue: "Filters & Options",
                    })}
                  </SheetTitle>
                </SheetHeader>

                <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
                  {/* MOBILE SEARCH */}
                  <div className="space-y-2.5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder={t(
                          "products_management.search_placeholder",
                        )}
                        className="pl-8 pr-8 bg-muted/20 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-1 h-9 text-xs sm:text-sm [&::-webkit-search-cancel-button]:appearance-none"
                        value={mobileSearch}
                        onChange={(e) => setMobileSearch(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && applyMobileSettings()
                        }
                      />
                      {mobileSearch && (
                        <button
                          onClick={() => setMobileSearch("")}
                          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-destructive cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MOBILE SORT */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("products_management.btn_sort")}
                    </Label>
                    <Select value={mobileSort} onValueChange={setMobileSort}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t("products_management.btn_sort")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="created_at-desc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.newest")}
                        </SelectItem>
                        <SelectItem
                          value="created_at-asc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.oldest")}
                        </SelectItem>
                        <SelectItem
                          value="price-asc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.price_asc")}
                        </SelectItem>
                        <SelectItem
                          value="price-desc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.price_desc")}
                        </SelectItem>
                        <SelectItem
                          value="stock-asc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.stock_asc")}
                        </SelectItem>
                        <SelectItem
                          value="stock-desc"
                          className="text-xs sm:text-sm"
                        >
                          {t("products_management.sort.stock_desc")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* MOBILE FILTER BRAND */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("products_management.filter.brand_label")}
                    </Label>
                    <Select
                      value={mobileBrand || "ALL"}
                      onValueChange={setMobileBrand}
                    >
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t(
                            "products_management.filter.brand_placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-xs sm:text-sm">
                          {t("products_management.filter.brand_all")}
                        </SelectItem>
                        {Object.values(Brand).map((brand) => (
                          <SelectItem
                            key={brand}
                            value={brand}
                            className="text-xs sm:text-sm"
                          >
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* MOBILE FILTER CATEGORY */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("products_management.filter.category_label")}
                    </Label>
                    <Select
                      value={mobileCategory || "ALL"}
                      onValueChange={setMobileCategory}
                    >
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t(
                            "products_management.filter.category_placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-xs sm:text-sm">
                          {t("products_management.filter.category_all")}
                        </SelectItem>
                        {Object.values(Category).map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="text-xs sm:text-sm"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* MOBILE FILTER PRICE RANGE */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("products_management.filter.price_label")}
                    </Label>
                    <div className="flex flex-col gap-2.5">
                      <NumberStepper
                        value={
                          mobileMinPrice ? Number(mobileMinPrice) : undefined
                        }
                        onChange={(val) =>
                          setMobileMinPrice(
                            val !== undefined ? String(val) : "",
                          )
                        }
                        step={10000}
                        min={0}
                        prefix="Rp"
                        placeholder={t("products_management.filter.price_min")}
                        className="h-9 text-xs sm:text-sm bg-muted/20"
                      />
                      <NumberStepper
                        value={
                          mobileMaxPrice ? Number(mobileMaxPrice) : undefined
                        }
                        onChange={(val) =>
                          setMobileMaxPrice(
                            val !== undefined ? String(val) : "",
                          )
                        }
                        step={10000}
                        min={0}
                        prefix="Rp"
                        placeholder={t("products_management.filter.price_max")}
                        className="h-9 text-xs sm:text-sm bg-muted/20"
                      />
                    </div>
                  </div>

                  {/* MOBILE TOGGLES (In-Stock & Trash) */}
                  <div className="space-y-2.5 pt-2 border-t border-border/50">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("users_management.filter.preferences", {
                        defaultValue: "Preferences",
                      })}
                    </Label>
                    <div className="flex flex-col gap-2.5">
                      {/* In-Stock Checkbox */}
                      <div className="flex items-start space-x-3 border p-3.5 rounded-lg bg-muted/20">
                        <Checkbox
                          id="mobile-in-stock"
                          checked={mobileInStock}
                          onCheckedChange={(checked) =>
                            setMobileInStock(checked === true)
                          }
                          className="size-4 sm:size-5 mt-0.5 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-foreground"
                        />
                        <div className="grid gap-1">
                          <Label
                            htmlFor="mobile-in-stock"
                            className="text-xs sm:text-sm font-medium leading-none cursor-pointer"
                          >
                            {t("products_management.filter.in_stock")}
                          </Label>
                          <p className="text-[10px] text-muted-foreground leading-tight">
                            Only show products available in inventory
                          </p>
                        </div>
                      </div>

                      {/* Trash Checkbox */}
                      <div className="flex items-start space-x-3 border p-3.5 rounded-lg border-destructive/20 bg-destructive/5">
                        <Checkbox
                          id="mobile-trash"
                          checked={mobileTrash}
                          onCheckedChange={(checked) =>
                            setMobileTrash(checked === true)
                          }
                          className="size-4 sm:size-5 mt-0.5 border-destructive/50 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=checked]:text-white"
                        />
                        <div className="grid gap-1">
                          <Label
                            htmlFor="mobile-trash"
                            className="text-xs sm:text-sm font-medium leading-none text-destructive cursor-pointer"
                          >
                            {t("products_management.btn_trash", {
                              defaultValue: "Trash Mode",
                            })}
                          </Label>
                          <p className="text-[10px] text-destructive/70 leading-tight">
                            {t("users_management.filter.trash_desc", {
                              defaultValue: "Show deleted/removed records",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SheetFooter className="p-4 sm:p-6 border-t border-border/50 bg-background mt-auto grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs sm:text-sm cursor-pointer duration-300"
                    onClick={clearMobileSettings}
                  >
                    {t("products_management.filter.btn_clear", {
                      defaultValue: "Clear",
                    })}
                  </Button>
                  <Button
                    className="w-full h-9 text-xs sm:text-sm text-foreground cursor-pointer duration-300"
                    onClick={applyMobileSettings}
                  >
                    {t("products_management.filter.btn_apply", {
                      defaultValue: "Apply",
                    })}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </DashboardHeader>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex-1 overflow-auto rounded-lg border shadow-sm"
      >
        <DashboardProductTable
          products={products}
          isLoading={isLoading}
          onSuccess={() => refetch()}
          isTrashView={isDeletedApplied}
        />
      </motion.div>

      {totalPage > 1 && (
        <motion.div variants={itemVariants}>
          <PaginationComponent
            currentPage={page}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardProductPage;
