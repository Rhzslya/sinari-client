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
    <Card className="shadow-xl border-none shadow-black/5">
      <CardHeader>
        <CardTitle
          className={`text-center flex flex-col items-center gap-4 text-2xl font-bold ${titleColor}`}
        >
          {isSuccessTitle && (
            <Check className="size-16 text-green-600" strokeWidth={1.5} />
          )}

          {isErrorTitle && (
            <CircleX className="size-16 text-destructive" strokeWidth={1.5} />
          )}

          {isMailSent && (
            <Mail className="size-16 text-primary" strokeWidth={1.5} />
          )}

          {!isSuccessTitle && !isErrorTitle && !isMailSent && (
            <CheckCircle2 className="size-16 text-primary" strokeWidth={1.5} />
          )}

          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-muted-foreground text-sm leading-relaxed">
          {message}
        </div>
        {onActionResend && (
          <Button
            className="w-full h-10 font-semibold transition-all cursor-pointer"
            variant="outline"
            onClick={onActionResend}
            disabled={isLoading || cooldown > 0 || isDisabled}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending...
              </>
            ) : cooldown > 0 ? (
              <span className="flex items-center gap-2 text-muted-foreground">
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
            <Button
              className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer gap-2"
              onClick={onActionNavigate}
              variant="link"
            >
              <ArrowLeft className="size-4" />
              {buttonNavigate}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
