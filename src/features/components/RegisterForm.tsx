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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleApiError } from "@/lib/utils";
import { type RegisterRequest } from "@/model/user-model";
import { AuthServices } from "@/services/user-services";
import { UserValidation } from "@/validation/user-validation";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckEmailCard } from "./fragments/CheckEmailCard";
import { GoogleSignIn } from "./fragments/GoogleSignIn";

export function RegisterForm() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(UserValidation.REGISTER),
    mode: "all",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(data: RegisterRequest) {
    setIsLoading(true);
    setGlobalError(null);

    try {
      await AuthServices.register(data);

      setIsSuccess(true);
    } catch (error) {
      const errorMessage = handleApiError(error);
      setGlobalError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    console.log("Redirecting to Google...");
  };

  if (isSuccess) {
    return (
      <CheckEmailCard
        onAction={() => navigate("/login")}
        buttonText="Go to Login"
      />
    );
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Sinari Cell</CardTitle>
          <CardDescription className="text-center">
            Create Your Account
          </CardDescription>
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
                name="email"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        placeholder="Email"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 text-xs" />{" "}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 text-xs" />{" "}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative mb-8">
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="absolute -bottom-6 left-0 text-xs" />{" "}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative mb-6">
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
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
                    <FormMessage className="absolute -bottom-6 left-0 text-xs" />{" "}
                  </FormItem>
                )}
              />
              <Button
                variant="outline"
                className="w-full"
                type="submit"
                disabled={!form.formState.isValid || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <GoogleSignIn onClick={handleGoogleLogin} isLoading={isLoading} />
      <Button
        variant="ghost"
        className="w-full"
        type="button"
        onClick={() => navigate("/login")}
      >
        Already Have an Account?<strong>Sign in</strong>
      </Button>
    </>
  );
}
