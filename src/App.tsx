import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ClientBooking from "./pages/ClientBooking";
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import Technicians from "./pages/admin/Technicians";
import Clients from "./pages/admin/Clients";
import Inventory from "./pages/admin/Inventory";
import Finances from "./pages/admin/Finances";
import Loyalty from "./pages/admin/Loyalty";
import Analytics from "./pages/admin/Analytics";
import Scheduling from "./pages/admin/Scheduling";
import Reports from "./pages/admin/Reports";
import Reminders from "./pages/admin/Reminders";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Client-facing booking */}
          <Route path="/" element={<ClientBooking />} />

          {/* Admin routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/bookings" element={<Bookings />} />
          <Route path="/admin/technicians" element={<Technicians />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/finances" element={<Finances />} />
          <Route path="/admin/loyalty" element={<Loyalty />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/scheduling" element={<Scheduling />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/reminders" element={<Reminders />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
