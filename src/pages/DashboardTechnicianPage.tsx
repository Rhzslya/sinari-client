import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CreateTechnicianForm } from "@/features/components/CreateTechnicianForm";
import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import DashboardTechnicianTable from "@/features/fragments/DashboardTechnicianTable";
import { PaginationComponent } from "@/features/fragments/Pagination";
import { useTechnicianQueries } from "@/hooks/technician-queries";
import { handleApiError } from "@/lib/utils";
import {
  ArrowUpDown,
  Check,
  Filter,
  PlusCircle,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DashboardTechnicianPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrashMode = searchParams.get("is_deleted") === "true";

  // --- QUERY PARAMS ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const nameParam = searchParams.get("name") || "";
  const isActiveParam =
    searchParams.get("is_active") === "true"
      ? true
      : searchParams.get("is_active") === "false"
        ? false
        : undefined;
  const isDeletedApplied = searchParams.get("is_deleted") === "true";

  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState(nameParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempActive, setTempActive] = useState<string | undefined>(
    isActiveParam === true
      ? "true"
      : isActiveParam === false
        ? "false"
        : undefined,
  );

  const technicianQueries = useTechnicianQueries();
  const { data, isLoading, isError, error, refetch } =
    technicianQueries.useList({
      page: page,
      size: size,
      name: nameParam || undefined,
      is_active: isActiveParam,
      sort_by: sortByParam as "created_at" | "is_active",
      sort_order: sortOrderParam as "asc" | "desc",
      is_deleted: isDeletedApplied,
    });

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

  useEffect(() => {
    setSearchTerm(nameParam);
  }, [nameParam]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempActive(
        isActiveParam === true
          ? "true"
          : isActiveParam === false
            ? "false"
            : "ALL",
      );
    }
  }, [isFilterOpen, isActiveParam]);

  useEffect(() => {
    if (isError) {
      handleApiError(error, "Failed to load technicians");
    }
  }, [isError, error]);

  const technicians = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;
  const isDatabaseEmpty =
    technicians.length === 0 && !nameParam && isActiveParam === undefined;

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  const applyFilters = () => {
    setSearchParams((prev) => {
      if (tempActive && tempActive !== "ALL") {
        prev.set("is_active", tempActive);
      } else {
        prev.delete("is_active");
      }
      prev.set("page", "1");
      return prev;
    });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("is_active");
      prev.set("page", "1");
      return prev;
    });
    setTempActive("ALL");
    setIsFilterOpen(false);
  };

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

  const handleSortChange = (
    sortBy: "created_at" | "is_active",
    sortOrder: "asc" | "desc",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
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
      refetch();
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

  // --- HELPERS ---
  const activeFiltersCount = [isActiveParam !== undefined].filter(
    Boolean,
  ).length;

  const isSortActive = (by: string, order: string) => {
    return sortByParam === by && sortOrderParam === order;
  };

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Technicians Management">
        {/* SEARCH BAR */}
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search technician..."
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

        {/* SORT MENU */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1"
              disabled={technicians.length === 0}
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
              onClick={() => handleSortChange("is_active", "desc")}
            >
              Active First
              {isSortActive("is_active", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortChange("is_active", "asc")}
            >
              Inactive First
              {isSortActive("is_active", "asc") && (
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
                  Refine the technician list.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <Label htmlFor="status">Status</Label>
                <div className="col-span-2">
                  <Select
                    value={tempActive || "ALL"}
                    onValueChange={setTempActive}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t mt-2">
                <Button
                  size="sm"
                  onClick={applyFilters}
                  className="w-1/2 text-foreground text-sm bg-success hover:bg-success/80 cursor-pointer"
                  disabled={
                    tempActive ===
                    (isActiveParam === undefined
                      ? "ALL"
                      : String(isActiveParam))
                  }
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
                  Add Technician
                </span>
              </Button>
            </SheetTrigger>

            <SheetContent className="w-100 sm:max-w-xl flex flex-col h-full p-0 gap-0">
              <SheetHeader className="px-6 py-4 border-b">
                <SheetTitle className="text-xl text-primary">
                  Add New Technician
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="sr-only">
                Form to add a new technician
              </SheetDescription>

              <div className="flex-1 overflow-hidden">
                <CreateTechnicianForm onSuccess={handleCreateSuccess} />
              </div>
            </SheetContent>
          </Sheet>
        )}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1 w-24 shrink-0"
          onClick={toggleTrashMode}
        >
          {isTrashMode ? (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Exit</span>
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Trash</span>
            </>
          )}
        </Button>
      </DashboardHeader>

      <div className="flex-1 overflow-auto">
        <DashboardTechnicianTable
          technicians={technicians}
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

export default DashboardTechnicianPage;
