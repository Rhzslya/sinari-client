import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthServices } from "@/services/user-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(() => {
    return token ? "loading" : "error";
  });

  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!token) return;

    if (hasCalledRef.current) return;
    hasCalledRef.current = true;

    AuthServices.verify(token)
      .then(() => {
        setStatus("success");
        const timeout = setTimeout(() => navigate("/login"), 3000);
        return () => clearTimeout(timeout);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, navigate]);

  let titleColor = "text-primary";
  let titleText = "Verifying Account...";

  if (status === "success") {
    titleColor = "text-green-600";
    titleText = "Account Verified!";
  } else if (status === "error") {
    titleColor = "text-destructive";
    titleText = "Verification Failed";
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-secondary-foreground">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-card-foreground border-none shadow-xl shadow-black/5 transition-all duration-300">
          <CardHeader className="pb-1">
            <CardTitle
              className={`text-center flex flex-col items-center gap-2 text-2xl font-bold tracking-tight ${titleColor}`}
            >
              {status === "loading" && (
                <div className="p-3 bg-primary/10 rounded-full">
                  <Loader2
                    className="size-12 text-primary animate-spin"
                    strokeWidth={2}
                  />
                </div>
              )}

              {status === "success" && (
                <div className="p-3 bg-green-50 rounded-full">
                  <Check className="size-12 text-green-600" strokeWidth={2} />
                </div>
              )}

              {status === "error" && (
                <div className="p-3 bg-destructive/10 rounded-full">
                  <X className="size-12 text-destructive" strokeWidth={2} />
                </div>
              )}

              <span>{titleText}</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6">
            <div className="text-muted text-sm leading-relaxed">
              {status === "loading" &&
                "Please wait while we verify your email address. This shouldn't take long."}

              {status === "success" && (
                <>
                  Your email has been successfully verified.
                  <br />
                  You will be redirected to the login page shortly.
                </>
              )}

              {status === "error" && (
                <>
                  We couldn't verify your account.
                  <br />
                  The token may be invalid or has expired.
                </>
              )}
            </div>

            {status === "success" && (
              <Button
                className="w-full h-10 font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login Now
              </Button>
            )}

            {status === "error" && (
              <div className="pt-2">
                <button
                  type="button"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  <ArrowLeft className="size-4" />
                  Back to Login
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
