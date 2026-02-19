import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import DashboardUserTable from "@/features/fragments/DashboardUserTable";
import { PaginationComponent } from "@/features/fragments/Pagination";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useUserQueries } from "@/hooks/user-queries";
import { handleApiError } from "@/lib/utils";
import { isAxiosError } from "axios";
import { ArrowUpDown, Check, Filter, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DashboardUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrashMode = searchParams.get("is_deleted") === "true";

  // --- QUERY PARAMS ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const nameParam = searchParams.get("name") || "";
  const isOnlineParam = searchParams.get("is_online") === "true";
  const isDeletedApplied = searchParams.get("is_deleted") === "true";
  const roleParam = searchParams.get("role") || "";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- STATES ---
  const [searchTerm, setSearchTerm] = useState(nameParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempOnline, setTempOnline] = useState(isOnlineParam);
  const [tempRole, setTempRole] = useState(roleParam);

  const { useList, useProfile } = useUserQueries();

  const { data: currentUser } = useProfile();

  const isCurrentUserOwner = currentUser?.role === "OWNER";

  const { data, isLoading, isError, error, refetch } = useList({
    page,
    size,
    name: nameParam || undefined,
    sort_by: sortByParam as "created_at" | "name",
    sort_order: sortOrderParam as "asc" | "desc",
    is_online: isOnlineParam ? true : undefined,
    role: roleParam && roleParam !== "ALL" ? roleParam : undefined,
    is_deleted: isDeletedApplied,
  });

  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) prev.set("name", searchTerm);
      else prev.delete("name");
      prev.set("page", "1");
      return prev;
    });
  };

  useEffect(() => {
    setSearchTerm(nameParam);
  }, [nameParam]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempOnline(isOnlineParam);
      setTempRole(roleParam);
    }
  }, [isFilterOpen, isOnlineParam, roleParam]);

  useEffect(() => {
    if (isError) {
      handleApiError(error, "Failed to load users");
    }
  }, [isError, error]);

  const users = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;
  const isDatabaseEmpty =
    users.length === 0 && !nameParam && !isOnlineParam && !roleParam;

  useEffect(() => {
    setSearchTerm(nameParam);
  }, [nameParam]);

  useEffect(() => {
    if (isFilterOpen) {
      setTempOnline(isOnlineParam);
      setTempRole(roleParam);
    }
  }, [isFilterOpen, isOnlineParam, roleParam]);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  const applyFilters = () => {
    setSearchParams((prev) => {
      if (tempOnline) {
        prev.set("is_online", "true");
      } else {
        prev.delete("is_online");
      }

      if (tempRole && tempRole !== "ALL") {
        prev.set("role", tempRole);
      } else {
        prev.delete("role");
      }

      prev.set("page", "1");
      return prev;
    });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("is_online");
      prev.delete("role");
      prev.set("page", "1");
      return prev;
    });
    setTempOnline(false);
    setTempRole("ALL");
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
    sortBy: "created_at" | "name",
    sortOrder: "asc" | "desc",
  ) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
      return prev;
    });
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
  const activeFiltersCount = [
    isOnlineParam,
    roleParam && roleParam !== "ALL",
  ].filter(Boolean).length;

  const isSortActive = (by: string, order: string) => {
    return sortByParam === by && sortOrderParam === order;
  };

  if (isError && !data) {
    if (isAxiosError(error) && error.response?.status === 429) {
      const message = error.response?.data?.errors || "";
      const match = message.match(/(\d+)(?:s| seconds)/);
      const seconds = match ? parseInt(match[1]) : 60;

      return <RateLimitFallback seconds={seconds} onRetry={() => refetch()} />;
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <p className="text-destructive font-medium">Failed to load users.</p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error) ? error.message : "Unknown error occurred"}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <DashboardHeader title="Users Management">
        {/* SEARCH BAR */}
        <div className="relative w-48 md:w-64 hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
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
              disabled={users.length === 0}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Sort
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="p-2 text-xs font-semibold text-muted-foreground">
              Date
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
            <div className="p-2 text-xs font-semibold text-muted-foreground">
              Name
            </div>
            <DropdownMenuItem onClick={() => handleSortChange("name", "asc")}>
              Name (A-Z)
              {isSortActive("name", "asc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSortChange("name", "desc")}>
              Name (Z-A)
              {isSortActive("name", "desc") && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* FILTER MENU (UPDATED) */}
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
                  Refine the user list.
                </p>
              </div>

              {/* FILTER ROLE */}
              <div className="space-y-2">
                <Label htmlFor="role-filter">User Role</Label>
                <Select value={tempRole} onValueChange={setTempRole}>
                  <SelectTrigger id="role-filter" className="h-9">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Roles</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="OWNER">Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* FILTER ONLINE */}
              <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                <Checkbox
                  id="online-mode"
                  checked={tempOnline}
                  onCheckedChange={(checked) => setTempOnline(checked === true)}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="online-mode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show Online Users Only
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    Only show users currently active in session.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t mt-2">
                <Button
                  size="sm"
                  onClick={applyFilters}
                  className="w-1/2 text-foreground text-sm bg-success hover:bg-success/80 cursor-pointer"
                  // Disable jika tidak ada perubahan
                  disabled={
                    tempOnline === isOnlineParam && tempRole === roleParam
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
        <DashboardUserTable
          users={users}
          currentUser={currentUser}
          isLoading={isLoading}
          onSuccess={() => refetch()}
          currentUserId={currentUser?.id}
          isCurrentUserOwner={isCurrentUserOwner}
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

export default DashboardUserPage;
