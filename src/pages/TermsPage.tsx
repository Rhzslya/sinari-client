import { Button } from "@/components/ui/button";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">
            Ketentuan <br className="hidden md:block" /> Layanan.
          </h1>
          <p className="text-xl text-muted-foreground border-l-4 border-primary pl-4">
            Lima pilar kesepakatan antara Sinari Cell dan Pelanggan untuk
            memastikan transaksi yang aman, nyaman, dan bebas drama.
          </p>
        </div>

        <div className="space-y-12">
          {/* Pasal 1 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              01
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                Pendaftaran & Biaya Diagnosa
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Kami tidak memungut biaya pengecekan. Namun, jika pengerjaan
                dibatalkan <strong>setelah</strong> Anda menyetujui harga (dan
                perangkat sudah dibongkar), akan dikenakan biaya perakitan ulang
                minimum. Pemesanan suku cadang khusus wajib disertai DP 50%.
              </p>
            </div>
          </div>

          {/* Pasal 2 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              02
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Pembayaran Transaksi</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Barang yang sudah diperbaiki atau dibeli wajib dilunasi sebelum
                dibawa pulang. Kami tidak menerima sistem kasbon/cicilan
                pribadi. Pembayaran valid dilakukan di area kasir toko atau
                transfer rekening perusahaan.
              </p>
            </div>
          </div>

          {/* Pasal 3 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              03
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                Batas Pengambilan Unit
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Perangkat maksimal diambil <strong>30 Hari</strong> setelah
                dikonfirmasi selesai/batal. Melewati 90 hari tanpa kabar, kami
                anggap barang tersebut tidak bertuan dan berhak kami lelang
                untuk menutupi kerugian.
              </p>
            </div>
          </div>

          {/* Pasal 4 */}
          <div className="relative p-8 md:p-10 bg-destructive/5 border border-destructive/20 rounded-3xl overflow-hidden group hover:border-destructive/40 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-destructive/5 group-hover:text-destructive/10 transition-colors duration-500 select-none pointer-events-none">
              04
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-destructive mb-4">
                Risiko Servis Mesin
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Unit yang masuk dengan riwayat{" "}
                <strong>
                  mati total, terkena cairan, atau butuh servis IC/CPU
                </strong>{" "}
                memiliki risiko mati permanen atau kehilangan fitur tertentu
                setelah dibongkar. Teknisi kami bekerja semaksimal mungkin,
                namun risiko ini ditanggung sepenuhnya oleh pelanggan.
              </p>
            </div>
          </div>

          {/* Pasal 5 */}
          <div className="relative p-8 md:p-10 bg-muted/20 border border-border/50 rounded-3xl overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute -right-6 -top-12 text-[150px] font-black text-muted-foreground/10 group-hover:text-primary/5 transition-colors duration-500 select-none pointer-events-none">
              05
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">
                Pengecekan Akhir (Serah Terima)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pelanggan wajib mengetes fisik layar, kamera, dan kelengkapan
                lain sebelum meninggalkan kasir. Komplain mengenai retak, lecet,
                atau hilang setelah keluar dari area toko dianggap tidak valid.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 cursor-pointer"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
