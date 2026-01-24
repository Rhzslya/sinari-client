import { ResetPasswordForm } from "@/features/components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="relative min-h-svh flex items-center justify-center bg-foreground p-4">
      <div className="w-full max-w-md space-y-4 z-10">
        <ResetPasswordForm />
      </div>

      <div className="absolute bottom-6 w-full text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sinari Cell. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
