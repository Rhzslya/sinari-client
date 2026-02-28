import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Key, Loader2, AlertCircle } from "lucide-react";
import { UserValidation } from "@/validation/user-validation";
import { useUserQueries } from "@/hooks/user-queries";
import { getErrorMessage } from "@/lib/utils";

type ChangePasswordRequest = z.infer<typeof UserValidation.CHANGE_PASSWORD>;

export function ChangePasswordDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Toggle visibilitas password
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Ambil mutation dari hook yang sudah kamu buat
  const { changePasswordMutation } = useUserQueries();
  const isLoading = changePasswordMutation.isPending;

  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(UserValidation.CHANGE_PASSWORD),
    mode: "all",
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onSubmit = async (data: ChangePasswordRequest) => {
    setGlobalError(null);
    try {
      await changePasswordMutation.mutateAsync(data);
      form.reset();
      setIsOpen(false);

      // Catatan: Karena backend memutus sesi (Invalidate Token),
      // pengguna mungkin perlu login ulang setelah ini.
      // Jika kamu ingin otomatis logout:
      // localStorage.removeItem("role");
      // window.location.href = "/login";
    } catch (error) {
      const msg = getErrorMessage(error);
      setGlobalError(msg);
    }
  };

  const inputStyle =
    "flex w-full bg-input/50 border border-border rounded-md px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 h-8";
  const labelStyle =
    "text-xs font-semibold text-muted-foreground uppercase tracking-wider";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          form.reset();
          setGlobalError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold border-2 shrink-0">
          <Key className="w-4 h-4 mr-2" /> Ganti Sandi
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Ubah Kata Sandi</DialogTitle>
          <DialogDescription>
            Masukkan kata sandi lama Anda untuk verifikasi, lalu masukkan kata
            sandi baru.
          </DialogDescription>
        </DialogHeader>

        {globalError && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start gap-2 border border-destructive/20 mt-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{globalError}</p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            <FormField
              control={form.control}
              name="old_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>
                    Kata Sandi Saat Ini
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showOld ? "text" : "password"}
                        placeholder="Masukkan sandi lama"
                        disabled={isLoading}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowOld(!showOld)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showOld ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showNew ? "text" : "password"}
                        placeholder="Masukkan sandi baru"
                        disabled={isLoading}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(!showNew)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showNew ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem className="relative grid gap-2 space-y-0">
                  <FormLabel className={labelStyle}>
                    Konfirmasi Kata Sandi Baru
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        autoComplete="off"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Ulangi sandi baru"
                        disabled={isLoading}
                        {...field}
                        className={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute -bottom-4 left-0 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Simpan Sandi
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
