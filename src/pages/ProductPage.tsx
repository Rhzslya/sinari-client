import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brand, Category } from "@/enum/enum";
import RateLimitFallback from "@/features/fragments/RateLimitFallback";
import { useProductQueries } from "@/hooks/product-queries";
import { handleApiError } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  Check,
  X,
  PackageSearch,
  SlidersHorizontal,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRupiah } from "@/components/utils/formatRupiah";
import { PaginationComponent } from "@/features/fragments/Pagination";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarFilters } from "@/features/fragments/SidebarFilter";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";
import { CatalogProductSkeleton } from "@/features/fragments/Skeleton";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }, // Animasi muncul bergantian sangat cepat
  },
};

const ProductPage = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  // --- QUERY PARAMS ---
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 12;
  const searchParam = searchParams.get("name") || "";
  const brandParam = searchParams.get("brand") as Brand | undefined;
  const categoryParam = searchParams.get("category") as Category | undefined;
  const minPriceParam = searchParams.get("min_price") || "";
  const maxPriceParam = searchParams.get("max_price") || "";
  const inStockOnlyParam = searchParams.get("in_stock_only") === "true";
  const sortByParam = searchParams.get("sort_by") || "created_at";
  const sortOrderParam = searchParams.get("sort_order") || "desc";

  // --- LOCAL STATES ---
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [tempMinPrice, setTempMinPrice] = useState(minPriceParam);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceParam);

  const productQueries = useProductQueries();

  const { data, isLoading, isError, error, refetch } =
    productQueries.usePublicList({
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
    });

  const products = data?.data || [];
  const totalPage = data?.paging?.total_page || 0;

  useEffect(() => {
    if (isError) handleApiError(error, "Failed to load products");
  }, [isError, error]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  const handleSearch = () => {
    setSearchParams((prev) => {
      if (searchTerm) prev.set("name", searchTerm);
      else prev.delete("name");
      prev.set("page", "1");
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return prev;
    });
  };

  const updateFilter = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      if (value && value !== "ALL") prev.set(key, value);
      else prev.delete(key);
      prev.set("page", "1");
      return prev;
    });
  };

  const applyPriceFilter = () => {
    setSearchParams((prev) => {
      if (tempMinPrice) prev.set("min_price", tempMinPrice);
      else prev.delete("min_price");

      if (tempMaxPrice) prev.set("max_price", tempMaxPrice);
      else prev.delete("max_price");

      prev.set("page", "1");
      return prev;
    });
  };

  const clearAllFilters = () => {
    setSearchParams((prev) => {
      prev.delete("brand");
      prev.delete("category");
      prev.delete("min_price");
      prev.delete("max_price");
      prev.delete("in_stock_only");
      prev.delete("name");
      prev.set("page", "1");
      return prev;
    });
    setSearchTerm("");
    setTempMinPrice("");
    setTempMaxPrice("");
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

  const isSearching = !!searchParam;
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

  const sidebarProps = {
    searchTerm,
    setSearchTerm,
    handleSearch,
    categoryParam,
    brandParam,
    inStockOnlyParam,
    tempMinPrice,
    setTempMinPrice,
    tempMaxPrice,
    setTempMaxPrice,
    updateFilter,
    applyPriceFilter,
    isLoading,
    isDatabaseEmpty,
  };

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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 px-4 text-center">
        <p className="text-destructive font-medium text-lg">
          Failed to load products.
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-350">
      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-border/40 min-h-[80vh] pr-6">
          <div className="sticky top-24">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />{" "}
              {t("catalog.filters.title")}
            </h2>
            <SidebarFilters {...sidebarProps} />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("catalog.title")}
              </h1>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-1/2">
              {/* FILTER BUTTON (Mobile) */}
              <div className="flex items-center justify-end gap-2 w-full sm:w-auto ml-auto">
                <div className="md:hidden flex-1">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-10"
                        disabled={isDatabaseEmpty}
                      >
                        <SlidersHorizontal className="h-4 w-4" />{" "}
                        {t("catalog.filters.title")}
                        {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[85vw] sm:w-87.5 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-primary transition-colors"
                    >
                      <SheetTitle className="sr-only">Filters</SheetTitle>
                      <div className="py-6 mt-4 mx-2">
                        <h2 className="text-lg font-bold mb-6">
                          {t("catalog.filters.title")}
                        </h2>
                        <SidebarFilters {...sidebarProps} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* SORT DROPDOWN */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex-1 sm:flex-none gap-2 px-3 bg-muted/30 h-10"
                    disabled={products.length === 0}
                  >
                    {t("catalog.sort.title")}{" "}
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("created_at", "desc")}
                  >
                    {t("catalog.sort.newest")}{" "}
                    {isSortActive("created_at", "desc") && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("created_at", "asc")}
                  >
                    {t("catalog.sort.oldest")}{" "}
                    {isSortActive("created_at", "asc") && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleSortChange("price", "asc")}
                  >
                    {t("catalog.sort.price_asc")}{" "}
                    {isSortActive("price", "asc") && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("price", "desc")}
                  >
                    {t("catalog.sort.price_desc")}{" "}
                    {isSortActive("price", "desc") && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>

          {/* ACTIVE FILTERS BADGES */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap items-center gap-2 mb-6"
            >
              <span className="text-xs text-muted-foreground mr-1">
                {t("catalog.filters.active")}
              </span>

              {searchParam && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 font-normal text-[10px] sm:text-xs bg-muted/50 gap-1 rounded-md flex items-center"
                >
                  {t("catalog.filters.search")} {searchParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateFilter("name", null);
                      setSearchTerm("");
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              )}

              {categoryParam && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 font-normal text-[10px] sm:text-xs bg-muted/50 gap-1 rounded-md flex items-center"
                >
                  {t("catalog.filters.category")} {categoryParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateFilter("category", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              )}
              {brandParam && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 font-normal text-[10px] sm:text-xs bg-muted/50 gap-1 rounded-md flex items-center"
                >
                  {t("catalog.filters.brand")} {brandParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateFilter("brand", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              )}
              {inStockOnlyParam && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 font-normal text-[10px] sm:text-xs bg-muted/50 gap-1 rounded-md flex items-center"
                >
                  {t("catalog.filters.in_stock")}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      updateFilter("in_stock_only", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              )}
              {(minPriceParam || maxPriceParam) && (
                <Badge
                  variant="secondary"
                  className="px-2 py-1 font-normal text-[10px] sm:text-xs bg-muted/50 gap-1 rounded-md flex items-center"
                >
                  {t("catalog.filters.price")}{" "}
                  {minPriceParam ? formatRupiah(Number(minPriceParam)) : "Rp 0"}{" "}
                  - {maxPriceParam ? formatRupiah(Number(maxPriceParam)) : "~"}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setTempMinPrice("");
                      setTempMaxPrice("");
                      setSearchParams((prev) => {
                        prev.delete("min_price");
                        prev.delete("max_price");
                        prev.set("page", "1");
                        return prev;
                      });
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </Badge>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                }}
                className="text-xs text-muted-foreground hover:text-foreground ml-1 sm:ml-2 underline underline-offset-2"
              >
                {t("catalog.filters.clear_all")}
              </button>
            </motion.div>
          )}

          {isLoading ? (
            <CatalogProductSkeleton count={size} />
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 sm:h-[50vh] rounded-2xl border border-dashed border-border bg-muted/10 px-4"
            >
              <PackageSearch className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/40 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-center">
                {t("catalog.empty.title")}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm text-center">
                {t("catalog.empty.desc")}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8 sm:space-y-10">
              <motion.div
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    className="h-full"
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="group relative flex flex-col h-full rounded-xl sm:rounded-2xl bg-muted/20 border border-border/40 p-2.5 sm:p-4 transition-all duration-300 hover:bg-muted/40 hover:border-border hover:shadow-md cursor-pointer"
                    >
                      <div className="relative aspect-square bg-slate-50 flex items-center justify-center rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 transition-colors group-hover:bg-slate-100 border border-slate-100">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-3 sm:p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Package className="h-10 w-10 sm:h-16 sm:w-16 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
                        )}

                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="bg-destructive text-destructive-foreground text-[8px] sm:text-[10px] font-bold px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-sm tracking-wider sm:tracking-widest">
                              {t("catalog.product.out_of_stock")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 mt-auto pt-1 sm:pt-2">
                        <TruncatedTooltip
                          text={product.name}
                          className="font-semibold text-xs sm:text-sm md:text-base text-foreground line-clamp-2 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300"
                        />

                        {product.manufacturer ? (
                          <div className="mb-2 sm:mb-3 w-full">
                            <span
                              className="inline-block max-w-full truncate text-[8px] sm:text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                              title={product.manufacturer}
                            >
                              {product.manufacturer}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-2 sm:mb-3 w-full h-4 sm:h-5"></div>
                        )}

                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          <div className="flex flex-col border-l-2 border-primary/50 pl-1.5 sm:pl-2">
                            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                              {t("catalog.product.brand")}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold truncate text-foreground">
                              {product.brand}
                            </span>
                          </div>
                          <div className="flex flex-col border-l-2 border-muted pl-1.5 sm:pl-2">
                            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-wider">
                              {t("catalog.product.category")}
                            </span>
                            <span className="text-[10px] sm:text-xs font-semibold truncate text-foreground">
                              {product.category}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50 group-hover:bg-primary/5 transition-colors gap-1">
                          <span className="font-bold text-xs sm:text-sm md:text-base text-foreground tracking-tight truncate">
                            {formatRupiah(product.price)}
                          </span>
                          <span className="text-[8px] sm:text-[10px] font-bold text-success bg-background px-1.5 sm:px-2 py-1 rounded shadow-sm border border-border/50 shrink-0">
                            {t("catalog.product.stock")} {product.stock}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* PAGINATION */}
              {totalPage > 1 && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="pt-4 sm:pt-6 flex justify-center border-t border-border/40"
                >
                  <PaginationComponent
                    currentPage={page}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                  />
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
