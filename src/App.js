import { lazy, Suspense } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import PageLoader from "@/components/PageLoader";

// Pages - Lazy loaded for code splitting
const Landing = lazy(() => import("@/pages/Landing"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const SuperAdminDashboard = lazy(() => import("@/pages/SuperAdminDashboard"));
const GymAdminDashboard = lazy(() => import("@/pages/GymAdminDashboard"));

// DevTools - Only loaded in development
const LazyDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools }))
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/gym-admin-dashboard" element={<GymAdminDashboard />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
      {import.meta.env.DEV && (
        <Suspense fallback={null}>
          <LazyDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}

export default App;
