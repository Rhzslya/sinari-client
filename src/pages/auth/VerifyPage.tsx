import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthServices } from "@/services/user-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
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
        setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>
            {status === "loading"
              ? "Verifying Your Account..."
              : "Verification Status"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p>Verifying your email...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Success!</h3>
                <p className="text-muted-foreground">
                  Your account is now active. Redirecting to login...
                </p>
              </div>
              <Button onClick={() => navigate("/login")}>Login Now</Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Verification Failed</h3>
                <p className="text-muted-foreground">
                  The token is invalid or has expired.
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
