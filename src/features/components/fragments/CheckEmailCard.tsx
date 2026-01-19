import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface CheckEmailCardProps {
  title?: string;
  message?: React.ReactNode;
  buttonText?: string;
  onAction: () => void;
}

export function CheckEmailCard({
  title = "Registration Success",
  message = "Please check your email to verify your account.",
  buttonText = "Back to Login",
  onAction,
}: CheckEmailCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-green-600 flex flex-col items-center gap-2">
          <CheckCircle2 className="size-10" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">{message}</p>
        <Button className="w-full" variant="outline" onClick={onAction}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
