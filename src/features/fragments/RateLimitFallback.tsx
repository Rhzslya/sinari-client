import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldAlert, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface RateLimitFallbackProps {
  seconds: number;
  onRetry: () => void;
}

const RateLimitFallback = ({ seconds, onRetry }: RateLimitFallbackProps) => {
  const { t } = useTranslation();
  const [targetTime] = useState(() => Date.now() + seconds * 1000);
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.ceil((targetTime - now) / 1000);
      if (remaining <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center min-h-125 w-full p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-background border rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5 flex flex-col md:flex-row"
      >
        <div className="flex-1 p-8 sm:p-12 bg-muted/30 border-b md:border-b-0 md:border-r border-dashed">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                <ShieldAlert className="text-primary h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tighter mb-4 leading-none">
                {t("rate_limit.fallback_title")}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-sm">
                {t("rate_limit.fallback_desc")}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                <span>Security Protocol</span>
                <ArrowRight className="h-3 w-3" />
                <span>Rate Limiter</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-100 p-8 sm:p-12 flex flex-col items-center justify-center bg-linear-to-br from-background to-muted/20">
          <div className="text-center w-full space-y-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                {timeLeft > 0 ? "Cooling Down" : "Ready to Access"}
              </span>
              <div className="flex items-baseline justify-center gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={minutes}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl sm:text-7xl font-mono font-black tracking-tighter"
                  >
                    {minutes.toString().padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
                <span className="text-4xl font-mono font-light animate-pulse text-muted-foreground">
                  :
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={remainingSeconds}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl sm:text-7xl font-mono font-black tracking-tighter text-primary"
                  >
                    {remainingSeconds.toString().padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / seconds) * 100}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>

            <Button
              onClick={onRetry}
              disabled={timeLeft > 0}
              size="lg"
              className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-95 cursor-pointer text-foreground"
              variant={timeLeft > 0 ? "secondary" : "default"}
            >
              <RefreshCw
                className={`mr-3 h-5 w-5 ${timeLeft > 0 ? "animate-spin" : ""}`}
              />
              {timeLeft > 0
                ? t("rate_limit.btn_wait")
                : t("rate_limit.btn_refresh")}
            </Button>

            <p className="text-[10px] text-muted-foreground italic">
              Code: 429 Too Many Requests
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RateLimitFallback;
