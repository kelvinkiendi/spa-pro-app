import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Star,
  Scissors,
  Calendar,
  Check,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppSettings } from "@/hooks/useAppSettings";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import bookingBg from "@/assets/booking-background.jpg";

const services = [
  { id: "classic-mani", name: "Classic Manicure", duration: "30 min", durationMin: 30, price: 35, category: "Manicure" },
  { id: "gel-mani", name: "Gel Manicure", duration: "45 min", durationMin: 45, price: 55, category: "Manicure" },
  { id: "acrylic-full", name: "Acrylic Full Set", duration: "90 min", durationMin: 90, price: 120, category: "Extensions" },
  { id: "classic-pedi", name: "Classic Pedicure", duration: "45 min", durationMin: 45, price: 45, category: "Pedicure" },
  { id: "deluxe-pedi", name: "Deluxe Pedicure", duration: "60 min", durationMin: 60, price: 75, category: "Pedicure" },
  { id: "nail-art", name: "Nail Art Design", duration: "30 min", durationMin: 30, price: 40, category: "Add-on" },
  { id: "dip-powder", name: "Dip Powder Manicure", duration: "60 min", durationMin: 60, price: 65, category: "Manicure" },
  { id: "full-spa", name: "Full Spa Package", duration: "120 min", durationMin: 120, price: 180, category: "Package" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30",
];

const formatTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const steps = ["Branch", "Services", "Technician", "Date & Time", "Details"];

const ClientBooking = () => {
  const { settings } = useAppSettings();
  const [step, setStep] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ name: "", phone: "", email: "" });
  const [booked, setBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch branches from DB
  const { data: branches = [] } = useQuery({
    queryKey: ["public-branches"],
    queryFn: async () => {
      const { data, error } = await supabase.from("branches").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch techs for selected branch
  const { data: technicians = [] } = useQuery({
    queryKey: ["public-techs", selectedBranch],
    enabled: !!selectedBranch,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, full_name, branch")
        .eq("branch", selectedBranch!);
      if (error) throw error;
      // Filter to nail_techs via user_roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "nail_tech");
      const techUserIds = new Set((roles ?? []).map((r) => r.user_id));
      return data.filter((p) => techUserIds.has(p.user_id));
    },
  });

  const total = useMemo(
    () => selectedServices.reduce((sum, id) => {
      const s = services.find((sv) => sv.id === id);
      return sum + (s?.price || 0);
    }, 0),
    [selectedServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, id) => {
      const s = services.find((sv) => sv.id === id);
      return sum + (s?.durationMin || 0);
    }, 0),
    [selectedServices]
  );

  const canNext = () => {
    switch (step) {
      case 0: return selectedBranch !== null;
      case 1: return selectedServices.length > 0;
      case 2: return selectedTech !== null;
      case 3: return selectedTime !== null;
      case 4: return clientInfo.name && clientInfo.phone;
      default: return false;
    }
  };

  const handleBook = async () => {
    setSubmitting(true);
    try {
      const serviceNames = selectedServices.map((id) => services.find((s) => s.id === id)?.name).filter(Boolean).join(", ");
      const techName = selectedTech === "any" ? "Any Available" : technicians.find((t) => t.user_id === selectedTech)?.full_name || "Any Available";

      const { error } = await supabase.from("bookings").insert({
        client_name: clientInfo.name,
        client_phone: clientInfo.phone || null,
        service: serviceNames,
        tech_name: techName,
        branch: selectedBranch!,
        booking_date: selectedDate,
        booking_time: selectedTime!,
        duration_minutes: totalDuration,
        status: "pending",
        notes: clientInfo.email ? `Email: ${clientInfo.email}` : null,
      });

      if (error) throw error;
      setBooked(true);
    } catch (err: any) {
      toast({ title: "Booking failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetBooking = () => {
    setBooked(false);
    setStep(0);
    setSelectedBranch(null);
    setSelectedServices([]);
    setSelectedTech(null);
    setSelectedTime(null);
    setClientInfo({ name: "", phone: "", email: "" });
  };

  if (booked) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6">
        <div className="absolute inset-0 z-0">
          <img src={bookingBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md relative z-10">
          <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Booking Confirmed! ✨</h1>
          <p className="mt-3 text-muted-foreground">We've sent a confirmation to your phone. See you soon!</p>
          <Button onClick={resetBooking} className="mt-6 gradient-primary text-primary-foreground">Book Another</Button>
        </motion.div>
      </div>
    );
  }

  const selectedBranchData = branches.find((b) => b.name === selectedBranch);

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={bookingBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-background/75 backdrop-blur-[2px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center overflow-hidden">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={settings.app_name} className="h-full w-full object-contain" />
              ) : (
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              )}
            </div>
            <span className="font-display font-bold text-lg text-foreground">{settings.app_name}</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Staff Login</Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 relative z-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 rounded ${i < step ? "gradient-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {/* Step 0: Branch */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Choose Your Spa Location</h2>
                <p className="text-muted-foreground text-center mb-8">Select the branch nearest to you</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranch(b.name)}
                      className={`rounded-xl border p-5 text-left transition-all hover:shadow-elevated ${
                        selectedBranch === b.name ? "border-primary shadow-soft bg-blush" : "bg-card/90 backdrop-blur-md"
                      }`}
                    >
                      <h3 className="font-semibold text-card-foreground">{b.name}</h3>
                      {b.address && <p className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{b.address}</p>}
                      {b.phone && <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{b.phone}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Services */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Select Your Services</h2>
                <p className="text-muted-foreground text-center mb-8">Choose one or more services</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedServices((prev) => prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id])}
                      className={`rounded-xl border p-4 text-left transition-all flex items-center justify-between ${
                        selectedServices.includes(s.id) ? "border-primary shadow-soft bg-blush" : "bg-card/90 backdrop-blur-md hover:shadow-card"
                      }`}
                    >
                      <div>
                        <h3 className="font-semibold text-card-foreground text-sm">{s.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.duration} · {s.category}</p>
                      </div>
                      <span className="font-display font-bold text-primary">${s.price}</span>
                    </button>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <p className="text-center mt-4 text-sm font-medium text-foreground">
                    Total: <span className="text-primary font-bold">${total}</span>
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Technician */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Pick Your Nail Tech</h2>
                <p className="text-muted-foreground text-center mb-8">Or let us assign the best available</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedTech("any")}
                    className={`rounded-xl border p-5 text-center transition-all ${
                      selectedTech === "any" ? "border-primary shadow-soft bg-blush" : "bg-card/90 backdrop-blur-md hover:shadow-card"
                    }`}
                  >
                    <Scissors className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-card-foreground mt-3">Any Available</h3>
                    <p className="text-xs text-muted-foreground mt-1">First available technician</p>
                  </button>
                  {technicians.map((t) => (
                    <button
                      key={t.user_id}
                      onClick={() => setSelectedTech(t.user_id)}
                      className={`rounded-xl border p-5 text-center transition-all ${
                        selectedTech === t.user_id ? "border-primary shadow-soft bg-blush" : "bg-card/90 backdrop-blur-md hover:shadow-card"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center text-lg font-bold mx-auto text-foreground">
                        {t.full_name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-card-foreground mt-3">{t.full_name}</h3>
                      <p className="text-xs text-muted-foreground">{t.branch}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Choose Date & Time</h2>
                <p className="text-muted-foreground text-center mb-8">Select your preferred appointment slot</p>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <Input
                    type="date"
                    value={selectedDate}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto bg-card/90"
                  />
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-lg mx-auto">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`rounded-lg border py-2.5 px-3 text-sm font-medium transition-all ${
                        selectedTime === t ? "gradient-primary text-primary-foreground border-primary" : "bg-card/90 text-card-foreground hover:border-primary/50"
                      }`}
                    >
                      {formatTime(t)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {step === 4 && (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">Your Details</h2>
                <p className="text-muted-foreground text-center mb-8">No account needed — just your contact info</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <Input value={clientInfo.name} onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })} placeholder="Jane Doe" className="bg-card/90" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                    <Input value={clientInfo.phone} onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })} placeholder="(555) 123-4567" className="bg-card/90" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email (optional)</label>
                    <Input value={clientInfo.email} onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })} placeholder="jane@email.com" className="bg-card/90" />
                  </div>

                  <div className="mt-6 rounded-xl bg-card/90 backdrop-blur-md border p-4 space-y-2 text-sm">
                    <h4 className="font-display font-semibold text-foreground">Booking Summary</h4>
                    <p className="text-muted-foreground">{selectedBranch}</p>
                    <p className="text-muted-foreground">
                      {selectedServices.map((id) => services.find((s) => s.id === id)?.name).join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedTech === "any" ? "Any Available" : technicians.find((t) => t.user_id === selectedTech)?.full_name} · {selectedTime && formatTime(selectedTime)} · {selectedDate}
                    </p>
                    <p className="font-display font-bold text-primary text-lg">Total: ${total}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="gap-1 bg-card/90">
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gradient-primary text-primary-foreground gap-1">
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleBook} disabled={!canNext() || submitting} className="gradient-primary text-primary-foreground gap-1">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {submitting ? "Booking..." : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
