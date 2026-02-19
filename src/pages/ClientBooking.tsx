import { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const branches = [
  { id: 1, name: "GlowSpa Downtown", address: "123 Main St, City Center", hours: "9AM - 7PM" },
  { id: 2, name: "GlowSpa Westside", address: "456 Oak Ave, Westside Mall", hours: "10AM - 8PM" },
  { id: 3, name: "GlowSpa Marina", address: "789 Beach Blvd, Marina District", hours: "9AM - 6PM" },
];

const services = [
  { id: 1, name: "Classic Manicure", duration: "30 min", price: 35, category: "Manicure" },
  { id: 2, name: "Gel Manicure", duration: "45 min", price: 55, category: "Manicure" },
  { id: 3, name: "Acrylic Full Set", duration: "90 min", price: 120, category: "Extensions" },
  { id: 4, name: "Classic Pedicure", duration: "45 min", price: 45, category: "Pedicure" },
  { id: 5, name: "Deluxe Pedicure", duration: "60 min", price: 75, category: "Pedicure" },
  { id: 6, name: "Nail Art Design", duration: "30 min", price: 40, category: "Add-on" },
  { id: 7, name: "Dip Powder Manicure", duration: "60 min", price: 65, category: "Manicure" },
  { id: 8, name: "Full Spa Package", duration: "120 min", price: 180, category: "Package" },
];

const technicians = [
  { id: 1, name: "Lisa M.", specialty: "Gel & Nail Art", rating: 4.9 },
  { id: 2, name: "Maria S.", specialty: "Pedicure", rating: 4.8 },
  { id: 3, name: "Tina R.", specialty: "Acrylic", rating: 4.7 },
  { id: 4, name: "Jade W.", specialty: "Spa Treatments", rating: 4.9 },
  { id: 5, name: "Amy L.", specialty: "Dip Powder", rating: 4.6 },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM",
  "3:30 PM", "4:00 PM", "4:30 PM",
];

const steps = ["Branch", "Services", "Technician", "Date & Time", "Details"];

const ClientBooking = () => {
  const [step, setStep] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedTech, setSelectedTech] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState({ name: "", phone: "", email: "" });
  const [booked, setBooked] = useState(false);

  const total = selectedServices.reduce((sum, id) => {
    const s = services.find((sv) => sv.id === id);
    return sum + (s?.price || 0);
  }, 0);

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

  const handleBook = () => setBooked(true);

  if (booked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Booking Confirmed! ✨</h1>
          <p className="mt-3 text-muted-foreground">
            We've sent a confirmation to your phone. See you soon!
          </p>
          <Button onClick={() => { setBooked(false); setStep(0); setSelectedBranch(null); setSelectedServices([]); setSelectedTech(null); setSelectedTime(null); }} className="mt-6 gradient-primary text-primary-foreground">
            Book Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">GlowSpa</span>
          </div>
          <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Admin Login
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-8 rounded ${i < step ? "gradient-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 0: Branch */}
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Choose Your Spa Location
                </h2>
                <p className="text-muted-foreground text-center mb-8">Select the branch nearest to you</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBranch(b.id)}
                      className={`rounded-xl border p-5 text-left transition-all hover:shadow-elevated ${
                        selectedBranch === b.id ? "border-primary shadow-soft bg-blush" : "bg-card"
                      }`}
                    >
                      <h3 className="font-semibold text-card-foreground">{b.name}</h3>
                      <p className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />{b.address}
                      </p>
                      <p className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />{b.hours}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Services */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Select Your Services
                </h2>
                <p className="text-muted-foreground text-center mb-8">Choose one or more services</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() =>
                        setSelectedServices((prev) =>
                          prev.includes(s.id)
                            ? prev.filter((id) => id !== s.id)
                            : [...prev, s.id]
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition-all flex items-center justify-between ${
                        selectedServices.includes(s.id) ? "border-primary shadow-soft bg-blush" : "bg-card hover:shadow-card"
                      }`}
                    >
                      <div>
                        <h3 className="font-semibold text-card-foreground text-sm">{s.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {s.duration} · {s.category}
                        </p>
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
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Pick Your Nail Tech
                </h2>
                <p className="text-muted-foreground text-center mb-8">Or let us assign the best available</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedTech(0)}
                    className={`rounded-xl border p-5 text-center transition-all ${
                      selectedTech === 0 ? "border-primary shadow-soft bg-blush" : "bg-card hover:shadow-card"
                    }`}
                  >
                    <Scissors className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-card-foreground mt-3">Any Available</h3>
                    <p className="text-xs text-muted-foreground mt-1">First available technician</p>
                  </button>
                  {technicians.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTech(t.id)}
                      className={`rounded-xl border p-5 text-center transition-all ${
                        selectedTech === t.id ? "border-primary shadow-soft bg-blush" : "bg-card hover:shadow-card"
                      }`}
                    >
                      <div className="h-12 w-12 rounded-full gradient-gold flex items-center justify-center text-lg font-bold mx-auto text-foreground">
                        {t.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-card-foreground mt-3">{t.name}</h3>
                      <p className="text-xs text-muted-foreground">{t.specialty}</p>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                        <span className="text-xs font-medium">{t.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Choose Date & Time
                </h2>
                <p className="text-muted-foreground text-center mb-8">Available slots for today</p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="font-display font-semibold text-lg">Wednesday, Feb 19, 2026</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-w-lg mx-auto">
                  {timeSlots.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`rounded-lg border py-2.5 px-3 text-sm font-medium transition-all ${
                        selectedTime === t ? "gradient-primary text-primary-foreground border-primary" : "bg-card text-card-foreground hover:border-primary/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {step === 4 && (
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-display font-bold text-foreground text-center mb-2">
                  Your Details
                </h2>
                <p className="text-muted-foreground text-center mb-8">No account needed — just your contact info</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                    <Input value={clientInfo.name} onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Phone Number *</label>
                    <Input value={clientInfo.phone} onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email (optional)</label>
                    <Input value={clientInfo.email} onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })} placeholder="jane@email.com" />
                  </div>

                  {/* Summary */}
                  <div className="mt-6 rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                    <h4 className="font-display font-semibold text-foreground">Booking Summary</h4>
                    <p className="text-muted-foreground">
                      {branches.find((b) => b.id === selectedBranch)?.name}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedServices.map((id) => services.find((s) => s.id === id)?.name).join(", ")}
                    </p>
                    <p className="text-muted-foreground">
                      {selectedTech === 0 ? "Any Available" : technicians.find((t) => t.id === selectedTech)?.name} · {selectedTime}
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
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < 4 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="gradient-primary text-primary-foreground gap-1"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleBook}
              disabled={!canNext()}
              className="gradient-primary text-primary-foreground gap-1"
            >
              Confirm Booking <Check className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientBooking;
