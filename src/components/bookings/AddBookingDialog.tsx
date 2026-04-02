import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { NewBooking } from "@/hooks/useBookings";
import { useBranches } from "@/hooks/useBranches";
import { useServices } from "@/hooks/useServices";

interface AddBookingDialogProps {
  onAdd: (booking: NewBooking) => void;
  isLoading?: boolean;
  defaultTech?: string;
  defaultBranch?: string;
}

export function AddBookingDialog({ onAdd, isLoading, defaultTech, defaultBranch }: AddBookingDialogProps) {
  const [open, setOpen] = useState(false);
  const { branchNames } = useBranches();
  const [form, setForm] = useState<NewBooking>({
    client_name: "",
    client_phone: "",
    service: "",
    tech_name: defaultTech ?? "",
    branch: defaultBranch ?? "",
    booking_date: "",
    booking_time: "",
    duration_minutes: 60,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(form);
    setOpen(false);
    setForm({ client_name: "", client_phone: "", service: "", tech_name: defaultTech ?? "", branch: defaultBranch ?? "", booking_date: "", booking_time: "", duration_minutes: 60, notes: "" });
  };

  const update = (key: keyof NewBooking, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" />New Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client Name *</Label>
              <Input required value={form.client_name} onChange={(e) => update("client_name", e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.client_phone} onChange={(e) => update("client_phone", e.target.value)} placeholder="+254..." />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Service *</Label>
            <Select required value={form.service} onValueChange={(v) => update("service", v)}>
              <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
              <SelectContent>
                {services.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {!defaultTech && (
            <div className="space-y-2">
              <Label>Technician *</Label>
              <Input required value={form.tech_name} onChange={(e) => update("tech_name", e.target.value)} placeholder="Tech name" />
            </div>
          )}

          {!defaultBranch && (
            <div className="space-y-2">
              <Label>Branch *</Label>
              <Select required value={form.branch || ""} onValueChange={(v) => update("branch", v)}>
                <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                <SelectContent>
                  {branchNames.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" required value={form.booking_date} onChange={(e) => update("booking_date", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Time *</Label>
              <Input type="time" required value={form.booking_time} onChange={(e) => update("booking_time", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input type="number" min={15} step={15} value={form.duration_minutes} onChange={(e) => update("duration_minutes", Number(e.target.value))} />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Any special requests..." rows={2} />
          </div>

          <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
