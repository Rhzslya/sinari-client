import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Loader2,
  Mail,
  Timer,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

interface CheckEmailCardProps {
  title?: string;
  message?: React.ReactNode;
  buttonResend?: string;
  buttonNavigate?: string | null;
  onActionResend?: () => void;
  onActionNavigate: () => void;
  isLoading?: boolean;
  cooldown?: number;
  isDisabled?: boolean;
  variant?: "default" | "transparent";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const iconVariants: Variants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 250, damping: 15 },
  },
};

export function CheckEmailCard({
  title,
  message,
  buttonResend,
  buttonNavigate,
  onActionResend,
  onActionNavigate,
  isLoading = false,
  cooldown = 0,
  isDisabled = false,
  variant = "default",
}: CheckEmailCardProps) {
  const { t } = useTranslation();

  const displayTitle = title || t("auth.card.default_title");
  const displayMessage = message || t("auth.card.default_message");
  const displayBtnResend = buttonResend || t("auth.card.default_btn_resend");

  const successTitles = [
    "Account Verified!",
    t("auth.verify.verified_title"),
    "Registration Success",
    t("auth.verify.reg_success_title"),
    "Password Reset!",
    t("auth.reset.success_title"),
  ];

  const errorTitles = [
    "Account Not Verified",
    t("auth.verify.not_verified_title"),
    "Failed to Send",
    t("auth.verify.failed_title"),
    t("auth.forgot.failed_title"),
  ];

  const mailSentTitles = [
    "Check Your Email",
    t("auth.verify.check_email_title"),
    t("auth.forgot.check_email_title"),
  ];

  const isSuccessTitle = successTitles.includes(displayTitle);
  const isErrorTitle = errorTitles.includes(displayTitle);
  const isMailSent = mailSentTitles.includes(displayTitle);

  let titleColor = "text-foreground";
  if (isSuccessTitle) titleColor = "text-green-600";
  else if (isErrorTitle) titleColor = "text-destructive";
  else if (isMailSent) titleColor = "text-primary";

  const cardStyles =
    variant === "transparent"
      ? "bg-transparent border-none shadow-none text-foreground"
      : "bg-card-foreground border-none shadow-2xl shadow-black/10"; // Dipertegas shadow-nya agar mirip form auth

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={cn("transition-all duration-300", cardStyles)}>
        <CardHeader className="pb-2 pt-6 sm:pt-8">
          <CardTitle
            className={`text-center flex flex-col items-center gap-3 sm:gap-4 text-xl sm:text-2xl font-bold tracking-tight ${titleColor}`}
          >
            {/* Animasi memantul pada Icon */}
            <motion.div variants={iconVariants}>
              {isSuccessTitle && (
                <div className="p-3 sm:p-4 bg-green-50 rounded-full shadow-sm border border-green-100">
                  <Check
                    className="size-10 sm:size-12 text-green-600"
                    strokeWidth={2.5}
                  />
                </div>
              )}

              {isErrorTitle && (
                <div className="p-3 sm:p-4 bg-destructive/10 rounded-full shadow-sm border border-destructive/20">
                  <X
                    className="size-10 sm:size-12 text-destructive"
                    strokeWidth={2.5}
                  />
                </div>
              )}

              {isMailSent && (
                <div className="p-3 sm:p-4 bg-primary/10 rounded-full shadow-sm border border-primary/20">
                  <Mail
                    className="size-10 sm:size-12 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
              )}

              {!isSuccessTitle && !isErrorTitle && !isMailSent && (
                <div className="p-3 sm:p-4 bg-primary/10 rounded-full shadow-sm border border-primary/20">
                  <CheckCircle2
                    className="size-10 sm:size-12 text-primary"
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </motion.div>

            <motion.span variants={itemVariants}>{displayTitle}</motion.span>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6 pb-6 sm:pb-8">
          <motion.div
            variants={itemVariants}
            className={cn(
              "text-xs sm:text-sm leading-relaxed px-2 sm:px-6",
              variant === "transparent"
                ? "text-muted-foreground"
                : "text-muted",
            )}
          >
            {displayMessage}
          </motion.div>

          {onActionResend && (
            <motion.div variants={itemVariants} className="px-4 sm:px-8">
              <Button
                className="w-full h-11 sm:h-10 text-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer"
                onClick={onActionResend}
                disabled={isLoading || cooldown > 0 || isDisabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 sm:size-5 animate-spin" />
                  </>
                ) : cooldown > 0 ? (
                  <span className="flex items-center gap-2">
                    <Timer className="size-4 animate-pulse" />
                    {t("auth.card.resend_in").replace(
                      "{{seconds}}",
                      String(cooldown),
                    )}
                  </span>
                ) : (
                  displayBtnResend
                )}
              </Button>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="pt-2 px-4 sm:px-8">
            {buttonNavigate && (
              <button
                type="button"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer outline-none focus-visible:ring-1 rounded px-2 py-1"
                onClick={onActionNavigate}
              >
                <ArrowLeft className="size-4" />
                {buttonNavigate}
              </button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
