import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Edit3,
    MoreHorizontal,
    Download,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
    X
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";
import axiosInstance from "@/api/axiosInstance";

interface Booking {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    price: number;
    appointmentType: string;
    shirtType: string;
    createdAt: string;
    specialRequests?: string;
    slot?: {
        date: string;
        time: string;
    };
}

const BookingsPage = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [searchCategory, setSearchCategory] = useState("all");
    const itemsPerPage = 8;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.get("/bookings");
            // Backend returns { success, data: { bookings, pagination } }
            if (response.data.success) {
                setBookings(response.data.data.bookings);
            }
        } catch (error: any) {
            toast.error("Failed to fetch bookings");
        } finally {
            dispatch(hideLoader());
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.patch(`/bookings/${id}/status`, { status: newStatus });
            if (response.data.success) {
                toast.success(`Booking marked as ${newStatus.toLowerCase()}`);
                fetchBookings();
                setShowUpdateModal(false);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Status update failed");
        } finally {
            dispatch(hideLoader());
        }
    };

    // Client-side filtering logic
    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
                b.fullName.toLowerCase().includes(searchLower) ||
                b.email.toLowerCase().includes(searchLower) ||
                b.phone.toLowerCase().includes(searchLower) ||
                b.status.toLowerCase().includes(searchLower);

            return matchesSearch;
        });
    }, [bookings, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBookings.slice(start, start + itemsPerPage);
    }, [filteredBookings, currentPage]);

    // Statistics
    const stats = useMemo(() => {
        const total = filteredBookings.reduce((sum, b) => sum + (b.status === 'CONFIRMED' ? b.price : 0), 0);
        const count = filteredBookings.length;
        const pending = filteredBookings.filter(b => b.status === 'PENDING').length;
        return { total, count, pending };
    }, [filteredBookings]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-primary/10 text-primary border-primary/20";
            case "PENDING": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "CANCELLED": return "bg-destructive/10 text-destructive border-destructive/20";
            default: return "bg-secondary text-muted-foreground";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "CONFIRMED": return <CheckCircle2 size={12} />;
            case "PENDING": return <Clock size={12} />;
            case "CANCELLED": return <XCircle size={12} />;
            default: return null;
        }
    };

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 on search
    }, [searchTerm]);

    const handleExport = () => {
        if (filteredBookings.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "Client Name", "Email", "Phone", "Date", "Time", "Service", "Style", "Price", "Status", "Created At"];
        const csvContent = [
            headers.join(","),
            ...filteredBookings.map(b => [
                b.id,
                `"${b.fullName}"`,
                b.email,
                b.phone,
                b.slot?.date || "N/A",
                b.slot?.time || "N/A",
                `"${b.appointmentType}"`,
                `"${b.shirtType}"`,
                b.price,
                b.status,
                new Date(b.createdAt).toLocaleDateString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Bookings archive exported successfully");
    };

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header & Stats Summary */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <span className="luxury-label block mb-2">Management</span>
                    <h1 className="section-heading italic text-4xl">Bookings</h1>
                </div>

                <div className="flex items-center justify-around md:justify-start gap-4 md:gap-8 px-4 md:px-8 py-4 border border-border bg-background/50 backdrop-blur-sm overflow-x-auto">
                    <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Revenue</span>
                        <span className="font-serif italic text-lg">₹{stats.total.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Active</span>
                        <span className="font-serif italic text-lg">{stats.count}</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Pending</span>
                        <span className="font-serif italic text-lg text-orange-500">{stats.pending}</span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder="Search by client name, email or mobile..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border pl-12 pr-4 py-3 text-xs uppercase tracking-widest focus:border-foreground outline-none transition-all duration-300"
                    />
                </div>
                <button
                    onClick={handleExport}
                    className="luxury-button flex items-center justify-center gap-2 px-6"
                >
                    <Download size={16} />
                    Export
                </button>
            </div>

            {/* Bookings Table */}
            <div className="bg-background border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Client Details</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Schedule</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Service</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Value</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Status</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedBookings.map((booking, index) => (
                                <motion.tr
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-secondary/20 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-serif italic text-base leading-tight">{booking.fullName}</span>
                                            <span className="text-[10px] text-muted-foreground mt-1 lowercase flex items-center gap-1">
                                                <Mail size={10} /> {booking.email}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        {booking.slot ? (
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase tracking-widest flex items-center gap-2">
                                                    <Calendar size={12} className="text-muted-foreground" />
                                                    {new Date(booking.slot.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                                                    <Clock size={10} /> {booking.slot.time}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Custom / NA</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase tracking-widest">{booking.appointmentType}</span>
                                            <span className="text-[10px] text-muted-foreground mt-1 italic">{booking.shirtType}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="font-serif italic text-base">₹{booking.price}</span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] uppercase tracking-widest font-medium ${getStatusStyles(booking.status)}`}>
                                            {getStatusIcon(booking.status)}
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-1 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="p-2 hover:bg-background border border-transparent hover:border-border transition-all"
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowUpdateModal(true);
                                                }}
                                                className="p-2 hover:bg-background border border-transparent hover:border-border transition-all"
                                                title="Update Status"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredBookings.length === 0 && (
                    <div className="py-20 text-center border-t border-border">
                        <p className="luxury-text text-muted-foreground italic lowercase">
                            No reservations found matching your aesthetic search.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-secondary/10 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length}
                    </span>
                    <div className="flex items-center gap-1 md:gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="p-1 md:p-2 border border-border hover:bg-background disabled:opacity-30 transition-all"
                        >
                            <ChevronLeft size={14} className="md:w-4 md:h-4" />
                        </button>
                        <div className="flex items-center gap-1 px-1 md:px-4">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-7 h-7 md:w-8 md:h-8 text-[10px] tracking-widest transition-all ${currentPage === page
                                        ? "bg-foreground text-background"
                                        : "hover:bg-secondary/40"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="p-1 md:p-2 border border-border hover:bg-background disabled:opacity-30 transition-all"
                        >
                            <ChevronRight size={14} className="md:w-4 md:h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedBooking && !showUpdateModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                            onClick={() => setSelectedBooking(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl bg-background border border-border p-6 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="absolute right-4 top-4 md:right-8 md:top-8 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 md:mb-10">
                                <span className="luxury-label block mb-2 text-[8px] md:text-[10px]">Reservation Archive</span>
                                <h2 className="section-heading italic text-2xl md:text-3xl">{selectedBooking.fullName}</h2>
                                <div className="luxury-divider mt-4 md:mt-6" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <span className="luxury-label text-[10px] mb-1 block">Contact Information</span>
                                        <p className="text-sm font-serif italic">{selectedBooking.email}</p>
                                        <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                                    </div>
                                    <div>
                                        <span className="luxury-label text-[10px] mb-1 block">Service Details</span>
                                        <p className="text-sm uppercase tracking-widest">{selectedBooking.appointmentType}</p>
                                        <p className="text-sm text-muted-foreground italic">{selectedBooking.shirtType}</p>
                                    </div>
                                    <div>
                                        <span className="luxury-label text-[10px] mb-1 block">Financials</span>
                                        <p className="text-xl font-serif italic">₹{selectedBooking.price}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <span className="luxury-label text-[10px] mb-1 block">Scheduling</span>
                                        {selectedBooking.slot ? (
                                            <>
                                                <p className="text-sm uppercase tracking-widest">{new Date(selectedBooking.slot.date).toDateString()}</p>
                                                <p className="text-sm text-muted-foreground">{selectedBooking.slot.time}</p>
                                            </>
                                        ) : (
                                            <p className="text-sm italic">Pending assignment</p>
                                        )}
                                    </div>
                                    <div>
                                        <span className="luxury-label text-[10px] mb-1 block">Special Requests</span>
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">
                                            {selectedBooking.specialRequests || "No specific stylistic requirements provided."}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-border flex justify-end gap-4">
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="px-8 py-3 text-[10px] uppercase tracking-widest border border-border hover:bg-secondary transition-all"
                                >
                                    Close Archive
                                </button>
                                <button
                                    onClick={() => setShowUpdateModal(true)}
                                    className="luxury-button"
                                >
                                    Update Status
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {showUpdateModal && selectedBooking && (
                    <div className="fixed inset-0 z-[160] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                            onClick={() => setShowUpdateModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-md bg-background border border-border p-8 md:p-12 shadow-2xl"
                        >
                            <div className="text-center mb-8 md:mb-10">
                                <span className="luxury-label block mb-2 text-[8px] md:text-[10px]">Workflow</span>
                                <h2 className="section-heading italic text-2xl md:text-3xl">Update Status</h2>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">{selectedBooking.fullName}</p>
                            </div>

                            <div className="space-y-2 md:space-y-3">
                                {["PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(selectedBooking.id, status)}
                                        className={`w-full py-4 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${selectedBooking.status === status
                                            ? "bg-foreground text-background border-foreground"
                                            : "border-border hover:border-foreground"
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="w-full mt-6 py-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all"
                            >
                                Dismiss
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingsPage;
