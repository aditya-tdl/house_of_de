import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar as CalendarIcon, Clock, Users, X, Filter } from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";
import axiosInstance from "@/api/axiosInstance";
import ConfirmationModal from "@/components/ConfirmationModal";

interface Slot {
    id: number;
    date: string;
    time: string;
    capacity: number;
    bookedCount: number;
    isBooked: boolean;
    isOutdated: boolean;
    status: string;
}

const SlotsPage = () => {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        date: "",
        hour: "10",
        minute: "00",
        period: "AM",
        capacity: 1
    });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        slotId: null as number | null
    });
    const [activeStatus, setActiveStatus] = useState<"Active" | "Outdated">("Active");
    const [filterDate, setFilterDate] = useState("");
    const dispatch = useDispatch();

    const filteredSlots = useMemo(() => {
        let result = slots;

        // Filter by Status (Active includes Available & Full)
        if (activeStatus === "Active") {
            result = result.filter(slot => slot.status === "Available" || slot.status === "Full");
        } else {
            result = result.filter(slot => slot.status === "Outdated");
        }

        // Filter by Date
        if (filterDate) {
            result = result.filter(slot => {
                const slotDateStr = new Date(slot.date).toISOString().split('T')[0];
                return slotDateStr === filterDate;
            });
        }

        return result;
    }, [slots, activeStatus, filterDate]);

    const groupedSlots = useMemo(() => {
        const groups: { [key: string]: Slot[] } = {};
        filteredSlots.forEach(slot => {
            const dateStr = new Date(slot.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            if (!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(slot);
        });
        return groups;
    }, [filteredSlots]);

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.get("/slots");
            if (response.data.success) {
                setSlots(response.data.data);
            }
        } catch (error: any) {
            toast.error("Failed to fetch slots");
            console.error(error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const addTimeToBuffer = () => {
        const formattedTime = `${formData.hour}:${formData.minute} ${formData.period}`;

        // Prevent duplicates in current buffer
        if (selectedTimes.includes(formattedTime)) {
            toast.error("This time is already selected");
            return;
        }

        // Prevent past times for today
        const now = new Date();
        const selectedDate = new Date(formData.date);
        const isToday = selectedDate.getFullYear() === now.getFullYear() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getDate() === now.getDate();

        if (isToday) {
            let selectedHour24 = parseInt(formData.hour);
            if (formData.period === "PM" && selectedHour24 < 12) selectedHour24 += 12;
            if (formData.period === "AM" && selectedHour24 === 12) selectedHour24 = 0;

            const selectedTimeDate = new Date();
            selectedTimeDate.setHours(selectedHour24, parseInt(formData.minute), 0, 0);

            if (selectedTimeDate < now) {
                toast.error("You cannot select a time in the past");
                return;
            }
        }

        setSelectedTimes([...selectedTimes, formattedTime]);
    };

    const removeTimeFromBuffer = (timeToRemove: string) => {
        setSelectedTimes(selectedTimes.filter(t => t !== timeToRemove));
    };

    const handleCreateSlot = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedTimes.length === 0) {
            toast.error("Please add at least one time slot");
            return;
        }

        dispatch(showLoader());

        try {
            const response = await axiosInstance.post("/slots", {
                date: formData.date,
                times: selectedTimes,
                capacity: formData.capacity
            });
            if (response.data.success) {
                toast.success(response.data.message || "Slots created successfully");
                setShowCreateModal(false);
                setFormData({ date: "", hour: "10", minute: "00", period: "AM", capacity: 1 });
                setSelectedTimes([]);
                fetchSlots();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create slots");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleDeleteSlot = async () => {
        if (!deleteModal.slotId) return;

        dispatch(showLoader());
        try {
            const response = await axiosInstance.delete(`/slots/${deleteModal.slotId}`);
            if (response.data.success) {
                toast.success("Slot deleted successfully");
                fetchSlots();
            }
        } catch (error: any) {
            toast.error("Failed to delete slot");
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span className="luxury-label block mb-2">Registry Orchestration</span>
                    <h1 className="section-heading italic text-3xl md:text-5xl">Time Slots</h1>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Status Tabs */}
                    <div className="flex bg-secondary/20 p-1 border border-border">
                        {(["Active", "Outdated"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatus(status)}
                                className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${activeStatus === status
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={12} />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-transparent border border-border pl-9 pr-3 py-2 text-[10px] uppercase tracking-widest focus:border-foreground outline-none transition-all duration-300 w-full md:w-[160px]"
                        />
                        {filterDate && (
                            <button
                                onClick={() => setFilterDate("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={10} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="luxury-button flex items-center gap-2 py-2 px-6 text-[10px]"
                    >
                        <Plus size={14} />
                        NEW REGISTRY
                    </button>
                </div>
            </div>

            <div className="space-y-16">
                {Object.keys(groupedSlots).length > 0 ? (
                    Object.entries(groupedSlots).map(([date, slots]) => (
                        <div key={date} className="space-y-8">
                            <div className="flex items-center gap-6">
                                <h2 className="text-xl font-serif italic text-foreground/80 shrink-0">{date}</h2>
                                <div className="h-px bg-border w-full opacity-50" />
                                <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground whitespace-nowrap">
                                    {slots.length} Entr{slots.length === 1 ? 'y' : 'ies'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {slots.map((slot, index) => (
                                    <motion.div
                                        key={slot.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-background border border-border p-4 hover:border-foreground transition-all duration-300 group relative"
                                    >
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, slotId: slot.id })}
                                            className="absolute right-2 top-2 text-destructive/80 hover:text-destructive transition-colors duration-300 p-1 hover:bg-destructive/5 rounded-full"
                                        >
                                            <Trash2 size={12} />
                                        </button>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Clock size={16} className="text-foreground/40" />
                                                <span className="text-lg font-serif italic tracking-tight">{slot.time}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                                <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                                                    <Users size={12} />
                                                    <span>{slot.bookedCount} / {slot.capacity}</span>
                                                </div>
                                                <span className={`text-[8px] uppercase tracking-widest px-2 py-1 ${slot.status === "Outdated"
                                                    ? "bg-secondary/30 text-muted-foreground"
                                                    : slot.status === "Full"
                                                        ? "bg-destructive/5 text-destructive"
                                                        : "bg-primary/5 text-primary"
                                                    }`}>
                                                    {slot.status}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-32 text-center border border-dashed border-border flex flex-col items-center">
                        <div className="w-12 h-12 border border-border flex items-center justify-center mb-6 opacity-40">
                            <Clock size={20} className="text-muted-foreground" />
                        </div>
                        <p className="luxury-text text-muted-foreground italic lowercase text-lg">
                            No {activeStatus.toLowerCase()} slots found in the temporal registry.
                        </p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                            onClick={() => setShowCreateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-background border border-border p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute right-4 top-4 md:right-8 md:top-8 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="text-center mb-8 md:mb-10">
                                <span className="luxury-label block mb-2 text-[8px] md:text-[10px]">Scheduling</span>
                                <h2 className="section-heading italic text-2xl md:text-3xl">Create Slot</h2>
                                <div className="luxury-divider mx-auto mt-4 md:mt-6" />
                            </div>

                            <form onSubmit={handleCreateSlot} className="space-y-8">
                                <div className="space-y-2">
                                    <label className="luxury-label text-[10px]">Date</label>
                                    <input
                                        type="date"
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full bg-transparent border-b border-border py-2 text-sm focus:border-foreground outline-none transition-colors"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="luxury-label text-[10px]">Pick Time</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 flex gap-2">
                                                <select
                                                    value={formData.hour}
                                                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                                                    className="w-full bg-transparent border-b border-border py-2 text-center text-sm focus:border-foreground outline-none transition-colors appearance-none cursor-pointer"
                                                >
                                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                                                        <option key={h} className="bg-background" value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
                                                    ))}
                                                </select>
                                                <span className="py-2">:</span>
                                                <select
                                                    value={formData.minute}
                                                    onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                                                    className="w-full bg-transparent border-b border-border py-2 text-center text-sm focus:border-foreground outline-none transition-colors appearance-none cursor-pointer"
                                                >
                                                    {["00", "15", "30", "45"].map(m => (
                                                        <option key={m} className="bg-background" value={m}>{m}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex border border-border">
                                                {["AM", "PM"].map(p => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, period: p })}
                                                        className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all duration-300 ${formData.period === p ? "bg-primary text-primary-foreground" : "hover:bg-secondary text-muted-foreground"
                                                            }`}
                                                    >
                                                        {p}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={addTimeToBuffer}
                                                className="luxury-button py-2 px-4 text-[10px]"
                                            >
                                                ADD
                                            </button>
                                        </div>

                                        {selectedTimes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 p-4 bg-secondary/10 border border-border">
                                                {selectedTimes.map((time, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 bg-background border border-border px-3 py-1 text-[10px] uppercase tracking-widest">
                                                        <span>{time}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTimeFromBuffer(time)}
                                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="luxury-label text-[10px]">Capacity (Per Slot)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                        className="w-full bg-transparent border-b border-border py-2 text-sm focus:border-foreground outline-none transition-colors"
                                    />
                                </div>

                                <button type="submit" className="luxury-button w-full mt-4">
                                    Define {selectedTimes.length > 0 ? selectedTimes.length : ""} Slot(s)
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                title="Deconstruct Slot?"
                message="This will permanently remove this time availability from the collection. This action cannot be undone."
                buttonText="Remove"
                onConfirm={handleDeleteSlot}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
            />
        </div>
    );
};

export default SlotsPage;
