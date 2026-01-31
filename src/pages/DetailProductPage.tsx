import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/components/utils/formatRupiah";
import type { ProductResponse } from "@/model/product-model";
import { ProductServices } from "@/services/product-services";
import {
  ArrowLeft,
  Box,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Package,
  Maximize2,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const DetailProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCost, setShowCost] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      if (!productId) return;
      try {
        const product = await ProductServices.get(Number(productId));
        setProduct(product);
      } catch (error) {
        console.error("Failed to load product", error);
        toast.error("Gagal memuat detail produk");
        navigate("/dashboard/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [productId, navigate]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-125w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-xl" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const profit = product.price - product.cost_price;
  const margin = product.price > 0 ? (profit / product.price) * 100 : 0;

  const stockHealth =
    product.stock > 50
      ? 100
      : product.stock > 10
        ? (product.stock / 50) * 100
        : 10;
  const stockStatusColor =
    product.stock > 20
      ? "bg-emerald-500"
      : product.stock > 0
        ? "bg-yellow-500"
        : "bg-destructive";

  return (
    <div className="min-h-screen bg-muted/10 pb-8 animate-in fade-in">
      <div className="bg-background border-b sticky top-0 z-20 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-muted-foreground"
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-bold">{product.name}</h1>
            <Badge variant="outline" className="text-xs font-normal">
              {product.brand}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="size-3.5" /> Edit Product
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* HERO SECTION: Image + Key Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-background rounded-xl border shadow-sm overflow-hidden">
          {/* Image Area (40%) */}
          <div className="lg:col-span-1 bg-white dark:bg-muted/5 p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r relative group">
            {product.image_url ? (
              <>
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="size-4" />
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center text-muted-foreground/40">
                <ImageIcon className="size-20 mb-4" />
                <span>No Image</span>
              </div>
            )}
          </div>

          {/* Key Metrics Area (60%) */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Selling Price
                  </h2>
                  <div className="text-4xl font-bold text-primary flex items-baseline gap-2">
                    {formatRupiah(product.price)}
                    {margin > 0 && (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 bg-emerald-50 border-emerald-200 align-middle text-xs ml-2"
                      >
                        +{margin.toFixed(0)}% Margin
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${stockStatusColor} hover:${stockStatusColor} text-white px-4 py-1 text-base`}
                  >
                    {product.stock > 0
                      ? `${product.stock} Units In Stock`
                      : "Out of Stock"}
                  </Badge>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-3 gap-8 text-sm">
                <div>
                  <span className="block text-muted-foreground mb-1">
                    Category
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Tag className="size-3.5" /> {product.category}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">
                    Manufacturer
                  </span>
                  <span className="font-medium flex items-center gap-2">
                    <Package className="size-3.5" /> {product.manufacturer}
                  </span>
                </div>
                <div>
                  <span className="block text-muted-foreground mb-1">
                    Product ID
                  </span>
                  <span className="font-mono bg-muted px-2 py-0.5 rounded">
                    {product.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Health Visualizer */}
            <div className="mt-8">
              <div className="flex justify-between text-xs mb-2">
                <span className="font-medium">Inventory Health Score</span>
                <span className="text-muted-foreground">
                  {stockHealth.toFixed(0)}/100
                </span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${stockStatusColor}`}
                  style={{ width: `${stockHealth}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on current stock vs sales velocity (dummy data).
              </p>
            </div>
          </div>
        </div>

        {/* DETAILED METRICS GRIDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Breakdown Card */}
          <Card>
            <CardHeader className="border-b py-4 bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="size-4" /> Financial Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1 p-4 bg-background rounded-lg border">
                  <span className="text-sm text-muted-foreground">
                    Unit Cost (HPP)
                  </span>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-mono font-medium">
                      {showCost ? formatRupiah(product.cost_price) : "••••••••"}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowCost(!showCost)}
                    >
                      {showCost ? (
                        <EyeOff className="size-3.5" />
                      ) : (
                        <Eye className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                  <span className="text-sm text-emerald-700 dark:text-emerald-400">
                    Gross Profit / Unit
                  </span>
                  <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                    {showCost ? `+${formatRupiah(profit)}` : "••••••••"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded flex items-center gap-2">
                <Calendar className="size-3.5" />
                Last price update:{" "}
                {new Date(product.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Meta Info Card */}
          <Card>
            <CardHeader className="border-b py-4 bg-muted/10">
              <CardTitle className="text-base flex items-center gap-2">
                <Box className="size-4" /> Inventory & System Data
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Box className="size-4" /> Physical Stock
                  </span>
                  <span className="text-xl font-bold">{product.stock}</span>
                </div>
                {/* Contoh jika ada data lain (misal stok dipesan) */}
                <div className="flex justify-between items-center p-3 border rounded-md bg-muted/30 text-muted-foreground">
                  <span className="text-sm flex items-center gap-2">
                    <Package className="size-4" /> Committed / Reserved
                  </span>
                  <span className="text-base font-medium">0 (Demo)</span>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="block text-muted-foreground font-medium mb-1">
                      Created By System At
                    </span>
                    <span>{new Date(product.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-muted-foreground font-medium mb-1">
                      Last Modified At
                    </span>
                    <span>{new Date(product.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetailProductPage;
