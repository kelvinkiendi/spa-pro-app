import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AppSettingsProvider } from "@/hooks/useAppSettings";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { BranchFilterProvider } from "@/contexts/BranchFilterContext";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages for fast initial load
const Index = lazy(() => import("./pages/Index"));
const ClientBooking = lazy(() => import("./pages/ClientBooking"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));
const ManagerLogin = lazy(() => import("./pages/auth/ManagerLogin"));
const TechLogin = lazy(() => import("./pages/auth/TechLogin"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Bookings = lazy(() => import("./pages/admin/Bookings"));
const Technicians = lazy(() => import("./pages/admin/Technicians"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const Inventory = lazy(() => import("./pages/admin/Inventory"));
const Finances = lazy(() => import("./pages/admin/Finances"));
const Loyalty = lazy(() => import("./pages/admin/Loyalty"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const Scheduling = lazy(() => import("./pages/admin/Scheduling"));
const AdminServices = lazy(() => import("./pages/admin/Services"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Reminders = lazy(() => import("./pages/admin/Reminders"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

const ManagerDashboard = lazy(() => import("./pages/manager/Dashboard"));
const ManagerBookings = lazy(() => import("./pages/manager/Bookings"));
const ManagerScheduling = lazy(() => import("./pages/manager/Scheduling"));
const Attendance = lazy(() => import("./pages/manager/Attendance"));
const WalkIns = lazy(() => import("./pages/manager/WalkIns"));
const ManagerClients = lazy(() => import("./pages/manager/Clients"));
const ManagerInventory = lazy(() => import("./pages/manager/Inventory"));

const TechDashboard = lazy(() => import("./pages/tech/Dashboard"));
const TechBookings = lazy(() => import("./pages/tech/Bookings"));
const TechSales = lazy(() => import("./pages/tech/Sales"));
const TechCommission = lazy(() => import("./pages/tech/Commission"));
const TechRatings = lazy(() => import("./pages/tech/Ratings"));
const TechSchedule = lazy(() => import("./pages/tech/Schedule"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppSettingsProvider>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Index />} />
              <Route path="/book" element={<ClientBooking />} />

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
              <Route path="/admin/services" element={<ProtectedRoute allowedRoles={["admin"]} loginPath="/admin-login"><AdminServices /></ProtectedRoute>} />
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
              <Route path="/manager/inventory" element={<ProtectedRoute allowedRoles={["branch_manager"]} loginPath="/manager-login"><ManagerInventory /></ProtectedRoute>} />

              {/* Tech routes */}
              <Route path="/tech" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechDashboard /></ProtectedRoute>} />
              <Route path="/tech/bookings" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechBookings /></ProtectedRoute>} />
              <Route path="/tech/sales" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechSales /></ProtectedRoute>} />
              <Route path="/tech/commission" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechCommission /></ProtectedRoute>} />
              <Route path="/tech/ratings" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechRatings /></ProtectedRoute>} />
              <Route path="/tech/schedule" element={<ProtectedRoute allowedRoles={["nail_tech"]} loginPath="/tech-login"><TechSchedule /></ProtectedRoute>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
        </AppSettingsProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
