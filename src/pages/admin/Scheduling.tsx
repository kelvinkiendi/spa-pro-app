import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, Plus, Clock, UserCheck, CalendarOff,
  Check, X, ChevronLeft, ChevronRight,
} from "lucide-react";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Techs are fetched from profiles

type Schedule = {
  id: string;
  tech_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  branch: string;
};

type TimeOffRequest = {
  id: string;
  tech_name: string;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: string;
  manager_notes: string | null;
  created_at: string;
};

const Scheduling = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showAddTimeOff, setShowAddTimeOff] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string>("all");

  // Add schedule form
  const [newSchedule, setNewSchedule] = useState({
    tech_name: TECHS[0],
    day_of_week: 1,
    start_time: "09:00",
    end_time: "17:00",
    is_available: true,
    branch: "main",
  });

  // Time-off form
  const [newTimeOff, setNewTimeOff] = useState({
    tech_name: TECHS[0],
    start_date: undefined as Date | undefined,
    end_date: undefined as Date | undefined,
    reason: "",
  });

  const fetchSchedules = async () => {
    const { data } = await supabase.from("staff_schedules").select("*").order("day_of_week");
    if (data) setSchedules(data as Schedule[]);
  };

  const fetchTimeOff = async () => {
    const { data } = await supabase.from("time_off_requests").select("*").order("created_at", { ascending: false });
    if (data) setTimeOffRequests(data as TimeOffRequest[]);
  };

  useEffect(() => {
    fetchSchedules();
    fetchTimeOff();
  }, []);

  const addSchedule = async () => {
    const { error } = await supabase.from("staff_schedules").insert([newSchedule]);
    if (error) { toast.error("Failed to add schedule"); return; }
    toast.success("Schedule added");
    setShowAddSchedule(false);
    fetchSchedules();
  };

  const addTimeOff = async () => {
    if (!newTimeOff.start_date || !newTimeOff.end_date) { toast.error("Select dates"); return; }
    const { error } = await supabase.from("time_off_requests").insert([{
      tech_name: newTimeOff.tech_name,
      start_date: format(newTimeOff.start_date, "yyyy-MM-dd"),
      end_date: format(newTimeOff.end_date, "yyyy-MM-dd"),
      reason: newTimeOff.reason || null,
    }]);
    if (error) { toast.error("Failed to submit request"); return; }
    toast.success("Time-off request submitted");
    setShowAddTimeOff(false);
    fetchTimeOff();
  };

  const updateTimeOffStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("time_off_requests").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Request ${status}`);
    fetchTimeOff();
  };

  const deleteSchedule = async (id: string) => {
    await supabase.from("staff_schedules").delete().eq("id", id);
    toast.success("Schedule removed");
    fetchSchedules();
  };

  const filteredSchedules = selectedTech === "all" ? schedules : schedules.filter(s => s.tech_name === selectedTech);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Staff Scheduling</h1>
            <p className="text-muted-foreground mt-1">Manage work schedules, availability, and time-off requests</p>
          </div>
        </div>

        <Tabs defaultValue="schedules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedules" className="gap-2"><Clock className="h-4 w-4" />Weekly Schedules</TabsTrigger>
            <TabsTrigger value="timeoff" className="gap-2"><CalendarOff className="h-4 w-4" />Time-Off Requests</TabsTrigger>
            <TabsTrigger value="overview" className="gap-2"><UserCheck className="h-4 w-4" />Team Overview</TabsTrigger>
          </TabsList>

          {/* WEEKLY SCHEDULES */}
          <TabsContent value="schedules" className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {TECHS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              <Dialog open={showAddSchedule} onOpenChange={setShowAddSchedule}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="h-4 w-4" />Add Schedule</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Weekly Schedule</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Technician</Label>
                      <Select value={newSchedule.tech_name} onValueChange={v => setNewSchedule(p => ({ ...p, tech_name: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{TECHS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Day of Week</Label>
                      <Select value={String(newSchedule.day_of_week)} onValueChange={v => setNewSchedule(p => ({ ...p, day_of_week: Number(v) }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{DAYS.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Time</Label>
                        <Input type="time" value={newSchedule.start_time} onChange={e => setNewSchedule(p => ({ ...p, start_time: e.target.value }))} />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input type="time" value={newSchedule.end_time} onChange={e => setNewSchedule(p => ({ ...p, end_time: e.target.value }))} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={newSchedule.is_available} onCheckedChange={v => setNewSchedule(p => ({ ...p, is_available: v }))} />
                      <Label>Available for Bookings</Label>
                    </div>
                    <Button onClick={addSchedule} className="w-full gradient-primary text-primary-foreground">Save Schedule</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Schedule Grid */}
            <div className="rounded-xl bg-card shadow-card border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">Technician</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">Day</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">Hours</th>
                      <th className="p-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="p-3 text-right text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchedules.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No schedules configured. Add a weekly schedule to get started.</td></tr>
                    ) : filteredSchedules.map(s => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-3 font-medium text-card-foreground">{s.tech_name}</td>
                        <td className="p-3 text-card-foreground">{DAYS[s.day_of_week]}</td>
                        <td className="p-3 text-card-foreground">{s.start_time.slice(0, 5)} – {s.end_time.slice(0, 5)}</td>
                        <td className="p-3">
                          <Badge variant={s.is_available ? "default" : "secondary"} className={s.is_available ? "bg-sage/20 text-sage border-sage/30" : ""}>
                            {s.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button variant="ghost" size="sm" onClick={() => deleteSchedule(s.id)} className="text-destructive hover:text-destructive">Remove</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* TIME-OFF REQUESTS */}
          <TabsContent value="timeoff" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={showAddTimeOff} onOpenChange={setShowAddTimeOff}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="h-4 w-4" />Request Time Off</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Request Time Off</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Technician</Label>
                      <Select value={newTimeOff.tech_name} onValueChange={v => setNewTimeOff(p => ({ ...p, tech_name: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{TECHS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newTimeOff.start_date && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTimeOff.start_date ? format(newTimeOff.start_date, "PPP") : "Pick date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newTimeOff.start_date} onSelect={d => setNewTimeOff(p => ({ ...p, start_date: d }))} className="pointer-events-auto" /></PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !newTimeOff.end_date && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {newTimeOff.end_date ? format(newTimeOff.end_date, "PPP") : "Pick date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newTimeOff.end_date} onSelect={d => setNewTimeOff(p => ({ ...p, end_date: d }))} className="pointer-events-auto" /></PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Textarea value={newTimeOff.reason} onChange={e => setNewTimeOff(p => ({ ...p, reason: e.target.value }))} placeholder="Optional reason..." />
                    </div>
                    <Button onClick={addTimeOff} className="w-full gradient-primary text-primary-foreground">Submit Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {timeOffRequests.length === 0 ? (
                <div className="rounded-xl bg-card p-8 shadow-card border text-center text-muted-foreground">No time-off requests yet.</div>
              ) : timeOffRequests.map(r => (
                <div key={r.id} className="rounded-xl bg-card p-5 shadow-card border animate-fade-in">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <h3 className="font-semibold text-card-foreground">{r.tech_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{r.start_date} → {r.end_date}</p>
                      {r.reason && <p className="text-sm text-muted-foreground mt-1">Reason: {r.reason}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.status === "approved" ? "default" : r.status === "denied" ? "destructive" : "secondary"}
                        className={r.status === "approved" ? "bg-sage/20 text-sage border-sage/30" : r.status === "pending" ? "bg-champagne text-accent border-accent/30" : ""}>
                        {r.status}
                      </Badge>
                      {r.status === "pending" && (
                        <div className="flex gap-1 ml-2">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-sage hover:text-sage" onClick={() => updateTimeOffStatus(r.id, "approved")}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => updateTimeOffStatus(r.id, "denied")}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* TEAM OVERVIEW */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {TECHS.map(tech => {
                const techSchedules = schedules.filter(s => s.tech_name === tech);
                const pendingTimeOff = timeOffRequests.filter(r => r.tech_name === tech && r.status === "pending").length;
                const approvedTimeOff = timeOffRequests.filter(r => r.tech_name === tech && r.status === "approved").length;
                const workDays = techSchedules.filter(s => s.is_available).length;

                return (
                  <div key={tech} className="rounded-xl bg-card p-5 shadow-card border animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">{tech.charAt(0)}</div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{tech}</h3>
                        <p className="text-xs text-muted-foreground">{workDays} scheduled days/week</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t">
                      <div className="text-center">
                        <p className="text-lg font-display font-bold text-card-foreground">{workDays}</p>
                        <p className="text-[10px] text-muted-foreground">Work Days</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-display font-bold text-accent">{pendingTimeOff}</p>
                        <p className="text-[10px] text-muted-foreground">Pending</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-display font-bold text-sage">{approvedTimeOff}</p>
                        <p className="text-[10px] text-muted-foreground">Approved</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Scheduling;
