import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/utils";
import { type LoginRequest } from "@/model/auth-model";
import { AuthServices } from "@/services/auth-services";
import { AuthValidation } from "@/validation/auth-validation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

export function LoginForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginRequest>({
    resolver: zodResolver(AuthValidation.LOGIN),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginRequest) {
    setIsLoading(true);
    setGlobalError(null);

    try {
      const result = await AuthServices.login(data);

      localStorage.setItem("token", result.token);
      navigate("/");
    } catch (error) {
      const errorMessage = handleApiError(error);
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sinari Cell</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        {globalError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="size-4" />
            <span>{globalError}</span>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground outline-none"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
