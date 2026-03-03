import { TechLayout } from "@/components/layout/TechLayout";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { AddBookingDialog } from "@/components/bookings/AddBookingDialog";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const TechBookings = () => {
  const { fullName } = useAuth();
  const { bookings, isLoading, addBooking } = useBookings(fullName ?? undefined);

  return (
    <TechLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground mt-1">Appointments assigned to you</p>
          </div>
          <AddBookingDialog onAdd={(b) => addBooking.mutate(b)} isLoading={addBooking.isPending} defaultTech={fullName ?? ""} />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <BookingsTable bookings={bookings} showTech={false} />
        )}
      </div>
    </TechLayout>
  );
};

export default TechBookings;
