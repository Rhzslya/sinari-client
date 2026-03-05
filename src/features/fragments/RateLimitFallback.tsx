import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const RateLimitFallback = ({
  seconds,
  onRetry,
}: {
  seconds: number;
  onRetry: () => void;
}) => {
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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-100 space-y-4 text-center p-8 border rounded-lg bg-muted/20 border-dashed animate-in fade-in zoom-in duration-300">
      <div className="bg-orange-100 p-3 rounded-full dark:bg-orange-900/20">
        <Timer className="h-8 w-8 text-destructive" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {t("rate_limit.fallback_title")}
        </h3>
        <p className="text-muted-foreground max-w-xs mx-auto text-sm">
          {t("rate_limit.fallback_desc")}
        </p>
      </div>

      <div className="text-3xl font-mono font-bold text-primary my-2">
        {minutes.toString().padStart(2, "0")}:
        {remainingSeconds.toString().padStart(2, "0")}
      </div>

      <Button
        onClick={onRetry}
        disabled={timeLeft > 0}
        variant={timeLeft > 0 ? "secondary" : "default"}
        className="min-w-37.5 text-foreground cursor-pointer duration-300"
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 text-foreground ${timeLeft === 0 ? "" : "animate-spin"}`}
        />
        {timeLeft > 0 ? t("rate_limit.btn_wait") : t("rate_limit.btn_refresh")}
      </Button>
    </div>
  );
};

export default RateLimitFallback;
