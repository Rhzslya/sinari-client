import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  CircleX,
  Loader2,
  Mail,
  Timer,
} from "lucide-react";

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
}

export function CheckEmailCard({
  title = "Registration Success",
  message = "Please check your email to verify your account.",
  buttonResend = "Resend Verification Email",
  buttonNavigate,
  onActionResend,
  onActionNavigate,
  isLoading = false,
  cooldown = 0,
  isDisabled = false,
}: CheckEmailCardProps) {
  const isSuccessTitle =
    title === "Account Verified!" || title === "Registration Success";

  const isErrorTitle =
    title === "Account Not Verified" || title === "Failed to Send";

  const isMailSent = title === "Check Your Email";

  let titleColor = "text-foreground";
  if (isSuccessTitle) titleColor = "text-green-600";
  else if (isErrorTitle) titleColor = "text-destructive";
  else if (isMailSent) titleColor = "text-primary";

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-xl border-none shadow-black/5 bg-card-foreground">
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-center flex flex-col items-center gap-6 text-2xl font-bold tracking-tight ${titleColor}`}
          >
            {isSuccessTitle && (
              <div className="p-3 bg-green-50 rounded-full">
                <Check className="size-12 text-green-600" strokeWidth={2} />
              </div>
            )}

            {isErrorTitle && (
              <div className="p-3 bg-red-50 rounded-full">
                <CircleX className="size-12 text-destructive" strokeWidth={2} />
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

            <span>{title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6 pt-4">
          <div className="text-muted text-sm leading-relaxed">{message}</div>

          {onActionResend && (
            <Button
              className="w-full h-10 font-semibold shadow-lg shadow-primary/20 transition-all text-secondary-foreground cursor-pointer"
              onClick={onActionResend}
              disabled={isLoading || cooldown > 0 || isDisabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending...
                </>
              ) : cooldown > 0 ? (
                <span className="flex items-center gap-2">
                  <Timer className="size-4 animate-pulse" />
                  Resend in {cooldown}s
                </span>
              ) : (
                buttonResend
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
