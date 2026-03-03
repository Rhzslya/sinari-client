import { HelpCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqData = [
  {
    question: "Berapa lama proses servis gadget?",
    answer:
      "Kerusakan ringan bisa ditunggu (1-2 jam). Kerusakan mesin berat memakan waktu 1-3 hari kerja.",
  },
  {
    question: "Apakah ada garansi pasca servis?",
    answer:
      "Ya, kami memberikan garansi 30 hari untuk pergantian suku cadang dan jasa servis dengan syarat segel utuh.",
  },
  {
    question: "Bagaimana cara melacak perbaikan?",
    answer:
      "Gunakan fitur 'Cek Status Servis' di menu atas, masukkan ID resi yang diberikan kasir, lalu pantau progresnya.",
  },
  {
    question: "Bisa bayar pakai apa saja?",
    answer:
      "Pembayaran sangat fleksibel. Anda bisa menggunakan Tunai, Transfer Bank (BCA, Mandiri), dan QRIS (Gopay, OVO, Dana, dll).",
  },
  {
    question: "Apakah data aman?",
    answer:
      "Sangat aman. Kami tidak akan mengakses galeri atau data pribadi Anda tanpa izin, privasi dijaga penuh.",
  },
  {
    question: "Apakah konsultasi bayar?",
    answer:
      "Tidak. Pengecekan awal dan konsultasi keluhan di toko atau via WhatsApp 100% gratis.",
  },
];

const FaqPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary mb-4">
              <HelpCircle className="size-4" /> Pusat Bantuan
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              FAQ Sinari Cell
            </h1>
            <p className="text-lg text-muted-foreground">
              Semua yang perlu Anda ketahui tentang layanan, garansi, dan cara
              kerja kami.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 gap-2 cursor-pointer">
            <Mail className="size-4" /> Email Dukungan
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-muted/20 border border-border/50 rounded-2xl p-6 hover:bg-muted/40 transition-colors hover:-translate-y-1 duration-300"
            >
              <h3 className="font-bold text-lg mb-3 text-foreground leading-tight">
                {faq.question}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
