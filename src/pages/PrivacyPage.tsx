import {
  LockKeyhole,
  EyeOff,
  UserCheck,
  Share2,
  ShieldQuestion,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Privasi & Keamanan Data
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kami menjaga data Anda sama amannya dengan kami menjaga perangkat
            Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Card 1 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <UserCheck className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              Informasi yang Kami Kumpulkan
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kami hanya meminta Nama, Nomor WhatsApp, dan tipe kerusakan untuk
              pendaftaran servis. Kami tidak akan meminta kartu identitas (KTP)
              kecuali untuk kasus klaim kepemilikan perangkat yang hilang bukti
              notanya.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <LockKeyhole className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              Kerahasiaan Kata Sandi Layar
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sandi/Pola layar Anda hanya diminta jika diperlukan untuk mengetes
              fungsi komponen secara utuh (misal: tes sentuhan layar penuh, tes
              suara). Anda berhak menolak memberikan sandi dengan konsekuensi
              garansi pengetesan terbatas.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <EyeOff className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">
              Larangan Mengakses Data Pribadi
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SOP Teknisi Sinari Cell melarang keras membuka aplikasi chat,
              galeri foto, atau m-banking pelanggan. Segala pelanggaran privasi
              oleh staf kami akan ditindak tegas secara hukum.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-muted/20 border border-border/50 p-8 rounded-3xl hover:bg-muted/40 transition-colors">
            <Share2 className="size-8 text-primary mb-6" />
            <h2 className="text-xl font-bold mb-3">Pihak Ketiga & Pemasaran</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Data nomor telepon Anda murni digunakan di database internal kami
              untuk pelacakan resi servis dan layanan purna jual. Kami tidak
              memperjualbelikan database pelanggan ke pihak telemarketing
              manapun.
            </p>
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ShieldQuestion className="size-10 text-primary shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Hapus Data Anda</h3>
              <p className="text-sm text-muted-foreground">
                Anda berhak meminta kami menghapus nomor telepon Anda dari
                sistem setelah masa garansi servis habis.
              </p>
            </div>
          </div>
          <Button className="shrink-0 cursor-pointer">
            Ajukan Penghapusan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
