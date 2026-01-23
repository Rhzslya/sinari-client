import { RegisterForm } from "@/features/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="relative min-h-svh flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4 z-10">
        <RegisterForm />
      </div>

      <div className="absolute bottom-6 w-full text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sinari Cell. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
