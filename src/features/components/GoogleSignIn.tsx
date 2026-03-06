import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GoogleSignInFragmentsProps {
  onClick: () => void;
  isLoading?: boolean;
  variant?: "default" | "light";
}

export function GoogleSignInFragments({
  onClick,
  isLoading = false,
  variant = "default",
}: GoogleSignInFragmentsProps) {
  const { t } = useTranslation();
  const isLight = variant === "light";

  return (
    <div className="w-full">
      <div className="relative my-5 sm:my-6">
        <div className="absolute inset-0 flex items-center">
          <span
            className={cn(
              "w-full border-t transition-colors duration-300",
              isLight ? "border-gray-300" : "border-border",
            )}
          />
        </div>
        <div className="relative flex justify-center text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
          <span
            className={cn(
              "px-3 transition-colors duration-300",
              isLight
                ? "bg-card-foreground text-gray-500"
                : "bg-background text-muted-foreground",
            )}
          >
            {t("auth.or_continue_with", { defaultValue: "Or continue with" })}
          </span>
        </div>
      </div>

      <motion.div whileTap={!isLoading ? { scale: 0.98 } : {}}>
        <Button
          variant="outline"
          type="button"
          className={cn(
            "w-full group cursor-pointer duration-300 gap-2.5 sm:gap-3 border font-medium transition-all shadow-sm h-11 sm:h-10 text-sm", // h-11 untuk Mobile
            isLight
              ? [
                  "bg-card-foreground",
                  "text-gray-700",
                  "border-gray-300",
                  "hover:bg-gray-50",
                  "hover:text-black",
                ]
              : [
                  "bg-transparent",
                  "text-foreground",
                  "border-input",
                  "hover:bg-muted",
                  "hover:text-foreground",
                ],
          )}
          onClick={onClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-4 sm:size-5 animate-spin text-muted-foreground" />
          ) : (
            <svg
              className="size-4 sm:size-5 grayscale group-hover:grayscale-0 transition-all duration-300"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {isLoading
            ? t("auth.common.processing", { defaultValue: "Processing..." })
            : t("auth.google", { defaultValue: "Google" })}
        </Button>
      </motion.div>
    </div>
  );
}
