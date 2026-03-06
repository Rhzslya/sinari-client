import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserQueries } from "@/hooks/user-queries";
import {
  User,
  Mail,
  ShieldCheck,
  LogOut,
  Loader2,
  ShieldAlert,
  AtSign,
  Hash,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthServices } from "@/services/user-services";
import { ChangePasswordDialog } from "@/features/components/ChangePasswordDialog";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { useProfile } = useUserQueries();
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-primary" />
      </div>
    );

  if (isError || !user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <ShieldAlert className="h-12 w-12 sm:h-16 sm:w-16 text-destructive/50 mb-4" />
        <p className="text-sm sm:text-base">{t("profile.error.title")}</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          {t("profile.error.btn")}
        </Button>
      </div>
    );

  const handleManualLogout = async () => {
    try {
      await AuthServices.logout();
    } catch {
      // Ignore error
    }
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <div className="container mx-auto py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-6xl overflow-hidden">
      <motion.div
        className="mb-8 sm:mb-10 border-b border-border pb-6"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t("profile.header.title")}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          {t("profile.header.subtitle")}
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* KIRI: KARTU AVATAR */}
        <motion.div
          variants={fadeInUp}
          className="w-full md:w-1/3 flex flex-col gap-6 md:sticky md:top-8"
        >
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl sm:text-4xl font-black text-primary tracking-tighter uppercase">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold truncate w-full mb-1">
                {user.name}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate w-full mb-4">
                @{user.username}
              </p>
              <Badge
                variant={user.role === "OWNER" ? "default" : "secondary"}
                className="uppercase tracking-widest font-bold text-foreground text-[10px] sm:text-xs"
              >
                {user.role}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* KANAN: DETAIL INFORMASI */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <motion.div variants={fadeInUp}>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className=" border-b border-border/40 pb-4 p-5 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />{" "}
                  {t("profile.personal_info.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 sm:gap-y-6 gap-x-8">
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5" />{" "}
                      {t("profile.personal_info.name")}
                    </label>
                    <p className="text-sm sm:text-base font-medium text-foreground break-all">
                      {user.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <AtSign className="w-3.5 h-3.5" />{" "}
                      {t("profile.personal_info.username")}
                    </label>
                    <p className="text-sm sm:text-base font-medium text-foreground break-all">
                      {user.username}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5" />{" "}
                      {t("profile.personal_info.email")}
                    </label>
                    <p className="text-sm sm:text-base font-medium text-foreground break-all">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Hash className="w-3.5 h-3.5" />{" "}
                      {t("profile.personal_info.user_id")}
                    </label>
                    <p className="font-mono text-xs sm:text-sm font-medium text-foreground bg-muted px-2 py-0.5 rounded-md w-fit">
                      #{user.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className=" border-b border-border/40 pb-4 p-5 sm:p-6">
                <CardTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />{" "}
                  {t("profile.security.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sm sm:text-base mb-0.5 sm:mb-1">
                    {t("profile.security.change_pwd_title")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("profile.security.change_pwd_desc")}
                  </p>
                </div>
                {user.google_id ? (
                  <Button
                    variant="outline"
                    className="font-bold border-2 shrink-0 opacity-50 cursor-not-allowed w-full sm:w-auto"
                    disabled
                  >
                    <Key className="w-4 h-4 mr-2" />{" "}
                    {t("profile.security.change_pwd_btn")}
                  </Button>
                ) : (
                  <ChangePasswordDialog />
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="border-red-200 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/20 shadow-sm">
              <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="font-bold text-sm sm:text-base text-destructive mb-0.5 sm:mb-1">
                    {t("profile.session.title")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {t("profile.session.desc")}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="font-bold shrink-0 shadow-sm cursor-pointer w-full sm:w-auto"
                  onClick={handleManualLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />{" "}
                  {t("profile.session.logout_btn")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
