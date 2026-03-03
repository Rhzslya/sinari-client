import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { NumberStepper } from "@/components/utils/numberStepper";
import { Brand, Category } from "@/enum/product-enum";
import { Search } from "lucide-react";

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
  return (
    <div className="space-y-8 pr-4">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Pencarian
        </h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari produk"
            className="pl-8 pr-8 bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:ring-2 [&::-webkit-search-cancel-button]:appearance-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onBlur={handleSearch}
            disabled={isDatabaseEmpty || isLoading}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Kategori
        </h3>
        <ul className="space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => updateFilter("category", "ALL")}
              disabled={isDatabaseEmpty || isLoading}
              className={`w-full text-left px-2 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                !categoryParam
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted disabled:hover:bg-transparent"
              }`}
            >
              Semua Kategori
            </button>
          </li>
          {Object.values(Category).map((category) => (
            <li key={category}>
              <button
                onClick={() => updateFilter("category", category)}
                disabled={isDatabaseEmpty || isLoading}
                className={`w-full text-left px-2 py-1.5 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Harga
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
            placeholder="Min"
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
            placeholder="Max"
            disabled={isDatabaseEmpty || isLoading}
          />
          <Button
            size="sm"
            variant="secondary"
            className="w-full text-xs"
            onClick={applyPriceFilter}
            disabled={isDatabaseEmpty || isLoading}
          >
            Terapkan Harga
          </Button>
        </div>
      </div>

      {/* Tags (Brands) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Merek (Tags)
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.values(Brand).map((brand) => (
            <button
              key={brand}
              disabled={isDatabaseEmpty || isLoading}
              onClick={() =>
                updateFilter("brand", brandParam === brand ? "ALL" : brand)
              }
              className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
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
      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in_stock"
            checked={inStockOnlyParam}
            onCheckedChange={(checked) =>
              updateFilter("in_stock_only", checked ? "true" : null)
            }
            disabled={isDatabaseEmpty || isLoading}
          />
          <label
            htmlFor="in_stock"
            className={`text-sm font-medium leading-none ${
              isDatabaseEmpty || isLoading
                ? "text-muted-foreground/50 cursor-not-allowed"
                : "text-muted-foreground cursor-pointer"
            }`}
          >
            Hanya tampilkan stok tersedia
          </label>
        </div>
      </div>
    </div>
  );
};
