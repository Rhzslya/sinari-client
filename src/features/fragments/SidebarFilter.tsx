import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand, Category } from "@/enum/enum";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarFiltersProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  handleSearch: () => void;
  categoryParam: string | undefined;
  brandParam: string | undefined;
  inStockOnlyParam: boolean;
  tempMinPrice: string;
  setTempMinPrice: (val: string) => void;
  tempMaxPrice: string;
  setTempMaxPrice: (val: string) => void;
  updateFilter: (key: string, value: string | null) => void;
  applyPriceFilter: () => void;
  isLoading: boolean;
  isDatabaseEmpty: boolean;
}

export const SidebarFilters = ({
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
}: SidebarFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8 pr-1 sm:pr-4">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t("catalog.sidebar.search")}
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 sm:top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("catalog.sidebar.search_placeholder")}
            className="pl-8 pr-8 bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2 [&::-webkit-search-cancel-button]:appearance-none h-9 sm:h-10 text-xs sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={handleSearch}
            disabled={isDatabaseEmpty || isLoading}
          />
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t("catalog.sidebar.category")}
        </h3>
        <ul className="space-y-1 sm:space-y-1.5 text-xs sm:text-sm">
          <li>
            <button
              onClick={() => updateFilter("category", "ALL")}
              disabled={isDatabaseEmpty || isLoading}
              className={`w-full text-left px-2 py-1.5 sm:py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                !categoryParam
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted disabled:hover:bg-transparent"
              }`}
            >
              {t("catalog.sidebar.all_categories")}
            </button>
          </li>
          {Object.values(Category).map((category) => (
            <li key={category}>
              <button
                onClick={() => updateFilter("category", category)}
                disabled={isDatabaseEmpty || isLoading}
                className={`w-full text-left px-2 py-1.5 sm:py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  categoryParam === category
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted disabled:hover:bg-transparent"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t("catalog.sidebar.price")}
        </h3>
        <div className="space-y-2">
          <NumberStepper
            value={tempMinPrice ? Number(tempMinPrice) : undefined}
            onChange={(val) =>
              setTempMinPrice(val !== undefined ? String(val) : "")
            }
            step={10000}
            min={0}
            prefix="Rp"
            placeholder={t("catalog.sidebar.min")}
            disabled={isDatabaseEmpty || isLoading}
          />
          <NumberStepper
            value={tempMaxPrice ? Number(tempMaxPrice) : undefined}
            onChange={(val) =>
              setTempMaxPrice(val !== undefined ? String(val) : "")
            }
            step={10000}
            min={0}
            prefix="Rp"
            placeholder={t("catalog.sidebar.max")}
            disabled={isDatabaseEmpty || isLoading}
          />
          <Button
            size="sm"
            variant="secondary"
            className="w-full text-xs h-9 sm:h-8"
            onClick={applyPriceFilter}
            disabled={isDatabaseEmpty || isLoading}
          >
            {t("catalog.sidebar.apply_price")}
          </Button>
        </div>
      </div>

      {/* Tags (Brands) */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {t("catalog.sidebar.brand_tags")}
        </h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Object.values(Brand).map((brand) => (
            <button
              key={brand}
              disabled={isDatabaseEmpty || isLoading}
              onClick={() =>
                updateFilter("brand", brandParam === brand ? "ALL" : brand)
              }
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs rounded-md border transition-all ${
                brandParam === brand
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "bg-transparent border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="space-y-2 sm:space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in_stock"
            checked={inStockOnlyParam}
            onCheckedChange={(checked) =>
              updateFilter("in_stock_only", checked ? "true" : null)
            }
            disabled={isDatabaseEmpty || isLoading}
            className="size-4 sm:size-5"
          />
          <label
            htmlFor="in_stock"
            className={`text-xs sm:text-sm font-medium leading-none ${
              isDatabaseEmpty || isLoading
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground cursor-pointer"
            }`}
          >
            {t("catalog.sidebar.in_stock_label")}
          </label>
        </div>
      </div>
    </div>
  );
};
