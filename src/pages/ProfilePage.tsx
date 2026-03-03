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

const ProfilePage = () => {
  const navigate = useNavigate();
  const { useProfile } = useUserQueries();
  const { data: user, isLoading, isError } = useProfile();

  console.log(user);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (isError || !user)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <ShieldAlert className="h-12 w-12 text-destructive/50 mb-4" />
        <p>Gagal memuat profil.</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Ke Login
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
    <div className="container mx-auto py-8 px-4 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Pengaturan Akun
        </h1>
        <p className="text-muted-foreground mt-1">
          Kelola profil dan preferensi keamanan Anda di sini.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 flex flex-col gap-6 md:sticky md:top-8">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-3xl font-black text-primary tracking-tighter uppercase">
                  {user.name.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl font-bold truncate w-full mb-1">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate w-full mb-4">
                @{user.username}
              </p>
              <Badge
                variant={user.role === "OWNER" ? "default" : "secondary"}
                className="uppercase tracking-widest font-bold text-foreground"
              >
                {user.role}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Detail Informasi
                Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5" /> Nama Lengkap
                  </label>
                  <p className="font-medium text-foreground break-all">
                    {user.name}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <AtSign className="w-3.5 h-3.5" /> Username
                  </label>
                  <p className="font-medium text-foreground break-all">
                    {user.username}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Mail className="w-3.5 h-3.5" /> Email Terdaftar
                  </label>
                  <p className="font-medium text-foreground break-all">
                    {user.email}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mb-1">
                    <Hash className="w-3.5 h-3.5" /> User ID
                  </label>
                  <p className="font-mono font-medium text-foreground bg-muted px-2 py-0.5 rounded-md w-fit">
                    #{user.id}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="bg-muted/10 border-b border-border/40 pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Akses &
                Keamanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold mb-1">Ubah Kata Sandi</p>
                <p className="text-sm text-muted-foreground">
                  Perbarui sandi Anda secara berkala untuk keamanan.
                </p>
              </div>
              {user.google_id ? (
                <Button
                  variant="outline"
                  className="font-bold border-2 shrink-0 opacity-50 cursor-not-allowed"
                  disabled
                >
                  <Key className="w-4 h-4 mr-2" /> Ganti Sandi
                </Button>
              ) : (
                <ChangePasswordDialog />
              )}{" "}
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/20 shadow-sm">
            <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-bold text-destructive mb-1">Sesi Aktif</p>
                <p className="text-sm text-muted-foreground">
                  Keluar dari aplikasi pada perangkat ini.
                </p>
              </div>
              <Button
                variant="destructive"
                className="font-bold shrink-0 shadow-sm"
                onClick={handleManualLogout}
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
