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
import { useTranslation } from "react-i18next"; // 👈 Import ini

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
      : "bg-card-foreground border-none shadow-xl shadow-black/5";

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className={cn("transition-all duration-300", cardStyles)}>
        <CardHeader className="pb-1">
          <CardTitle
            className={`text-center flex flex-col items-center gap-2 text-2xl font-bold tracking-tight ${titleColor}`}
          >
            {isSuccessTitle && (
              <div className="p-3 bg-green-50 rounded-full">
                <Check className="size-12 text-green-600" strokeWidth={2} />
              </div>
            )}

            {isErrorTitle && (
              <div className="p-3 bg-destructive/10 rounded-full">
                <X className="size-12 text-destructive" strokeWidth={2} />
              </div>
            )}

            {isMailSent && (
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="size-12 text-primary" strokeWidth={2} />
              </div>
            )}

            {!isSuccessTitle && !isErrorTitle && !isMailSent && (
              <div className="p-3 bg-primary/10 rounded-full">
                <CheckCircle2
                  className="size-12 text-primary"
                  strokeWidth={2}
                />
              </div>
            )}

            <span>{displayTitle}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div
            className={cn(
              "text-sm leading-relaxed",
              variant === "transparent"
                ? "text-muted-foreground"
                : "text-muted",
            )}
          >
            {displayMessage}
          </div>

          {onActionResend && (
            <Button
              className="w-full h-10 text-foreground text-sm font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer"
              onClick={onActionResend}
              disabled={isLoading || cooldown > 0 || isDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
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
          )}

          <div className="pt-2">
            {buttonNavigate && (
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
                onClick={onActionNavigate}
              >
                <ArrowLeft className="size-4" />
                {buttonNavigate}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
