import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import { Buffer } from "buffer";

// PDF require buffer
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

window.Buffer = window.Buffer || Buffer;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
      >
        <App />
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
