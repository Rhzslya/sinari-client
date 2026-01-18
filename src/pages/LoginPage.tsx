import { LoginForm } from "@/features/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-svh flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            System Management
          </h1>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Sinari Cell. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
