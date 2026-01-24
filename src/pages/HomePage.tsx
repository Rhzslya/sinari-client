import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Smartphone,
  Wrench,
  Zap,
  Search,
  ArrowRight,
  Star,
  ShieldCheck,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10 -z-10 skew-y-3 transform origin-top-left" />
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6">
            Solusi Gadget <span className="text-foreground">Terlengkap.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Pusat penjualan smartphone, aksesoris berkualitas, dan layanan
            servis teknis terpercaya di kota Anda.
          </p>
          <div className="flex flex-col sm:flex-row  justify-center">
            <Button
              size="lg"
              variant="outline"
              className="font-semibold text-lg h-12 px-8"
            >
              Konsultasi Servis
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 -mt-16 mb-20 relative z-10">
        <Card className="max-w-3xl mx-auto shadow-2xl border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Cek Status Servis Kamu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan Nomor Resi / ID Servis..."
                className="h-12 text-lg"
              />
              <Button size="lg" className="h-12 aspect-square p-0">
                <Search className="size-4" />
              </Button>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Contoh: SRV-2024001
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Layanan Sinari Cell</h2>
            <p className="text-muted-foreground">
              Apa yang bisa kami bantu hari ini?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Smartphone className="size-10 text-primary" />}
              title="Smartphone & Aksesoris"
              desc="Koleksi HP terbaru dan aksesoris original dengan garansi resmi."
            />
            <FeatureCard
              icon={<Wrench className="size-10 text-primary" />}
              title="Service Center"
              desc="Perbaikan hardware dan software ditangani oleh teknisi bersertifikat."
            />
            <FeatureCard
              icon={<Zap className="size-10 text-primary" />}
              title="Pulsa & PPOB"
              desc="Isi ulang pulsa, paket data, dan pembayaran tagihan kilat."
            />
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Produk Terlaris</h2>
            <p className="text-muted-foreground mt-1">
              Pilihan favorit pelanggan minggu ini
            </p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2">
            Lihat Semua <ArrowRight className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Card
              key={item}
              className="group cursor-pointer hover:border-primary transition-all"
            >
              <div className="aspect-square bg-muted rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/50 group-hover:scale-105 transition-transform duration-300">
                  Product Image
                </div>
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                  Diskon
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">
                  iPhone 15 Pro Max Case
                </h3>
                <p className="text-sm text-muted-foreground mb-2">Aksesoris</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary">Rp 150.000</span>
                  <div className="flex text-yellow-500 text-xs gap-0.5">
                    <Star className="size-3 fill-current" /> 4.9
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-6 md:hidden">
          Lihat Semua Produk
        </Button>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            Kenapa Memilih Sinari Cell?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary-foreground/10 rounded-full mb-4">
                <ShieldCheck className="size-8" />
              </div>
              <h3 className="font-bold text-xl">Garansi Terjamin</h3>
              <p className="text-primary-foreground/80 mt-2">
                Setiap produk dan servis dilindungi garansi toko.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-none shadow-md">
      <CardContent className="pt-6 text-center flex flex-col items-center">
        <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

export default HomePage;
