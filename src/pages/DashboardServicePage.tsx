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

  // --- LOCAL STATES ---
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Temporary filter states
  const [tempBrand, setTempBrand] = useState<string | undefined>(brandParam);
  const [tempStatus, setTempStatus] = useState<string | undefined>(statusParam);
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);

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

  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) {
        prev.set("search", searchTerm);
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  const handleCreateSuccess = () => {
    setIsSheetOpen(false);
    if (page === 1) {
      refetch();
    } else {
      setSearchParams((prev) => {
        prev.set("page", "1");
        return prev;
      });
    }
  };

  const toggleTrashMode = () => {
    const currentSize = searchParams.get("size") || "10";

    if (isTrashMode) {
      setSearchParams({
        page: "1",
        size: currentSize,
        sort_by: "created_at",
        sort_order: "desc",
      });
    } else {
      setSearchParams({
        is_deleted: "true",
        page: "1",
        size: currentSize,
        sort_by: "created_at",
        sort_order: "desc",
      });
    }

    setSearchTerm("");
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

  const handleSortChange = (
    sortBy: "total_price" | "created_at",
    sortOrder: "asc" | "desc",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
      return prev;
    });
  };

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
    <div className="flex flex-col h-full">
      <DashboardHeader title={t("services_management.title")}>
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("services_management.search_placeholder")}
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
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
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
              className="h-9 gap-1 cursor-pointer"
              disabled={services.length === 0}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
              {t("services_management.sort.newest")}
              {isSortActive("created_at", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("created_at", "asc")}
              className="cursor-pointer"
            >
              {t("services_management.sort.oldest")}
              {isSortActive("created_at", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleSortChange("total_price", "asc")}
              className="cursor-pointer"
            >
              {t("services_management.sort.price_asc")}
              {isSortActive("total_price", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("total_price", "desc")}
              className="cursor-pointer"
            >
              {t("services_management.sort.price_desc")}
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
              className="h-9 gap-1 cursor-pointer"
              disabled={isDatabaseEmpty}
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{t("services_management.btn_filter")}</span>
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
                <h4 className="font-medium leading-none">
                  {t("services_management.filter.title")}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t("services_management.filter.desc")}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <Label htmlFor="brand">
                  {t("services_management.filter.brand_label")}
                </Label>
                <div className="col-span-2">
                  <Select
                    value={tempBrand || "ALL"}
                    onValueChange={setTempBrand}
                  >
                    <SelectTrigger className="h-8 w-full cursor-pointer">
                      <SelectValue
                        placeholder={t(
                          "services_management.filter.brand_placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="cursor-pointer">
                        {t("services_management.filter.brand_all")}
                      </SelectItem>
                      {Object.values(Brand).map((brand) => (
                        <SelectItem
                          key={brand}
                          value={brand}
                          className="cursor-pointer"
                        >
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label htmlFor="status">
                  {t("services_management.filter.status_label")}
                </Label>
                <div className="col-span-2">
                  <Select
                    value={tempStatus || "ALL"}
                    onValueChange={setTempStatus}
                  >
                    <SelectTrigger className="h-8 w-full cursor-pointer">
                      <SelectValue
                        placeholder={t(
                          "services_management.filter.status_placeholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="cursor-pointer">
                        {t("services_management.filter.status_all")}
                      </SelectItem>
                      {Object.values(ServiceStatus).map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="cursor-pointer"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label htmlFor="price" className="self-start mt-2">
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

              <div className="flex gap-2 pt-2 border-t mt-2">
                <Button
                  size="sm"
                  onClick={applyFilters}
                  className="w-1/2 text-foreground text-sm bg-success hover:bg-success/80 cursor-pointer"
                  disabled={!hasChanges}
                >
                  {t("services_management.filter.btn_apply")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="w-1/2 text-sm text-destructive hover:text-destructive cursor-pointer"
                  disabled={activeFiltersCount === 0}
                >
                  {t("services_management.filter.btn_clear")}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {!isTrashMode && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t("services_management.btn_add")}
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0">
              <SheetHeader className="px-6 py-4 border-b">
                <SheetTitle
                  tabIndex={-1}
                  className="text-xl text-primary outline-none"
                >
                  {t("services_management.sheet.add_title")}
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="sr-only">
                {t("services_management.sheet.add_desc")}
              </SheetDescription>

              <div className="flex-1 overflow-hidden">
                <CreateServiceForm onSuccess={handleCreateSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 w-24 shrink-0 cursor-pointer"
          onClick={toggleTrashMode}
        >
          {isTrashMode ? (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                {t("services_management.btn_exit")}
              </span>
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                {t("services_management.btn_trash")}
              </span>
            </>
          )}
        </Button>
      </DashboardHeader>

      <div className="flex-1 overflow-auto">
        <DashboardServiceTable
          services={services}
          isLoading={isLoading}
          onSuccess={() => refetch()}
          isTrashView={isDeletedApplied}
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

export default DashboardServicePage;
