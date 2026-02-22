import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  CalendarIcon, Download, FileText, Plus, TrendingUp,
  Users, Scissors, Package, Save,
} from "lucide-react";

const REPORT_TYPES = [
  { value: "revenue", label: "Revenue", icon: TrendingUp },
  { value: "staff_performance", label: "Staff Performance", icon: Users },
  { value: "service_popularity", label: "Service Popularity", icon: Scissors },
  { value: "client_data", label: "Client Data", icon: Users },
  { value: "inventory", label: "Inventory Usage", icon: Package },
];

// Mock data for demonstration
const revenueData = [
  { date: "Feb 1", revenue: 2400, expenses: 800 },
  { date: "Feb 5", revenue: 3100, expenses: 950 },
  { date: "Feb 10", revenue: 2800, expenses: 700 },
  { date: "Feb 15", revenue: 3600, expenses: 1100 },
  { date: "Feb 20", revenue: 4200, expenses: 1300 },
];

const staffData = [
  { name: "Lisa M.", services: 148, revenue: 12400, rating: 4.9 },
  { name: "Maria S.", services: 132, revenue: 10800, rating: 4.8 },
  { name: "Tina R.", services: 118, revenue: 11200, rating: 4.7 },
  { name: "Jade W.", services: 96, revenue: 8600, rating: 4.9 },
  { name: "Amy L.", services: 104, revenue: 9100, rating: 4.6 },
];

const serviceData = [
  { name: "Gel Manicure", count: 245, revenue: 12250 },
  { name: "Pedicure Deluxe", count: 189, revenue: 11340 },
  { name: "Acrylic Full Set", count: 156, revenue: 10920 },
  { name: "Dip Powder", count: 134, revenue: 8040 },
  { name: "Nail Art", count: 98, revenue: 4900 },
];

const PIE_COLORS = [
  "hsl(350, 55%, 55%)", "hsl(25, 60%, 65%)", "hsl(150, 20%, 60%)",
  "hsl(38, 50%, 70%)", "hsl(350, 40%, 70%)",
];

type SavedReport = {
  id: string;
  name: string;
  report_type: string;
  filters: Record<string, unknown>;
  date_range_start: string | null;
  date_range_end: string | null;
  created_at: string;
};

const Reports = () => {
  const [dateFrom, setDateFrom] = useState<Date>(subDays(new Date(), 30));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [reportType, setReportType] = useState("revenue");
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);
  const [showSave, setShowSave] = useState(false);
  const [reportName, setReportName] = useState("");

  const fetchSavedReports = async () => {
    const { data } = await supabase.from("saved_reports").select("*").order("created_at", { ascending: false });
    if (data) setSavedReports(data as SavedReport[]);
  };

  useEffect(() => { fetchSavedReports(); }, []);

  const saveReport = async () => {
    if (!reportName.trim()) { toast.error("Enter a report name"); return; }
    const { error } = await supabase.from("saved_reports").insert([{
      name: reportName,
      report_type: reportType,
      date_range_start: format(dateFrom, "yyyy-MM-dd"),
      date_range_end: format(dateTo, "yyyy-MM-dd"),
      filters: {},
    }]);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Report saved");
    setShowSave(false);
    setReportName("");
    fetchSavedReports();
  };

  const exportCSV = () => {
    let csv = "";
    if (reportType === "revenue") {
      csv = "Date,Revenue,Expenses\n" + revenueData.map(r => `${r.date},${r.revenue},${r.expenses}`).join("\n");
    } else if (reportType === "staff_performance") {
      csv = "Name,Services,Revenue,Rating\n" + staffData.map(s => `${s.name},${s.services},${s.revenue},${s.rating}`).join("\n");
    } else {
      csv = "Service,Count,Revenue\n" + serviceData.map(s => `${s.name},${s.count},${s.revenue}`).join("\n");
    }
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const exportPDF = () => {
    // In production, use a library like jsPDF or server-side generation
    toast.info("PDF export will be available with backend integration. CSV exported instead.");
    exportCSV();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Generate custom reports with detailed insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={exportCSV}><Download className="h-4 w-4" />CSV</Button>
            <Button variant="outline" className="gap-2" onClick={exportPDF}><FileText className="h-4 w-4" />PDF</Button>
            <Dialog open={showSave} onOpenChange={setShowSave}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground gap-2"><Save className="h-4 w-4" />Save Report</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Save Report Configuration</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div><Label>Report Name</Label><Input value={reportName} onChange={e => setReportName(e.target.value)} placeholder="e.g., Monthly Revenue Summary" /></div>
                  <Button onClick={saveReport} className="w-full gradient-primary text-primary-foreground">Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap rounded-xl bg-card p-4 shadow-card border">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2"><CalendarIcon className="h-4 w-4" />{format(dateFrom, "MMM d, yyyy")}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateFrom} onSelect={d => d && setDateFrom(d)} className="pointer-events-auto" /></PopoverContent>
          </Popover>
          <span className="text-muted-foreground">to</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2"><CalendarIcon className="h-4 w-4" />{format(dateTo, "MMM d, yyyy")}</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dateTo} onSelect={d => d && setDateTo(d)} className="pointer-events-auto" /></PopoverContent>
          </Popover>
        </div>

        {/* Report Content */}
        {reportType === "revenue" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-card p-5 shadow-card border">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-display font-bold text-primary mt-1">$16,100</p>
                <p className="text-xs text-sage mt-1">+12.5% vs previous period</p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-card border">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-display font-bold text-accent mt-1">$4,850</p>
                <p className="text-xs text-muted-foreground mt-1">Operating costs</p>
              </div>
              <div className="rounded-xl bg-card p-5 shadow-card border">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-display font-bold text-sage mt-1">$11,250</p>
                <p className="text-xs text-sage mt-1">69.9% margin</p>
              </div>
            </div>
            <div className="rounded-xl bg-card p-5 shadow-card border">
              <h3 className="font-display font-semibold text-card-foreground mb-4">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(350, 55%, 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(25, 60%, 65%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {reportType === "staff_performance" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-card p-5 shadow-card border">
              <h3 className="font-display font-semibold text-card-foreground mb-4">Staff Performance Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={staffData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="services" fill="hsl(350, 55%, 55%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-card shadow-card border overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b bg-muted/30">
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground">Technician</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground">Services</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground">Revenue</th>
                  <th className="p-3 text-left text-xs font-medium text-muted-foreground">Rating</th>
                </tr></thead>
                <tbody>
                  {staffData.map(s => (
                    <tr key={s.name} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium text-card-foreground">{s.name}</td>
                      <td className="p-3 text-card-foreground">{s.services}</td>
                      <td className="p-3 text-primary font-medium">${s.revenue.toLocaleString()}</td>
                      <td className="p-3"><Badge className="bg-sage/20 text-sage border-sage/30">{s.rating}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === "service_popularity" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl bg-card p-5 shadow-card border">
              <h3 className="font-display font-semibold text-card-foreground mb-4">Service Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={serviceData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {serviceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-xl bg-card p-5 shadow-card border">
              <h3 className="font-display font-semibold text-card-foreground mb-4">Revenue by Service</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 20%, 90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(150, 20%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(reportType === "client_data" || reportType === "inventory") && (
          <div className="rounded-xl bg-card p-12 shadow-card border text-center">
            <p className="text-muted-foreground">
              {reportType === "client_data" ? "Client retention, demographics, and visit frequency reports" : "Inventory usage trends, stock movement, and supplier reports"} will populate with real data from the database.
            </p>
          </div>
        )}

        {/* Saved Reports */}
        {savedReports.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-foreground">Saved Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedReports.map(r => (
                <div key={r.id} className="rounded-xl bg-card p-4 shadow-card border cursor-pointer hover:shadow-elevated transition-shadow"
                  onClick={() => { setReportType(r.report_type); if (r.date_range_start) setDateFrom(new Date(r.date_range_start)); if (r.date_range_end) setDateTo(new Date(r.date_range_end)); }}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-card-foreground">{r.name}</h4>
                    <Badge variant="secondary" className="text-xs">{r.report_type.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{r.date_range_start} – {r.date_range_end}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Reports;
