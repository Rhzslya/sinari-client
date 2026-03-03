import { Send, ShieldCheck, Banknote, Wrench, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleConsultClick = () => {
    const phoneNumber = "6281234567890";
    const text =
      "Halo Sinari Cell, saya ingin konsultasi mengenai servis gadget saya.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");
  };

  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = EMAIL_REGEX.test(email);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Berhasil berlangganan");
    }, 1000);
  };

  const serviceStandards = [
    { icon: ShieldCheck, label: "Jaminan Garansi" },
    { icon: Banknote, label: "Biaya Transparan" },
    { icon: Wrench, label: "Teknisi Ahli" },
    { icon: Smartphone, label: "Cek Status Daring" },
  ];

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-9";

  return (
    <footer className="bg-muted/20 border-t border-border mt-auto pt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-12 border-b border-border/60">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">
              Dapatkan Info Promo Spesial
            </h3>
            <p className="text-muted-foreground text-sm">
              Berlangganan buletin kami agar tidak ketinggalan info layanan dan
              aksesori terbaru.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex gap-2 max-w-md mt-4"
            >
              <Input
                autoComplete="off"
                type="email"
                required
                placeholder="Masukkan email Anda"
                className={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                className="shrink-0 gap-2 cursor-pointer text-foreground"
                disabled={isSubmitting || !isValidEmail}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Memproses...</span>
                ) : (
                  <>
                    Langganan <Send className="size-4" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="flex flex-col lg:items-end justify-center space-y-4">
            <p className="font-semibold text-foreground text-sm">
              Standar Pelayanan Kami
            </p>
            <div className="flex flex-wrap gap-4 lg:justify-end text-muted-foreground">
              {serviceStandards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-background px-3 py-2 rounded-md border border-border shadow-sm cursor-default hover:border-primary/50 transition-colors"
                  >
                    <Icon className="size-5 text-primary" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-2xl font-black text-primary mb-4 tracking-tighter">
              Sinari Cell
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Mitra terpercaya untuk perbaikan perangkat keras, pemeliharaan
              perangkat lunak, dan penyedia aksesoris.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <FacebookIcon />
              </a>
              <a
                href="#"
                className="p-2.5 bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <TwitterIcon />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Layanan Utama</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button
                  className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto font-normal text-sm cursor-pointer"
                  onClick={handleConsultClick}
                >
                  Konsultasi Kerusakan
                </button>
              </li>
              <li>
                <Link
                  to="/#track-srv"
                  className="text-muted-foreground hover:text-primary transition-colors block"
                  onClick={() => {
                    const element = document.getElementById("track-srv");

                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  Cek Status Servis
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary transition-colors block"
                >
                  Katalog Produk
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">
              Informasi Pelanggan
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pusat Bantuan (FAQ)
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Kebijakan</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/warranty"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Ketentuan Garansi
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-border/60 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {currentYear} Sinari Cell. Hak Cipta Dilindungi
            Undang-Undang.
          </p>
          <div className="flex gap-4">
            <span className="text-xs font-medium">BCA</span>
            <span className="text-xs font-medium">Mandiri</span>
            <span className="text-xs font-medium">QRIS</span>
            <span className="text-xs font-medium">Gopay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
