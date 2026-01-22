import { AuthServices } from "@/services/user-services";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

interface GoogleSignInProps {
  isLoading?: boolean;
}

export const GoogleSignIn = ({ isLoading = false }: GoogleSignInProps) => {
  const navigate = useNavigate();

  const handleSuccess = async (response: CredentialResponse) => {
    const token = response.credential;

    if (!token) {
      console.error("Google Credential is null");
      return;
    }

    try {
      const result = await AuthServices.googleLogin({ token });

      if (result.token) {
        localStorage.setItem("token", result.token);

        navigate("/");
      }
    } catch (error) {
      console.error("Backend Login Failed:", error);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed (Popup closed or Network error)");
  };

  return (
    <div
      className={`w-full flex justify-center mt-4 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
    </div>
  );
};

export default GoogleSignIn;
