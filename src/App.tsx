import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Public
import ClientBooking from "./pages/ClientBooking";
import NotFound from "./pages/NotFound";

// Auth pages
import AdminLogin from "./pages/auth/AdminLogin";
import ManagerLogin from "./pages/auth/ManagerLogin";
import TechLogin from "./pages/auth/TechLogin";

// Admin
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

// Manager
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerBookings from "./pages/manager/Bookings";
import ManagerScheduling from "./pages/manager/Scheduling";
import Attendance from "./pages/manager/Attendance";
import WalkIns from "./pages/manager/WalkIns";
import ManagerClients from "./pages/manager/Clients";

// Tech
import TechDashboard from "./pages/tech/Dashboard";
import TechBookings from "./pages/tech/Bookings";
import TechSales from "./pages/tech/Sales";
import TechCommission from "./pages/tech/Commission";
import TechRatings from "./pages/tech/Ratings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<ClientBooking />} />

            {/* Login pages */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/manager-login" element={<ManagerLogin />} />
            <Route path="/tech-login" element={<TechLogin />} />

            {/* Admin routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Bookings /></ProtectedRoute>} />
            <Route path="/admin/technicians" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Technicians /></ProtectedRoute>} />
            <Route path="/admin/clients" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Clients /></ProtectedRoute>} />
            <Route path="/admin/inventory" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Inventory /></ProtectedRoute>} />
            <Route path="/admin/finances" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Finances /></ProtectedRoute>} />
            <Route path="/admin/loyalty" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Loyalty /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Analytics /></ProtectedRoute>} />
            <Route path="/admin/scheduling" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Scheduling /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Reports /></ProtectedRoute>} />
            <Route path="/admin/reminders" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><Reminders /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><AdminSettings /></ProtectedRoute>} />

            {/* Manager routes */}
            <Route path="/manager" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/bookings" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><ManagerBookings /></ProtectedRoute>} />
            <Route path="/manager/scheduling" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><ManagerScheduling /></ProtectedRoute>} />
            <Route path="/manager/attendance" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><Attendance /></ProtectedRoute>} />
            <Route path="/manager/walkins" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><WalkIns /></ProtectedRoute>} />
            <Route path="/manager/clients" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><ManagerClients /></ProtectedRoute>} />

            {/* Tech routes */}
            <Route path="/tech" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechDashboard /></ProtectedRoute>} />
            <Route path="/tech/bookings" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechBookings /></ProtectedRoute>} />
            <Route path="/tech/sales" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechSales /></ProtectedRoute>} />
            <Route path="/tech/commission" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechCommission /></ProtectedRoute>} />
            <Route path="/tech/ratings" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechRatings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
