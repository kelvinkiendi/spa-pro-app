import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Bell, Plus, Mail, MessageSquare, Clock, Edit2, Trash2 } from "lucide-react";

const TIMING_OPTIONS = [
  { value: "30", label: "30 minutes before" },
  { value: "60", label: "1 hour before" },
  { value: "120", label: "2 hours before" },
  { value: "360", label: "6 hours before" },
  { value: "720", label: "12 hours before" },
  { value: "1440", label: "24 hours before" },
  { value: "2880", label: "48 hours before" },
  { value: "4320", label: "3 days before" },
];

const TEMPLATE_VARS = ["{{client_name}}", "{{service}}", "{{branch}}", "{{date}}", "{{time}}", "{{tech_name}}"];

type ReminderSetting = {
  id: string;
  reminder_type: string;
  timing_minutes: number;
  is_enabled: boolean;
  message_template: string;
  created_at: string;
};

const Reminders = () => {
  const [reminders, setReminders] = useState<ReminderSetting[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    reminder_type: "email" as string,
    timing_minutes: "1440",
    is_enabled: true,
    message_template: "Hi {{client_name}}, this is a reminder for your {{service}} appointment at {{branch}} on {{date}} at {{time}}.",
  });

  const fetchReminders = async () => {
    const { data } = await supabase.from("reminder_settings").select("*").order("timing_minutes", { ascending: false });
    if (data) setReminders(data as ReminderSetting[]);
  };

  useEffect(() => { fetchReminders(); }, []);

  const resetForm = () => {
    setForm({
      reminder_type: "email",
      timing_minutes: "1440",
      is_enabled: true,
      message_template: "Hi {{client_name}}, this is a reminder for your {{service}} appointment at {{branch}} on {{date}} at {{time}}.",
    });
    setEditingId(null);
  };

  const saveReminder = async () => {
    const payload = {
      reminder_type: form.reminder_type,
      timing_minutes: Number(form.timing_minutes),
      is_enabled: form.is_enabled,
      message_template: form.message_template,
    };

    if (editingId) {
      const { error } = await supabase.from("reminder_settings").update(payload).eq("id", editingId);
      if (error) { toast.error("Failed to update"); return; }
      toast.success("Reminder updated");
    } else {
      const { error } = await supabase.from("reminder_settings").insert([payload]);
      if (error) { toast.error("Failed to create"); return; }
      toast.success("Reminder created");
    }
    setShowAdd(false);
    resetForm();
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    await supabase.from("reminder_settings").delete().eq("id", id);
    toast.success("Reminder deleted");
    fetchReminders();
  };

  const toggleEnabled = async (id: string, enabled: boolean) => {
    await supabase.from("reminder_settings").update({ is_enabled: enabled }).eq("id", id);
    fetchReminders();
  };

  const openEdit = (r: ReminderSetting) => {
    setForm({
      reminder_type: r.reminder_type,
      timing_minutes: String(r.timing_minutes),
      is_enabled: r.is_enabled,
      message_template: r.message_template,
    });
    setEditingId(r.id);
    setShowAdd(true);
  };

  const getTimingLabel = (minutes: number) => {
    const opt = TIMING_OPTIONS.find(o => o.value === String(minutes));
    return opt?.label || `${minutes} minutes before`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Appointment Reminders</h1>
            <p className="text-muted-foreground mt-1">Configure automated SMS and email reminders for your clients</p>
          </div>
          <Dialog open={showAdd} onOpenChange={v => { setShowAdd(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="h-4 w-4" />Add Reminder</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Create"} Reminder</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.reminder_type} onValueChange={v => setForm(p => ({ ...p, reminder_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Timing</Label>
                    <Select value={form.timing_minutes} onValueChange={v => setForm(p => ({ ...p, timing_minutes: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIMING_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Message Template</Label>
                  <Textarea
                    value={form.message_template}
                    onChange={e => setForm(p => ({ ...p, message_template: e.target.value }))}
                    rows={4}
                    placeholder="Type your reminder message..."
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {TEMPLATE_VARS.map(v => (
                      <button key={v} onClick={() => setForm(p => ({ ...p, message_template: p.message_template + " " + v }))}
                        className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.is_enabled} onCheckedChange={v => setForm(p => ({ ...p, is_enabled: v }))} />
                  <Label>Enabled</Label>
                </div>
                <Button onClick={saveReminder} className="w-full gradient-primary text-primary-foreground">
                  {editingId ? "Update" : "Create"} Reminder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Banner */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-card-foreground">How Reminders Work</p>
            <p className="text-xs text-muted-foreground mt-1">
              Configure when and how clients receive reminders. Use template variables like {"{{client_name}}"} and {"{{service}}"} to personalize messages. 
              SMS requires a messaging provider integration (e.g., Twilio). Email reminders work through Cloud backend functions.
            </p>
          </div>
        </div>

        {/* Reminder List */}
        <div className="grid gap-4">
          {reminders.length === 0 ? (
            <div className="rounded-xl bg-card p-8 shadow-card border text-center text-muted-foreground">No reminders configured yet.</div>
          ) : reminders.map(r => (
            <div key={r.id} className={cn("rounded-xl bg-card p-5 shadow-card border animate-fade-in transition-opacity", !r.is_enabled && "opacity-60")}>
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0",
                    r.reminder_type === "email" ? "bg-primary/10 text-primary" : "bg-sage/20 text-sage"
                  )}>
                    {r.reminder_type === "email" ? <Mail className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-card-foreground capitalize">{r.reminder_type} Reminder</h3>
                      <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />{getTimingLabel(r.timing_minutes)}</Badge>
                      <Badge variant={r.is_enabled ? "default" : "secondary"} className={r.is_enabled ? "bg-sage/20 text-sage border-sage/30" : ""}>
                        {r.is_enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 bg-muted/50 rounded-lg p-3 font-mono text-xs leading-relaxed">
                      {r.message_template}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={r.is_enabled} onCheckedChange={v => toggleEnabled(r.id, v)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(r)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteReminder(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reminders;
