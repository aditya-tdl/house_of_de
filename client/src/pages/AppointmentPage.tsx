import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfDay } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";

interface Slot {
  id: number;
  date: string;
  time: string;
  capacity: number;
  bookedCount: number;
  isBooked: boolean;
}

const shirtTypes = [
  { id: "signature", name: "The Signature", price: "₹15,000", value: 15000 },
  { id: "oxford", name: "The Oxford", price: "₹12,000", value: 12000 },
  { id: "evening", name: "The Evening", price: "₹18,000", value: 18000 },
];

const AppointmentPage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedShirt, setSelectedShirt] = useState<string>("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const { toast } = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const fetchAvailableSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const response = await axiosInstance.get("/slots?available=true");
      if (response.data.success) {
        setSlots(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch slots", error);
      toast({
        title: "Connection Error",
        description: "Could not retrieve available appointment dates.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const availableDates = useMemo(() => {
    const dates = slots.map(slot => startOfDay(new Date(slot.date)).getTime());
    return Array.from(new Set(dates));
  }, [slots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!date) return [];

    const now = new Date();
    const isToday = isSameDay(date, now);

    return slots.filter(slot => {
      if (!isSameDay(new Date(slot.date), date)) return false;

      if (isToday) {
        // Parse "HH:mm AM/PM"
        const [timeRange, period] = slot.time.split(" ");
        let [hours, minutes] = timeRange.split(":").map(Number);

        if (period === "PM" && hours < 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        const slotTime = new Date(now);
        slotTime.setHours(hours, minutes, 0, 0);

        return slotTime > now;
      }

      return true;
    });
  }, [slots, date]);

  useEffect(() => {
    setSelectedSlot(null);
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !selectedSlot || !selectedShirt) {
      toast({
        title: "Please complete all fields",
        description: "Select a date, time, and shirt type to continue.",
        variant: "destructive",
      });
      return;
    }

    const shirt = shirtTypes.find(s => s.id === selectedShirt);

    dispatch(showLoader());

    try {
      const response = await axiosInstance.post("/bookings", {
        slotId: selectedSlot.id,
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        shirtType: shirt?.name,
        price: shirt?.value,
        specialRequests: formData.message,
        appointmentType: "CONSULTATION",
      });

      if (response.data.success) {
        toast({
          title: "Reservation Confirmed",
          description: `Your appointment for ${format(date, "MMMM d")} at ${selectedSlot.time} has been secured.`,
        });

        // Reset form
        setDate(undefined);
        setSelectedSlot(null);
        setSelectedShirt("");
        setFormData({ name: "", email: "", phone: "", message: "" });

        // Refresh available slots
        fetchAvailableSlots();
      }
    } catch (error: any) {
      console.error("Booking failed", error);
      toast({
        title: "Booking Failed",
        description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-6 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-2xl mx-auto"
            >
              <span className="luxury-label block mb-4">Private Consultation</span>
              <h1 className="section-heading mb-6">Book Your Appointment</h1>
              <p className="luxury-text text-muted-foreground">
                Begin your bespoke journey with a private consultation at our atelier.
                Our master tailors will guide you through fabric selection, measurements,
                and design details.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Booking Form */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <form onSubmit={handleSubmit}>
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                {/* Left Column - Calendar & Time */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-serif">Select Date</h3>
                      {isLoadingSlots && <div className="w-4 h-4 border-2 border-primary/20 border-t-primary animate-spin" />}
                    </div>
                    <div className="border border-border p-6 inline-block bg-background">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(d) => {
                          const time = startOfDay(d).getTime();
                          return d < startOfDay(new Date()) || !availableDates.includes(time);
                        }}
                        className="pointer-events-auto"
                      />
                    </div>
                    {!isLoadingSlots && availableDates.length === 0 && (
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-4 italic">
                        No available slots in the current registry.
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-2xl font-serif mb-6">Select Time</h3>
                    <AnimatePresence mode="wait">
                      {!date ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs uppercase tracking-[0.2em] text-muted-foreground italic"
                        >
                          Please select a date to reveal available times.
                        </motion.p>
                      ) : slotsForSelectedDate.length > 0 ? (
                        <motion.div
                          key="slots"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-3 sm:grid-cols-4 gap-3"
                        >
                          {slotsForSelectedDate.map((slot) => (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-3 px-4 text-[10px] uppercase tracking-widest border transition-all duration-300 ${selectedSlot?.id === slot.id
                                ? "bg-foreground text-background border-foreground shadow-lg"
                                : "border-border hover:border-foreground"
                                }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.p
                          key="no-slots"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-destructive uppercase tracking-widest"
                        >
                          No available times for this date.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Right Column - Details */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <div className="mb-10">
                    <h3 className="text-2xl font-serif mb-6">Choose Your Shirt</h3>
                    <div className="space-y-3">
                      {shirtTypes.map((shirt) => (
                        <button
                          key={shirt.id}
                          type="button"
                          onClick={() => setSelectedShirt(shirt.id)}
                          className={`w-full py-4 px-6 text-left border transition-all duration-300 flex justify-between items-center group ${selectedShirt === shirt.id
                            ? "bg-foreground text-background border-foreground shadow-lg"
                            : "border-border hover:border-foreground"
                            }`}
                        >
                          <span className="font-serif italic text-lg">{shirt.name}</span>
                          <span className={`text-[10px] uppercase tracking-widest ${selectedShirt === shirt.id ? "opacity-100" : "opacity-40"}`}>
                            {shirt.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif mb-6">Your Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="luxury-label block mb-2 text-[10px]">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full py-3 px-4 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors text-sm uppercase tracking-wider"
                          placeholder="IDENTIFICATION"
                        />
                      </div>

                      <div>
                        <label className="luxury-label block mb-2 text-[10px]">Phone</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full py-3 px-4 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors text-sm uppercase tracking-wider"
                          placeholder="+91"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="luxury-label block mb-2 text-[10px]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full py-3 px-4 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors text-sm lowercase tracking-wider"
                        placeholder="COORDINATES"
                      />
                    </div>

                    <div>
                      <label className="luxury-label block mb-2 text-[10px]">Specimen Notes (Optional)</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={4}
                        className="w-full py-3 px-4 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors resize-none text-sm italic font-serif"
                        placeholder="Any special requirements..."
                      />
                    </div>

                    <button type="submit" className="luxury-button w-full py-5 text-[10px] uppercase tracking-[0.4em]">
                      Request Reservation
                    </button>

                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground text-center italic mt-4">
                      Confirmation pending architectural approval.
                    </p>
                  </div>
                </motion.div>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage;
