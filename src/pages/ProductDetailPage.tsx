import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/components/utils/formatRupiah";
import {
  ArrowLeft,
  Barcode,
  Box,
  MessageCircle,
  Package,
  QrCode,
  ScanBarcode,
  ShoppingCart,
  ShieldCheck,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { useProductQueries } from "@/hooks/product-queries";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const productQueries = useProductQueries();

  const id = Number(productId);

  const {
    data: product,
    isLoading,
    isError,
  } = productQueries.usePublicDetail({ id });

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Memuat detail produk...
      </div>
    );

  if (isError || !product)
    return (
      <NotFoundPage
        isDashboard={false}
        id={id}
        entityName="Product"
        backUrl="/products"
        variant="minimal"
      />
    );

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  let stockColor = "bg-emerald-500";
  if (isOutOfStock) stockColor = "bg-destructive";
  else if (isLowStock) stockColor = "bg-amber-500";

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-7xl">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Detail Produk</h1>
            <p className="text-sm text-muted-foreground">
              Informasi lengkap dan spesifikasi produk
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* KOLOM KIRI (Main Info & Specs) */}
            <div className="xl:col-span-2 flex flex-col gap-6 h-full">
              {/* CARD UTAMA (Gambar, Judul, Harga) */}
              <Card className="flex flex-col overflow-hidden shrink-0 shadow-sm border-border/60">
                <CardHeader className="bg-slate-50/50 dark:bg-muted/10 pb-8 border-b">
                  <div className="flex items-start md:items-center gap-6 flex-col md:flex-row">
                    {/* Gambar Produk */}
                    <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-xl border-2 border-background shadow-sm bg-white flex items-center justify-center overflow-hidden p-4 relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <Package className="w-16 h-16 text-muted-foreground/30" />
                      )}
                      {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-3 py-1 rounded shadow-sm tracking-widest">
                            HABIS
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Judul & Badge */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-[10px] bg-primary/10 text-primary hover:bg-primary/20 border-none"
                        >
                          {product.category}
                        </Badge>
                        {isOutOfStock && (
                          <Badge variant="destructive" className="text-[10px]">
                            OUT OF STOCK
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground wrap-break-word">
                        {product.name}
                      </CardTitle>

                      <CardDescription className="flex items-center gap-2 text-base overflow-hidden">
                        <span className="font-semibold text-foreground shrink-0 bg-muted px-2 py-0.5 rounded-md text-sm">
                          {product.brand}
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          •
                        </span>
                        {/* Perlindungan teks spam pabrikan */}
                        <span
                          className="truncate max-w-37.5 sm:max-w-62.5 text-sm font-medium uppercase tracking-wider"
                          title={product.manufacturer}
                        >
                          {product.manufacturer || "N/A"}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 md:p-8 bg-background">
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-muted-foreground font-bold tracking-widest">
                      Harga Produk
                    </label>
                    <div className="text-4xl md:text-5xl font-black text-primary tracking-tighter">
                      {formatRupiah(product.price)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* DUA CARD BAWAH (Specs & ID) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Spesifikasi Card */}
                <Card className="h-full flex flex-col shadow-sm border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <ScanBarcode className="w-4 h-4" /> Spesifikasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-center">
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">
                        Kategori
                      </span>
                      <span className="text-sm font-bold">
                        {product.category}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dashed">
                      <span className="text-sm text-muted-foreground">
                        Merek
                      </span>
                      <span className="text-sm font-bold">{product.brand}</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 py-2">
                      <span className="text-sm text-muted-foreground shrink-0">
                        Pabrikan
                      </span>
                      <span
                        className="text-sm font-bold truncate max-w-37.5 sm:max-w-50 text-right"
                        title={product.manufacturer}
                      >
                        {product.manufacturer || "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Identification / Jaminan Card */}
                <Card className="h-full flex flex-col shadow-sm border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <QrCode className="w-4 h-4" /> Identifikasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center text-center space-y-4 pt-4">
                    <div className="w-full h-16 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden relative border border-border/50">
                      <Barcode className="w-32 h-full text-muted-foreground opacity-50" />
                    </div>
                    <div className="space-y-1 w-full bg-muted/20 p-2 rounded-md border border-dashed">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                        SKU Produk
                      </p>
                      <p className="font-mono font-bold text-base tracking-widest text-foreground">
                        PRD-{product.id.toString().padStart(6, "0")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* KOLOM KANAN (Actions, Status, Info) */}
            <div className="space-y-6 h-full flex flex-col">
              {/* KOTAK PEMBELIAN (Quick Actions Public) */}
              <Card className="h-fit border-t-4 border-t-primary shadow-md">
                <CardHeader className="pb-4 bg-muted/10">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                    Atur Pembelian
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-6">
                  <Button
                    size="lg"
                    className="w-full justify-center duration-300 font-bold shadow-sm"
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" /> Masukkan Keranjang
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center duration-300 font-bold border-2 hover:bg-green-50 hover:text-green-700 hover:border-green-600 transition-colors"
                  >
                    <MessageCircle className="mr-2 h-5 w-5 text-green-600" />{" "}
                    Tanya Penjual
                  </Button>
                </CardContent>
              </Card>

              {/* INVENTORY STATUS */}
              <Card className="h-fit shadow-sm border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
                    <Box className="w-4 h-4" /> Ketersediaan Stok
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div
                    className={`text-center py-5 rounded-xl border border-dashed ${isOutOfStock ? "bg-destructive/10 border-destructive/20" : "bg-muted/20 border-border/60"}`}
                  >
                    <div
                      className={`text-5xl font-black tracking-tighter ${isOutOfStock ? "text-destructive" : "text-foreground"}`}
                    >
                      {product.stock}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                      Unit Tersedia
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span>Habis</span>
                      <span>Aman</span>
                    </div>
                    <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden border border-secondary">
                      <div
                        className={`h-full ${stockColor} transition-all duration-700 ease-out`}
                        style={{
                          width: `${Math.min((product.stock / 20) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    {isLowStock && !isOutOfStock && (
                      <p className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-2">
                        <AlertCircle className="w-3 h-3" /> Stok menipis, segera
                        beli!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* KEPERCAYAAN / METADATA */}
              <Card className="flex-1 shadow-sm border-border/60 bg-muted/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex gap-2 items-center text-muted-foreground uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" /> Jaminan Layanan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm h-full flex flex-col pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Produk Original</p>
                      <p className="text-xs text-muted-foreground">
                        Terjamin keasliannya
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-full">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Pengiriman Aman</p>
                      <p className="text-xs text-muted-foreground">
                        Dikemas dengan standar tinggi
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
