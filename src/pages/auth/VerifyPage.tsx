import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthServices } from "@/services/user-services";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// --- VARIAN ANIMASI ---
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const iconVariants: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -45 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
  exit: { scale: 0, opacity: 0, rotate: 45, transition: { duration: 0.2 } },
};

export default function VerifyPage() {
  const { t } = useTranslation();
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

    AuthServices.verify({ token })
      .then(() => {
        setStatus("success");
        const timeout = setTimeout(() => navigate("/login"), 3000);
        return () => clearTimeout(timeout);
      })
      .catch(() => {
        setStatus("error");
      });
  }, [token, navigate]);

  // Penetapan Warna & Teks Judul Dinamis
  let titleColor = "text-primary";
  let titleText = t("auth.verify_page.loading_title", {
    defaultValue: "Verifying Account...",
  });

  if (status === "success") {
    titleColor = "text-green-600";
    titleText = t("auth.verify_page.success_title", {
      defaultValue: "Account Verified!",
    });
  } else if (status === "error") {
    titleColor = "text-destructive";
    titleText = t("auth.verify_page.error_title", {
      defaultValue: "Verification Failed",
    });
  }

  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center p-4 sm:p-6 bg-secondary-foreground overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

      <motion.div
        className="w-full max-w-md mx-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-card-foreground border-none shadow-2xl shadow-black/10 transition-all duration-500">
          <CardHeader className="pb-2 pt-8 sm:pt-10">
            <CardTitle
              className={`text-center flex flex-col items-center gap-4 text-xl sm:text-2xl font-bold tracking-tight ${titleColor}`}
            >
              <AnimatePresence mode="wait">
                {status === "loading" && (
                  <motion.div
                    key="loading"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-3 sm:p-4 bg-primary/10 rounded-full"
                  >
                    <Loader2
                      className="size-10 sm:size-12 text-primary animate-spin"
                      strokeWidth={2.5}
                    />
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-3 sm:p-4 bg-green-50 rounded-full"
                  >
                    <Check
                      className="size-10 sm:size-12 text-green-600"
                      strokeWidth={3}
                    />
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    key="error"
                    variants={iconVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="p-3 sm:p-4 bg-destructive/10 rounded-full"
                  >
                    <X
                      className="size-10 sm:size-12 text-destructive"
                      strokeWidth={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.span variants={itemVariants}>{titleText}</motion.span>
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center space-y-6 pb-8 sm:pb-10">
            <motion.div
              variants={itemVariants}
              className="text-muted text-xs sm:text-sm leading-relaxed px-2 sm:px-6"
            >
              <AnimatePresence mode="wait">
                {status === "loading" && (
                  <motion.div
                    key="loading-desc"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("auth.verify_page.loading_desc", {
                      defaultValue:
                        "Please wait while we verify your email address. This shouldn't take long.",
                    })}
                  </motion.div>
                )}

                {status === "success" && (
                  <motion.div
                    key="success-desc"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("auth.verify_page.success_desc_1", {
                      defaultValue:
                        "Your email has been successfully verified.",
                    })}
                    <br className="hidden sm:block" />{" "}
                    {t("auth.verify_page.success_desc_2", {
                      defaultValue:
                        "You will be redirected to the login page shortly.",
                    })}
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    key="error-desc"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {t("auth.verify_page.error_desc_1", {
                      defaultValue: "We couldn't verify your account.",
                    })}
                    <br className="hidden sm:block" />{" "}
                    {t("auth.verify_page.error_desc_2", {
                      defaultValue: "The token may be invalid or has expired.",
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  key="btn-success"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="px-4 sm:px-8"
                >
                  <Button
                    className="w-full h-11 sm:h-10 font-semibold shadow-lg shadow-primary/20 transition-all cursor-pointer text-foreground"
                    onClick={() => navigate("/login")}
                  >
                    {t("auth.verify_page.btn_login", {
                      defaultValue: "Login Now",
                    })}
                  </Button>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="btn-error"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="pt-2 px-4 sm:px-8"
                >
                  <button
                    type="button"
                    className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto cursor-pointer outline-none focus-visible:ring-1 rounded px-2 py-1"
                    onClick={() => navigate("/login")}
                  >
                    <ArrowLeft className="size-4" />
                    {t("auth.verify_page.btn_back", {
                      defaultValue: "Back to Login",
                    })}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
