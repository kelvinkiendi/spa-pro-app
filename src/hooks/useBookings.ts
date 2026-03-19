import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Booking {
  id: string;
  client_name: string;
  client_phone: string | null;
  service: string;
  tech_name: string;
  branch: string;
  booking_date: string;
  booking_time: string;
  duration_minutes: number;
  status: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface NewBooking {
  client_name: string;
  client_phone?: string;
  service: string;
  tech_name: string;
  branch?: string;
  booking_date: string;
  booking_time: string;
  duration_minutes?: number;
  status?: string;
  notes?: string;
}

export function useBookings(filterTech?: string, filterBranch?: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["bookings", filterTech, filterBranch],
    queryFn: async () => {
      let q = supabase.from("bookings").select("*").order("booking_date", { ascending: true }).order("booking_time", { ascending: true });
      if (filterTech) q = q.eq("tech_name", filterTech);
      if (filterBranch && filterBranch !== "all") q = q.eq("branch", filterBranch);
      const { data, error } = await q;
      if (error) throw error;
      return data as Booking[];
    },
  });

  const addBooking = useMutation({
    mutationFn: async (booking: NewBooking) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("bookings").insert({ ...booking, created_by: user?.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({ title: "Booking created", description: "New booking has been added successfully." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return { bookings: query.data ?? [], isLoading: query.isLoading, addBooking };
}
