import { CheckCircle2, XCircle, Receipt, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const WarrantyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Kebijakan Garansi
          </h1>
          <p className="text-lg text-muted-foreground">
            Transparan sejak awal. Ketahui hak Anda dan bagaimana cara menjaga
            garansi perangkat agar tetap berlaku.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="flex items-center gap-3 bg-muted/20 border border-border/50 px-6 py-4 rounded-full">
            <BadgeCheck className="text-primary size-6" />
            <span className="font-semibold text-sm md:text-base">
              Hardware: 30 Hari
            </span>
          </div>
          <div className="flex items-center gap-3 bg-muted/20 border border-border/50 px-6 py-4 rounded-full">
            <BadgeCheck className="text-primary size-6" />
            <span className="font-semibold text-sm md:text-base">
              Software: 7 Hari
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-success/5 border border-success/20 rounded-3xl p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="size-8 text-success" />
              <h2 className="text-2xl font-bold text-success-foreground">
                Garansi Berlaku
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Sinari Cell akan memperbaiki kembali atau mengganti suku cadang
              secara gratis jika:
            </p>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p>
                  Kerusakan terjadi pada <strong>komponen yang sama</strong>{" "}
                  dengan yang diperbaiki sebelumnya.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p>
                  Masa waktu klaim masih berada dalam rentang masa garansi
                  (dihitung sejak barang diambil).
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                <p>
                  Membawa kelengkapan nota servis dan menyertakan bukti kendala
                  (jika ada).
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <XCircle className="size-8 text-destructive" />
              <h2 className="text-2xl font-bold text-destructive-foreground">
                Garansi Hangus
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Klaim garansi akan ditolak dan segala perbaikan lanjutan akan
              dikenakan biaya normal apabila:
            </p>
            <ul className="space-y-4 text-sm text-foreground/80">
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p>
                  <strong>Segel toko rusak:</strong> Segel robek, hilang, atau
                  terlihat indikasi dibongkar.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p>
                  <strong>Human Error:</strong> Perangkat jatuh, terbentur,
                  tertekan di saku, cacat fisik, atau terkena air/keringat.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                <p>
                  <strong>Intervensi pihak lain:</strong> Perangkat telah
                  diservis di toko lain setelah dari Sinari Cell.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Step to Claim */}
        <div className="bg-muted/10 rounded-3xl border border-border/50 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Receipt className="size-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Cara Klaim Garansi</h3>
              <p className="text-muted-foreground text-sm">
                Bawa perangkat, nota asli, dan tunjukkan kendalanya ke teknisi
                kami.
              </p>
            </div>
          </div>
          <Button className="w-full md:w-auto shrink-0 cursor-pointer">
            Konsultasi Klaim
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPage;
