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
import { PaginationComponent } from "@/features/fragments/Pagination";
import { useCallback, useEffect, useState } from "react";
import type { ServiceResponse } from "@/model/repair-model";
import { RepairServices } from "@/services/repair-services";
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

const DashboardServicePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState<ServiceResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;

  const searchParam = searchParams.get("search") || "";

  const brandParam = searchParams.get("brand") as Brand | undefined;
  const statusParam = searchParams.get("status") as ServiceStatus | undefined;
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";

  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  const [tempBrand, setTempBrand] = useState<string | undefined>(brandParam);
  const [tempStatus, setTempStatus] = useState<string | undefined>(statusParam);
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(searchParam);

  const isSearching = !!searchParam;

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await RepairServices.search({
        page: page,
        size: size,
        customer_name: searchParam || undefined,
        brand: brandParam,
        status: statusParam,
        min_price: minPriceParam ? Number(minPriceParam) : undefined,
        max_price: maxPriceParam ? Number(maxPriceParam) : undefined,
        sort_by: sortByParam as "total_price" | "created_at" | "updated_at",
        sort_order: sortOrderParam as "asc" | "desc",
      });

      if (response.data) {
        setServices(response.data);
      }

      if (response.paging) {
        setTotalPage(response.paging.total_page);
      }
    } catch (error) {
      handleApiError(error, "Failed to load services");
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    size,
    searchParam,
    brandParam,
    statusParam,
    minPriceParam,
    maxPriceParam,
    sortByParam,
    sortOrderParam,
  ]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
      fetchServices();
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

  const activeFiltersCount = [
    brandParam,
    statusParam,
    minPriceParam,
    maxPriceParam,
  ].filter(Boolean).length;

  const isFiltering = activeFiltersCount > 0;
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

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Services Management">
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customer..."
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
              disabled={services.length === 0}
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
            <DropdownMenuItem
              onClick={() => handleSortChange("total_price", "asc")}
            >
              Price: Low - High
              {isSortActive("total_price", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("total_price", "desc")}
            >
              Price: High - Low
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
                  Refine the service list.
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
                <Label htmlFor="status">Status</Label>
                <div className="col-span-2">
                  <Select
                    value={tempStatus || "ALL"}
                    onValueChange={setTempStatus}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      {Object.values(ServiceStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Label htmlFor="price" className="self-start mt-2">
                  Total Price
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

              <div className="flex gap-2 pt-2 border-t mt-2">
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
                Add Service
              </span>
            </Button>
          </SheetTrigger>

          <SheetContent className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0">
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle
                tabIndex={-1}
                className="text-xl text-primary outline-none"
              >
                Add New Service
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="sr-only">
              Form to create a new service
            </SheetDescription>

            <div className="flex-1 overflow-hidden">
              <CreateServiceForm onSuccess={handleCreateSuccess} />
            </div>
          </SheetContent>
        </Sheet>
      </DashboardHeader>

      <div className="flex-1 overflow-auto">
        <DashboardServiceTable
          services={services}
          isLoading={isLoading}
          onSuccess={fetchServices}
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
