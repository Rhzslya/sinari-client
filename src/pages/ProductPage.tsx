import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brand, Category } from "@/enum/product-enum";
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
  Loader2,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SidebarFilters } from "@/features/fragments/SidebarFilter";
import { TruncatedTooltip } from "@/components/utils/truncatedTooltip";
import { useTranslation } from "react-i18next";

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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <p className="text-destructive font-medium">Failed to load products.</p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-8xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <aside className="hidden md:block w-64 shrink-0 border-r border-border/40 min-h-[80vh]">
          <div className="sticky top-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" />{" "}
              {t("catalog.filters.title")}
            </h2>
            <SidebarFilters {...sidebarProps} />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t("catalog.title")}
              </h1>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="md:hidden flex-1">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full gap-2 "
                      disabled={isDatabaseEmpty}
                    >
                      <SlidersHorizontal className="h-4 w-4" />{" "}
                      {t("catalog.filters.title")}
                      {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[85vw] sm:w-87.5 overflow-y-auto"
                  >
                    <div className="py-6">
                      <h2 className="text-lg font-bold mb-6">
                        {t("catalog.filters.title")}
                      </h2>
                      <SidebarFilters {...sidebarProps} />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex-1 sm:flex-none gap-2 px-3 bg-muted/30"
                    disabled={products.length === 0}
                  >
                    {t("catalog.sort.title")}{" "}
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
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
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-muted-foreground mr-1">
                {t("catalog.filters.active")}
              </span>

              {searchParam && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-normal text-xs bg-muted/50 gap-1.5 rounded-md flex items-center"
                >
                  {t("catalog.filters.search")} {searchParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateFilter("name", null);
                      setSearchTerm("");
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 focus:outline-none"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              )}

              {categoryParam && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-normal text-xs bg-muted/50 gap-1.5 rounded-md flex items-center"
                >
                  {t("catalog.filters.category")} {categoryParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateFilter("category", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 focus:outline-none"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              )}

              {brandParam && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-normal text-xs bg-muted/50 gap-1.5 rounded-md flex items-center"
                >
                  {t("catalog.filters.brand")} {brandParam}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateFilter("brand", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 focus:outline-none"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              )}

              {inStockOnlyParam && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-normal text-xs bg-muted/50 gap-1.5 rounded-md flex items-center"
                >
                  {t("catalog.filters.in_stock")}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateFilter("in_stock_only", null);
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 focus:outline-none"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              )}

              {(minPriceParam || maxPriceParam) && (
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-normal text-xs bg-muted/50 gap-1.5 rounded-md flex items-center"
                >
                  {t("catalog.filters.price")}{" "}
                  {minPriceParam ? formatRupiah(Number(minPriceParam)) : "Rp 0"}{" "}
                  - {maxPriceParam ? formatRupiah(Number(maxPriceParam)) : "~"}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setTempMinPrice("");
                      setTempMaxPrice("");
                      setSearchParams((prev) => {
                        prev.delete("min_price");
                        prev.delete("max_price");
                        prev.set("page", "1");
                        return prev;
                      });
                    }}
                    className="ml-1 rounded-full hover:bg-muted p-0.5 focus:outline-none"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-destructive transition-colors" />
                  </button>
                </Badge>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                }}
                className="text-xs text-muted-foreground hover:text-foreground ml-2 underline underline-offset-2 focus:outline-none"
              >
                {t("catalog.filters.clear_all")}
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary/60" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] rounded-2xl border border-dashed border-border bg-muted/10">
              <PackageSearch className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-medium">
                {t("catalog.empty.title")}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                {t("catalog.empty.desc")}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="group relative flex flex-col rounded-2xl bg-muted/20 border border-border/40 p-3 sm:p-4 transition-all duration-300 hover:bg-muted/40 hover:border-border cursor-pointer"
                  >
                    <div className="relative aspect-square bg-slate-50 flex items-center justify-center rounded-xl overflow-hidden mb-4 transition-colors group-hover:bg-slate-100 border border-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Package className="h-16 w-16 text-slate-300 transition-transform duration-500 group-hover:scale-110" />
                      )}

                      {product.stock <= 0 && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-4 py-1.5 rounded-full shadow-sm tracking-widest">
                            {t("catalog.product.out_of_stock")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col flex-1 mt-auto pt-2">
                      <TruncatedTooltip
                        text={product.name}
                        className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300"
                      />

                      {product.manufacturer && (
                        <div className="mb-3 w-full">
                          <span
                            className="inline-block max-w-full truncate text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                            title={product.manufacturer}
                          >
                            {product.manufacturer}
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="flex flex-col border-l-2 border-primary/50 pl-2">
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                            {t("catalog.product.brand")}
                          </span>
                          <span className="text-xs font-semibold truncate text-foreground">
                            {product.brand}
                          </span>
                        </div>
                        <div className="flex flex-col border-l-2 border-muted pl-2">
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                            {t("catalog.product.category")}
                          </span>
                          <span className="text-xs font-semibold truncate text-foreground">
                            {product.category}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between bg-muted/40 p-2 sm:p-2.5 rounded-lg border border-border/50 group-hover:bg-primary/5 transition-colors">
                        <span className="font-bold text-sm sm:text-base text-foreground tracking-tight">
                          {formatRupiah(product.price)}
                        </span>
                        <span className="text-[10px] font-bold text-success bg-background px-2 py-1 rounded shadow-sm border border-border/50">
                          {t("catalog.product.stock")} {product.stock}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              {totalPage > 1 && (
                <div className="pt-6 flex justify-center border-t border-border/40">
                  <PaginationComponent
                    currentPage={page}
                    totalPages={totalPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductPage;
