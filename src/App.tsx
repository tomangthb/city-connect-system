
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResidentAuth from "./pages/ResidentAuth";
import ResidentPortal from "./pages/ResidentPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/resident-auth" element={<ResidentAuth />} />
                <Route path="/resident-portal" element={<ResidentPortal />} />
                <Route path="/dashboard" element={<Index />} />
                <Route path="/resources" element={<Index />} />
                <Route path="/services" element={<Index />} />
                <Route path="/services-catalog" element={<Index />} />
                <Route path="/housing-utilities" element={<Index />} />
                <Route path="/permits-registration" element={<Index />} />
                <Route path="/social-services" element={<Index />} />
                <Route path="/transport-traffic" element={<Index />} />
                <Route path="/education" element={<Index />} />
                <Route path="/land-planning" element={<Index />} />
                <Route path="/environmental" element={<Index />} />
                <Route path="/appeals" element={<Index />} />
                <Route path="/documents" element={<Index />} />
                <Route path="/analytics" element={<Index />} />
                <Route path="/administration" element={<Index />} />
                <Route path="/news" element={<Index />} />
                <Route path="/account" element={<Index />} />
                <Route path="/payments" element={<Index />} />
                {/* Resident portal routes */}
                <Route path="/resident-services" element={<ResidentPortal />} />
                <Route path="/resident-appeals" element={<ResidentPortal />} />
                <Route path="/resident-resources" element={<ResidentPortal />} />
                <Route path="/resident-news" element={<ResidentPortal />} />
                <Route path="/resident-account" element={<ResidentPortal />} />
                <Route path="/resident-payments" element={<ResidentPortal />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
