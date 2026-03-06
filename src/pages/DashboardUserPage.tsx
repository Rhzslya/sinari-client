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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";

import { DashboardHeader } from "@/features/fragments/DashboardHeader";
import DashboardUserTable from "@/features/fragments/DashboardUserTable";
import { PaginationComponent } from "@/features/fragments/Pagination";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useUserQueries } from "@/hooks/user-queries";
import { handleApiError } from "@/lib/utils";
import { isAxiosError } from "axios";
import {
  ArrowUpDown,
  Check,
  Filter,
  Search,
  Trash2,
  X,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

const DashboardUserPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrashMode = searchParams.get("is_deleted") === "true";

  // --- QUERY PARAMS (Aktif) ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const nameParam = searchParams.get("name") || "";
  const isOnlineParam = searchParams.get("is_online") === "true";
  const isDeletedApplied = searchParams.get("is_deleted") === "true";
  const roleParam = searchParams.get("role") || "";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- STATES (Desktop) ---
  const [searchTerm, setSearchTerm] = useState(nameParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempOnline, setTempOnline] = useState(isOnlineParam);
  const [tempRole, setTempRole] = useState(roleParam);

  // --- STATES (Mobile Sheet) ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(nameParam);
  const [mobileOnline, setMobileOnline] = useState(isOnlineParam);
  const [mobileRole, setMobileRole] = useState(roleParam);
  const [mobileSort, setMobileSort] = useState(
    `${sortByParam}-${sortOrderParam}`,
  );
  const [mobileTrash, setMobileTrash] = useState(isDeletedApplied);

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

  // Sync Desktop Search
  useEffect(() => {
    setSearchTerm(nameParam);
  }, [nameParam]);

  // Sync Desktop Filter
  useEffect(() => {
    if (isFilterOpen) {
      setTempOnline(isOnlineParam);
      setTempRole(roleParam);
    }
  }, [isFilterOpen, isOnlineParam, roleParam]);

  // Sync Mobile Sheet
  useEffect(() => {
    if (isSheetOpen) {
      setMobileSearch(nameParam);
      setMobileOnline(isOnlineParam);
      setMobileRole(roleParam);
      setMobileSort(`${sortByParam}-${sortOrderParam}`);
      setMobileTrash(isDeletedApplied);
    }
  }, [
    isSheetOpen,
    nameParam,
    isOnlineParam,
    roleParam,
    sortByParam,
    sortOrderParam,
    isDeletedApplied,
  ]);

  useEffect(() => {
    if (isError) handleApiError(error, t("users_management.error_load"));
  }, [isError, error, t]);

  const users = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;
  const isFiltering =
    !!nameParam || isOnlineParam || !!roleParam || isDeletedApplied;
  const isDatabaseEmpty = users.length === 0 && !isFiltering;

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
    if (nameParam) {
      setSearchParams((prev) => {
        prev.delete("name");
        prev.set("page", "1");
        return prev;
      });
    }
  };

  const applyFilters = () => {
    setSearchParams((prev) => {
      if (tempOnline) prev.set("is_online", "true");
      else prev.delete("is_online");
      if (tempRole && tempRole !== "ALL") prev.set("role", tempRole);
      else prev.delete("role");
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

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setSearchParams((prev) => {
      prev.set("sort_by", sortBy);
      prev.set("sort_order", sortOrder);
      return prev;
    });
  };
  const toggleTrashMode = () => {
    setSearchParams((prev) => {
      if (isTrashMode) {
        prev.delete("is_deleted");
      } else {
        prev.set("is_deleted", "true");
      }
      prev.set("page", "1");
      return prev;
    });
    setSearchTerm("");
    setMobileTrash(!isTrashMode);
  };

  const applyMobileSettings = () => {
    setSearchParams((prev) => {
      if (mobileSearch) prev.set("name", mobileSearch);
      else prev.delete("name");

      if (mobileOnline) prev.set("is_online", "true");
      else prev.delete("is_online");

      if (mobileRole && mobileRole !== "ALL") prev.set("role", mobileRole);
      else prev.delete("role");

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
    setIsSheetOpen(false);
  };

  const clearMobileSettings = () => {
    setSearchParams((prev) => {
      prev.delete("name");
      prev.delete("is_online");
      prev.delete("role");
      prev.delete("is_deleted");
      prev.set("sort_by", "created_at");
      prev.set("sort_order", "desc");
      prev.set("page", "1");
      return prev;
    });
    setIsSheetOpen(false);
  };

  // --- HELPERS ---
  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      return prev;
    });
  };

  const activeFiltersCount = [
    isOnlineParam,
    roleParam && roleParam !== "ALL",
  ].filter(Boolean).length;
  const isSortActive = (by: string, order: string) =>
    sortByParam === by && sortOrderParam === order;

  // Indikator untuk Badge Mobile
  const activeMobileFiltersCount = [
    nameParam,
    isOnlineParam,
    roleParam && roleParam !== "ALL",
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
        <p className="text-destructive font-medium">
          {t("users_management.error_load")}
        </p>
        <p className="text-sm text-muted-foreground">
          {isAxiosError(error)
            ? error.message
            : t("users_management.unknown_error")}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          {t("users_management.btn_try_again")}
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
        <DashboardHeader title={t("users_management.title")}>
          <div className="hidden md:flex items-center gap-3 w-full justify-end">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("users_management.search_placeholder")}
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
                  disabled={users.length === 0}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>{t("users_management.btn_sort")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2 text-xs font-semibold text-muted-foreground">
                  {t("users_management.sort.date_label")}
                </div>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "desc")}
                  className="cursor-pointer"
                >
                  {t("users_management.sort.newest")}{" "}
                  {isSortActive("created_at", "desc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("created_at", "asc")}
                  className="cursor-pointer"
                >
                  {t("users_management.sort.oldest")}{" "}
                  {isSortActive("created_at", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="p-2 text-xs font-semibold text-muted-foreground">
                  {t("users_management.sort.name_label")}
                </div>
                <DropdownMenuItem
                  onClick={() => handleSortChange("name", "asc")}
                  className="cursor-pointer"
                >
                  {t("users_management.sort.name_asc")}{" "}
                  {isSortActive("name", "asc") && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSortChange("name", "desc")}
                  className="cursor-pointer"
                >
                  {t("users_management.sort.name_desc")}{" "}
                  {isSortActive("name", "desc") && (
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
                  <span>{t("users_management.btn_filter")}</span>
                  {activeFiltersCount > 0 && (
                    <span className="ml-0.5 rounded-sm bg-primary px-1.5 py-0.5 font-bold text-foreground text-[10px]">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <h4 className="font-semibold text-sm">
                      {t("users_management.filter.title")}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t("users_management.filter.desc")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">
                      {t("users_management.filter.role_label")}
                    </Label>
                    <Select value={tempRole} onValueChange={setTempRole}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue
                          placeholder={t(
                            "users_management.filter.role_placeholder",
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL" className="text-sm">
                          {t("users_management.filter.roles.all")}
                        </SelectItem>
                        <SelectItem value="ADMIN" className="text-sm">
                          {t("users_management.filter.roles.admin")}
                        </SelectItem>
                        <SelectItem value="CUSTOMER" className="text-sm">
                          {t("users_management.filter.roles.customer")}
                        </SelectItem>
                        <SelectItem value="OWNER" className="text-sm">
                          {t("users_management.filter.roles.owner")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-start space-x-3 border p-3 rounded-lg bg-muted/30">
                    <Checkbox
                      id="online-mode"
                      checked={tempOnline}
                      onCheckedChange={(checked) =>
                        setTempOnline(checked === true)
                      }
                      className="mt-0.5 data-[state=checked]:text-white"
                    />
                    <div className="grid gap-1">
                      <Label
                        htmlFor="online-mode"
                        className="text-sm font-medium cursor-pointer"
                      >
                        {t("users_management.filter.online_label")}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {t("users_management.filter.online_desc")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t mt-1">
                    <Button
                      size="sm"
                      onClick={applyFilters}
                      className="flex-1 text-xs h-9 text-foreground cursor-pointer duration-300"
                    >
                      {t("users_management.filter.btn_apply")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="flex-1 text-xs h-9 text-destructive hover:text-destructive cursor-pointer duration-300"
                    >
                      {t("users_management.filter.btn_clear")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant={isTrashMode ? "destructive" : "outline"}
              size="sm"
              className="h-9 gap-1.5 w-24 shrink-0 cursor-pointer shadow-sm transition-colors"
              onClick={toggleTrashMode}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="text-sm">
                {isTrashMode
                  ? t("users_management.btn_exit")
                  : t("users_management.btn_trash")}
              </span>
            </Button>
          </div>

          <div className="flex md:hidden ml-auto">
            {/* MOBILE CONTROLS (HAMBURGER SHEET)                         */}
            <div className="flex md:hidden ml-auto">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 shadow-sm cursor-pointer relative pr-3"
                    disabled={isDatabaseEmpty}
                  >
                    <Menu className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {t("users_management.btn_filter")}
                    </span>

                    {activeMobileFiltersCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold leading-none pt-px text-foreground shadow-sm">
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
                      {t("users_management.controls_title")}
                    </SheetTitle>
                  </SheetHeader>

                  <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
                    {/* MOBILE SEARCH */}
                    <div className="space-y-2.5">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder={t("users_management.search_placeholder")}
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
                        {t("users_management.btn_sort")}
                      </Label>
                      <Select value={mobileSort} onValueChange={setMobileSort}>
                        <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                          <SelectValue
                            placeholder={t("users_management.btn_sort")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="created_at-desc"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.sort.newest")}
                          </SelectItem>
                          <SelectItem
                            value="created_at-asc"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.sort.oldest")}
                          </SelectItem>
                          <SelectItem
                            value="name-asc"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.sort.name_asc")}
                          </SelectItem>
                          <SelectItem
                            value="name-desc"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.sort.name_desc")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* MOBILE ROLE */}
                    <div className="space-y-2.5">
                      <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {t("users_management.filter.role_label")}
                      </Label>
                      <Select value={mobileRole} onValueChange={setMobileRole}>
                        <SelectTrigger className="h-9 text-xs sm:text-sm bg-muted/20">
                          <SelectValue
                            placeholder={t(
                              "users_management.filter.role_placeholder",
                            )}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value="ALL"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.filter.roles.all")}
                          </SelectItem>
                          <SelectItem
                            value="ADMIN"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.filter.roles.admin")}
                          </SelectItem>
                          <SelectItem
                            value="CUSTOMER"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.filter.roles.customer")}
                          </SelectItem>
                          <SelectItem
                            value="OWNER"
                            className="text-xs sm:text-sm"
                          >
                            {t("users_management.filter.roles.owner")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* MOBILE TOGGLES (Online & Trash) */}
                    <div className="space-y-2.5 pt-1">
                      <Label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {t("users_management.filter.preferences")}
                      </Label>
                      <div className="flex flex-col gap-2.5">
                        {/* Online Checkbox */}
                        <div className="flex items-start space-x-3 border p-3.5 rounded-lg bg-muted/20">
                          <Checkbox
                            id="mobile-online"
                            checked={mobileOnline}
                            onCheckedChange={(checked) =>
                              setMobileOnline(checked === true)
                            }
                            className="size-4 sm:size-5 mt-0.5 data-[state=checked]:text-white"
                          />
                          <div className="grid gap-1">
                            <Label
                              htmlFor="mobile-online"
                              className="text-xs sm:text-sm font-medium leading-none cursor-pointer"
                            >
                              {t("users_management.filter.online_label")}
                            </Label>
                            <p className="text-[10px] text-muted-foreground leading-tight">
                              {t("users_management.filter.online_desc")}
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
                              {t("users_management.btn_trash")}
                            </Label>
                            <p className="text-[10px] text-destructive/70 leading-tight">
                              {t("users_management.filter.trash_desc")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="p-4 sm:p-6 border-t border-border/50 bg-background mt-auto grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs sm:text-sm"
                      onClick={clearMobileSettings}
                    >
                      {t("users_management.filter.btn_clear")}
                    </Button>
                    <Button
                      className="w-full h-9 text-xs sm:text-sm text-foreground"
                      onClick={applyMobileSettings}
                    >
                      {t("users_management.filter.btn_apply")}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </DashboardHeader>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex-1 overflow-auto rounded-lg border shadow-sm"
      >
        <DashboardUserTable
          users={users}
          currentUser={currentUser}
          isLoading={isLoading}
          onSuccess={() => refetch()}
          currentUserId={currentUser?.id}
          isCurrentUserOwner={isCurrentUserOwner}
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

export default DashboardUserPage;
