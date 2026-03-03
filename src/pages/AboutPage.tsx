import { Flag, Rocket, Smartphone } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-4xl text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Cerita Perjalanan Kami
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Sinari Cell tidak dibangun dalam semalam. Kami hadir dari kepedulian
          terhadap sulitnya menemukan tempat servis yang jujur, aman, dan dapat
          diandalkan.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full" />

        <div className="space-y-12">
          <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary -translate-x-1/2 group-hover:scale-150 transition-transform" />
            <div className="ml-12 md:ml-0 md:w-[45%] md:text-right pr-4">
              <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                2015
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">Awal Mula Berdiri</h3>
              <p className="text-muted-foreground text-sm">
                Dimulai dari sebuah kios kecil, kami melayani servis ringan dan
                perbaikan perangkat lunak untuk warga sekitar.
              </p>
            </div>
            <div className="hidden md:flex md:w-[45%] justify-start pl-4">
              <div className="p-4 bg-muted/30 rounded-2xl">
                <Flag className="size-8 text-primary/50" />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row-reverse items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary -translate-x-1/2 group-hover:scale-150 transition-transform" />
            <div className="ml-12 md:ml-0 md:w-[45%] md:text-left pl-4">
              <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                2019
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">
                Ekspansi Layanan & Produk
              </h3>
              <p className="text-muted-foreground text-sm">
                Seiring meningkatnya kepercayaan, kami merenovasi toko dan mulai
                menyediakan suku cadang orisinal serta aksesori lengkap.
              </p>
            </div>
            <div className="hidden md:flex md:w-[45%] justify-end pr-4">
              <div className="p-4 bg-muted/30 rounded-2xl">
                <Smartphone className="size-8 text-primary/50" />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center md:justify-between group">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary -translate-x-1/2 group-hover:scale-150 transition-transform" />
            <div className="ml-12 md:ml-0 md:w-[45%] md:text-right pr-4">
              <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                Hari Ini
              </span>
              <h3 className="text-xl font-bold mt-3 mb-2">
                Transformasi Digital
              </h3>
              <p className="text-muted-foreground text-sm">
                Menghadirkan sistem pelacakan servis daring agar pelanggan dapat
                memantau progres perbaikan dari mana saja dengan transparan.
              </p>
            </div>
            <div className="hidden md:flex md:w-[45%] justify-start pl-4">
              <div className="p-4 bg-muted/30 rounded-2xl">
                <Rocket className="size-8 text-primary/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
