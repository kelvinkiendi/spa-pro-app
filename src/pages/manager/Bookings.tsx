import { ManagerLayout } from "@/components/layout/ManagerLayout";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { AddBookingDialog } from "@/components/bookings/AddBookingDialog";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const ManagerBookings = () => {
  const { branch } = useAuth();
  const { bookings, isLoading, addBooking } = useBookings(undefined, branch || undefined);

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground mt-1">Add, edit, or remove bookings</p>
          </div>
          <AddBookingDialog onAdd={(b) => addBooking.mutate(b)} isLoading={addBooking.isPending} defaultBranch={branch || undefined} />
        </div>
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <BookingsTable bookings={bookings} showActions />
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerBookings;
