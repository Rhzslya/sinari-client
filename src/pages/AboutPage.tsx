import { Flag, Rocket, Smartphone } from "lucide-react";
import { useTranslation } from "react-i18next";

const timelineIcons = [Flag, Smartphone, Rocket];

const AboutPage = () => {
  const { t } = useTranslation();

  const timelineList = t("about.timeline", { returnObjects: true }) as Array<{
    badge: string;
    title: string;
    desc: string;
  }>;

  return (
    <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-500 py-16">
      <div className="container mx-auto px-4 max-w-4xl text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {t("about.title")}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t("about.subtitle")}
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border/50 -translate-x-1/2 rounded-full" />

        <div className="space-y-12">
          {timelineList.map((item, index) => {
            const Icon = timelineIcons[index];
            const isEven = index % 2 === 0;

            return (
              <div
                key={index}
                className={`relative flex flex-col md:${
                  isEven ? "flex-row" : "flex-row-reverse"
                } items-center md:justify-between group`}
              >
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary -translate-x-1/2 group-hover:scale-150 transition-transform" />

                <div
                  className={`ml-12 md:ml-0 md:w-[45%] ${
                    isEven ? "md:text-right pr-4" : "md:text-left pl-4"
                  }`}
                >
                  <span className="text-primary font-bold text-sm bg-primary/10 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                  <h3 className="text-xl font-bold mt-3 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>

                <div
                  className={`hidden md:flex md:w-[45%] ${
                    isEven ? "justify-start pl-4" : "justify-end pr-4"
                  }`}
                >
                  <div className="p-4 bg-muted/30 rounded-2xl group-hover:bg-primary/5 transition-colors duration-300">
                    <Icon className="size-8 text-primary/50 group-hover:text-primary transition-colors duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
