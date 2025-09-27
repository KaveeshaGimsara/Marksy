import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { TimerProvider } from "@/context/TimerContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import "@/lib/firebase-config-checker";
import LicensePage from "./components/LicensePage";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HeartbeatLoader from "./components/HeartbeatLoader";

const queryClient = new QueryClient();

const App = () => {
  // Fallback local loader for non-auth async prep if needed later
  const [appReady, setAppReady] = useState(true); // currently immediate

  return (
    <QueryClientProvider client={queryClient}>
      <TimerProvider>
        <TooltipProvider>
          <HeartbeatLoader 
            isLoading={!appReady}
            onLoadingComplete={() => setAppReady(true)}
          />
          {appReady && (
            <>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/license" element={<LicensePage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </>
          )}
        </TooltipProvider>
      </TimerProvider>
    </QueryClientProvider>
  );
}

export default App;
