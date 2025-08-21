import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "@/App.tsx";
import AppLayout from "@/pages/layout.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/trpc/client";
import LoginPage from "@/pages/auth-login";
import RegisterPage from "@/pages/auth-register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="register" element={<RegisterPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="dashboard" element={<AppLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
