import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Timer, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

const RateLimitBanner = ({
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

  const minutes = Math.floor(timeLeft / 60);
  const remainingSeconds = timeLeft % 60;

  return (
    <div className="w-full max-w-lg mb-4 flex items-center justify-between gap-3 rounded-lg bg-orange-50 p-3 border border-orange-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-3 min-w-0">
        <div className="bg-orange-100 p-2 rounded-full shrink-0">
          <Timer className="h-5 w-5 text-orange-600" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-orange-900 truncate">
            {t("rate_limit.banner_title")}
          </h3>
          <p className="text-xs text-orange-700/90 truncate">
            {t("rate_limit.banner_desc")}{" "}
            <strong className="font-mono text-orange-800">
              {minutes.toString().padStart(2, "0")}:
              {remainingSeconds.toString().padStart(2, "0")}
            </strong>{" "}
            {t("rate_limit.banner_desc_suffix")}
          </p>
        </div>
      </div>

      <Button
        size="sm"
        onClick={onRetry}
        disabled={timeLeft > 0}
        variant={timeLeft > 0 ? "outline" : "default"}
        className="shrink-0 h-8 bg-white cursor-pointer"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${timeLeft === 0 ? "mr-1.5" : "animate-spin"}`}
        />
        {timeLeft === 0 && <span>{t("rate_limit.btn_refresh")}</span>}
      </Button>
    </div>
  );
};

export default RateLimitBanner;
