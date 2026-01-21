import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, Loader2, Timer } from "lucide-react"; // Tambahkan Icon

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
  return (
    <Card className="shadow-xl border-none shadow-black/5">
      <CardHeader>
        <CardTitle className="text-center text-primary flex flex-col items-center gap-4 text-2xl font-bold">
          <CheckCircle2 className="size-12 text-green-500" />
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
