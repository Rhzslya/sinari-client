import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { PaginationComponent } from "@/features/fragments/Pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Brand, ServiceStatus } from "@/enum/product-enum";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NumberStepper } from "@/components/utils/numberStepper";
import DashboardServiceTable from "@/features/fragments/DashboardServiceTable";
import { CreateServiceForm } from "@/features/components/CreateServiceForm";
import { handleApiError } from "@/lib/utils";
import { useServiceQueries } from "@/hooks/repair-queries";
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
const DashboardServicePage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrashMode = searchParams.get("is_deleted") === "true";

  // --- QUERY PARAMS ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const searchParam = searchParams.get("search") || "";
  const brandParam = searchParams.get("brand") as Brand | undefined;
  const statusParam = searchParams.get("status") as ServiceStatus | undefined;
  const isDeletedApplied = searchParams.get("is_deleted") === "true";
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- STATES (Desktop) ---
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempBrand, setTempBrand] = useState<string | undefined>(brandParam);
  const [tempStatus, setTempStatus] = useState<string | undefined>(statusParam);
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);

  // --- STATES (Mobile & Form Add) ---
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isControlSheetOpen, setIsControlSheetOpen] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(searchParam);
  const [mobileBrand, setMobileBrand] = useState<string | undefined>(
    brandParam,
  );
  const [mobileStatus, setMobileStatus] = useState<string | undefined>(
    statusParam,
  );
  const [mobileMinPrice, setMobileMinPrice] = useState(minPriceParam);
  const [mobileMaxPrice, setMobileMaxPrice] = useState(maxPriceParam);
  const [mobileSort, setMobileSort] = useState(
    `${sortByParam}-${sortOrderParam}`,
  );
  const [mobileTrash, setMobileTrash] = useState(isDeletedApplied);

  // --- TANSTACK QUERY HOOK ---
  const serviceQueries = useServiceQueries();

  const { data, isLoading, isError, error, refetch } = serviceQueries.useList({
    page,
    size,
    customer_name: searchParam || undefined,
    brand: brandParam,
    status: statusParam,
    min_price: minPriceParam ? Number(minPriceParam) : undefined,
    max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
    sort_by: sortByParam as "total_price" | "created_at" | "updated_at",
    sort_order: sortOrderParam as "asc" | "desc",
    is_deleted: isDeletedApplied,
  });

  const services = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;

  useEffect(() => {
    if (isError) {
      handleApiError(error, t("services_management.error_load"));
    }
  }, [isError, error, t]);

  // Sync Desktop States
  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempBrand(brandParam);
      setTempStatus(statusParam);
      setTempMinPrice(minPriceParam);
      setTempMaxPrice(maxPriceParam);
    }
  }, [isFilterOpen, brandParam, statusParam, minPriceParam, maxPriceParam]);

  // Sync Mobile States
  useEffect(() => {
    if (isControlSheetOpen) {
      setMobileSearch(searchParam);
      setMobileBrand(brandParam);
      setMobileStatus(statusParam);
      setMobileMinPrice(minPriceParam);
      setMobileMaxPrice(maxPriceParam);
      setMobileSort(`${sortByParam}-${sortOrderParam}`);
      setMobileTrash(isDeletedApplied);
    }
  }, [
    isControlSheetOpen,
    searchParam,
    brandParam,
    statusParam,
    minPriceParam,
    maxPriceParam,
    sortByParam,
    sortOrderParam,
    isDeletedApplied,
  ]);

  // --- HANDLERS (Desktop) ---
  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) prev.set("search", searchTerm);
      else prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    if (searchParam) {
      setSearchParams((prev) => {
        prev.delete("search");
        prev.set("page", "1");
        return prev;
      });
    }
  };

  const applyFilters = () => {
    setSearchParams((prev) => {
      if (tempBrand && tempBrand !== "ALL") prev.set("brand", tempBrand);
      else prev.delete("brand");

      if (tempStatus && tempStatus !== "ALL") prev.set("status", tempStatus);
      else prev.delete("status");

      if (tempMinPrice) prev.set("min_price", tempMinPrice);
      else prev.delete("min_price");

      if (tempMaxPrice) prev.set("max_price", tempMaxPrice);
      else prev.delete("max_price");

      prev.set("page", "1");
      return prev;
    });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("brand");
      prev.delete("status");
      prev.delete("min_price");
      prev.delete("max_price");
      prev.set("page", "1");
      return prev;
    });
    setTempBrand(undefined);
    setTempStatus(undefined);
    setTempMinPrice("");
    setTempMaxPrice("");
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
      if (mobileSearch) prev.set("search", mobileSearch);
      else prev.delete("search");

      if (mobileBrand && mobileBrand !== "ALL") prev.set("brand", mobileBrand);
      else prev.delete("brand");

      if (mobileStatus && mobileStatus !== "ALL")
        prev.set("status", mobileStatus);
      else prev.delete("status");

      if (mobileMinPrice) prev.set("min_price", mobileMinPrice);
      else prev.delete("min_price");

      if (mobileMaxPrice) prev.set("max_price", mobileMaxPrice);
      else prev.delete("max_price");

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
      prev.delete("search");
      prev.delete("brand");
      prev.delete("status");
      prev.delete("min_price");
      prev.delete("max_price");
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
    statusParam,
    minPriceParam,
    maxPriceParam,
  ].filter(Boolean).length;

  const isFiltering = activeFiltersCount > 0;
  const isSearching = !!searchParam;
  const isDatabaseEmpty = services.length === 0 && !isFiltering && !isSearching;

  const isSortActive = (by: string, order: string) => {
    return sortByParam === by && sortOrderParam === order;
  };

  const normalize = (val: string | undefined | null) => {
    if (!val || val === "ALL") return "";
    return val;
  };

  const hasChanges =
    normalize(tempBrand) !== normalize(brandParam) ||
    normalize(tempStatus) !== normalize(statusParam) ||
    normalize(tempMinPrice) !== normalize(minPriceParam) ||
    normalize(tempMaxPrice) !== normalize(maxPriceParam);

  // Indikator Badge Mobile
  const activeMobileFiltersCount = [
    searchParam,
    brandParam,
    statusParam,
    minPriceParam,
    maxPriceParam,
    isDeletedApplied,
    sortByParam !== "created_at" || sortOrderParam !== "desc",
  ].filter(Boolean).length;

  if (isError && !data) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">
          {t("services_management.error_load")}
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error)
            ? error.message
            : t("services_management.unknown_error")}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("services_management.btn_try_again")}
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
        <DashboardHeader title={t("services_management.title")}>
          {/* ========================================================= */}
          {/* DESKTOP CONTROLS (Hidden on Mobile)                       */}
          {/* ========================================================= */}
          <div className="hidden md:flex items-center gap-3 w-full justify-end">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("services_management.search_placeholder")}
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
                  disabled={services.length === 0}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span className="text-sm">
                    {t("services_management.btn_sort")}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-xs font-semibold text-muted-foreground">
                  {t("services_management.sort.label")}
                </div>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "desc")}
                  className="cursor-pointer"
                >
                  {t("services_management.sort.newest")}{" "}
                  {isSortActive("created_at", "desc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "asc")}
                  className="cursor-pointer"
                >
                  {t("services_management.sort.oldest")}{" "}
                  {isSortActive("created_at", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleSortChange("total_price", "asc")}
                  className="cursor-pointer"
                >
                  {t("services_management.sort.price_asc")}{" "}
                  {isSortActive("total_price", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("total_price", "desc")}
                  className="cursor-pointer"
                >
                  {t("services_management.sort.price_desc")}{" "}
                  {isSortActive("total_price", "desc") && (
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
                    {t("services_management.btn_filter")}
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
                      {t("services_management.filter.title")}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t("services_management.filter.desc")}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <Label htmlFor="brand" className="text-xs">
                      {t("services_management.filter.brand_label")}
                    </Label>
                    <div className="col-span-2">
                      <Select
                        value={tempBrand || "ALL"}
                        onValueChange={setTempBrand}
                      >
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                          <SelectValue
                            placeholder={t(
                              "services_management.filter.brand_placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">
                            {t("services_management.filter.brand_all")}
                          </SelectItem>
                          {Object.values(Brand).map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Label htmlFor="status" className="text-xs">
                      {t("services_management.filter.status_label")}
                    </Label>
                    <div className="col-span-2">
                      <Select
                        value={tempStatus || "ALL"}
                        onValueChange={setTempStatus}
                      >
                        <SelectTrigger className="h-9 text-sm cursor-pointer">
                          <SelectValue
                            placeholder={t(
                              "services_management.filter.status_placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">
                            {t("services_management.filter.status_all")}
                          </SelectItem>
                          {Object.values(ServiceStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Label htmlFor="price" className="self-start mt-2 text-xs">
                      {t("services_management.filter.price_label")}
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
                        placeholder={t("services_management.filter.price_min")}
                      />
                      <NumberStepper
                        value={tempMaxPrice ? Number(tempMaxPrice) : undefined}
                        onChange={(val) =>
                          setTempMaxPrice(val !== undefined ? String(val) : "")
                        }
                        step={10000}
                        min={0}
                        prefix="Rp"
                        placeholder={t("services_management.filter.price_max")}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t mt-1">
                    <Button
                      size="sm"
                      onClick={applyFilters}
                      className="flex-1 text-xs h-9 text-foreground cursor-pointer duration-300"
                      disabled={!hasChanges}
                    >
                      {t("services_management.filter.btn_apply")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex-1 text-xs h-9 text-destructive hover:text-destructive cursor-pointer duration-300"
                      disabled={activeFiltersCount === 0}
                    >
                      {t("services_management.filter.btn_clear")}
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
                      {t("services_management.btn_add")}
                    </span>
                  </Button>
                </SheetTrigger>

                <SheetContent className="flex flex-col h-full p-0 gap-0 sm:max-w-xl">
                  <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle
                      tabIndex={-1}
                      className="text-xl text-primary outline-none"
                    >
                      {t("services_management.sheet.add_title")}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      {t("services_management.sheet.add_desc")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-x-hidden p-1">
                    <CreateServiceForm
                      onSuccess={handleCreateSuccess}
                      onCancel={() => setIsAddSheetOpen(false)}
                    />
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
                  ? t("services_management.btn_exit")
                  : t("services_management.btn_trash")}
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
                      {t("services_management.btn_add")}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full p-0 gap-0 overflow-y-auto sm:max-w-xl">
                  <SheetHeader className="px-5 sm:px-6 py-4 sm:py-5 border-b">
                    <SheetTitle className="text-lg sm:text-xl text-primary outline-none">
                      {t("services_management.sheet.add_title")}
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      {t("services_management.sheet.add_desc")}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-1 overflow-x-hidden p-1">
                    <CreateServiceForm
                      onSuccess={handleCreateSuccess}
                      onCancel={() => setIsAddSheetOpen(false)}
                    />
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
                          "services_management.search_placeholder",
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
                      {t("services_management.btn_sort")}
                    </Label>
                    <Select value={mobileSort} onValueChange={setMobileSort}>
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t("services_management.btn_sort")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="created_at-desc"
                          className="text-xs sm:text-sm"
                        >
                          {t("services_management.sort.newest")}
                        </SelectItem>
                        <SelectItem
                          value="created_at-asc"
                          className="text-xs sm:text-sm"
                        >
                          {t("services_management.sort.oldest")}
                        </SelectItem>
                        <SelectItem
                          value="total_price-asc"
                          className="text-xs sm:text-sm"
                        >
                          {t("services_management.sort.price_asc")}
                        </SelectItem>
                        <SelectItem
                          value="total_price-desc"
                          className="text-xs sm:text-sm"
                        >
                          {t("services_management.sort.price_desc")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* MOBILE FILTER BRAND */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("services_management.filter.brand_label")}
                    </Label>
                    <Select
                      value={mobileBrand || "ALL"}
                      onValueChange={setMobileBrand}
                    >
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t(
                            "services_management.filter.brand_placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-xs sm:text-sm">
                          {t("services_management.filter.brand_all")}
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

                  {/* MOBILE FILTER STATUS */}
                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("services_management.filter.status_label")}
                    </Label>
                    <Select
                      value={mobileStatus || "ALL"}
                      onValueChange={setMobileStatus}
                    >
                      <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                        <SelectValue
                          placeholder={t(
                            "services_management.filter.status_placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-xs sm:text-sm">
                          {t("services_management.filter.status_all")}
                        </SelectItem>
                        {Object.values(ServiceStatus).map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="text-xs sm:text-sm"
                          >
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("services_management.filter.price_label")}
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
                        placeholder={t("services_management.filter.price_min")}
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
                        placeholder={t("services_management.filter.price_max")}
                        className="h-9 text-xs sm:text-sm bg-muted/20"
                      />
                    </div>
                  </div>

                  {/* MOBILE TRASH TOGGLE */}
                  <div className="space-y-2.5 pt-2 border-t border-border/50">
                    <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {t("users_management.filter.preferences", {
                        defaultValue: "Preferences",
                      })}
                    </Label>
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
                          {t("services_management.btn_trash", {
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

                <SheetFooter className="p-4 sm:p-6 border-t border-border/50 bg-background mt-auto grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-9 text-xs sm:text-sm cursor-pointer duration-300"
                    onClick={clearMobileSettings}
                  >
                    {t("services_management.filter.btn_clear", {
                      defaultValue: "Clear",
                    })}
                  </Button>
                  <Button
                    className="w-full h-9 text-xs sm:text-sm text-foreground cursor-pointer duration-300"
                    onClick={applyMobileSettings}
                  >
                    {t("services_management.filter.btn_apply", {
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
        <DashboardServiceTable
          services={services}
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

export default DashboardServicePage;
