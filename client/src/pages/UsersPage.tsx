import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Eye,
    MoreHorizontal,
    Download,
    Mail,
    Phone,
    Calendar,
    Users as UsersIcon,
    UserCircle,
    X,
    TrendingUp,
    UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";
import axiosInstance from "@/api/axiosInstance";

interface User {
    id: number;
    name: string;
    email: string;
    mobile: string;
    gender: "MALE" | "FEMALE" | "OTHER";
    created_at: string;
}

interface UserBooking {
    id: number;
    status: string;
    price: number;
    appointmentType: string;
    shirtType: string;
    createdAt: string;
    slot?: {
        date: string;
        time: string;
    };
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userBookings, setUserBookings] = useState<UserBooking[]>([]);
    const [isFetchingBookings, setIsFetchingBookings] = useState(false);
    const itemsPerPage = 8;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.get("/users");
            // Backend returns { success, data: { users, pagination } }
            if (response.data.success) {
                setUsers(response.data.data.users);
            }
        } catch (error: any) {
            toast.error("Failed to fetch users");
        } finally {
            dispatch(hideLoader());
        }
    };

    // Client-side filtering logic
    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const searchLower = searchTerm.toLowerCase();
            return (
                u.name.toLowerCase().includes(searchLower) ||
                u.email.toLowerCase().includes(searchLower) ||
                u.mobile.toLowerCase().includes(searchLower)
            );
        });
    }, [users, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredUsers.slice(start, start + itemsPerPage);
    }, [filteredUsers, currentPage]);

    // Statistics
    const stats = useMemo(() => {
        const total = users.length;
        const male = users.filter(u => u.gender === 'MALE').length;
        const female = users.filter(u => u.gender === 'FEMALE').length;
        const other = users.filter(u => u.gender === 'OTHER').length;

        // Users joined in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length;

        return { total, male, female, other, newUsers };
    }, [users]);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 on search
    }, [searchTerm]);

    useEffect(() => {
        if (selectedUser) {
            fetchUserBookings(selectedUser.id);
        } else {
            setUserBookings([]);
        }
    }, [selectedUser]);

    const fetchUserBookings = async (userId: number) => {
        setIsFetchingBookings(true);
        try {
            const response = await axiosInstance.get(`/bookings/user/${userId}`);
            if (response.data.success) {
                // Backend returns user object with bookings array
                setUserBookings(response.data.data.bookings);
            }
        } catch (error: any) {
            console.error("Failed to fetch user bookings", error);
            toast.error("Could not retrieve booking history");
        } finally {
            setIsFetchingBookings(false);
        }
    };

    const handleExport = () => {
        if (filteredUsers.length === 0) {
            toast.error("No data to export");
            return;
        }

        const headers = ["ID", "Name", "Email", "Mobile", "Gender", "Join Date"];
        const csvContent = [
            headers.join(","),
            ...filteredUsers.map(u => [
                u.id,
                `"${u.name}"`,
                u.email,
                u.mobile,
                u.gender,
                new Date(u.created_at).toLocaleDateString()
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `users_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Client registry exported successfully");
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header & Stats Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <span className="luxury-label block mb-1 md:mb-2">Registry</span>
                    <h1 className="section-heading italic text-3xl md:text-4xl">Client Archive</h1>
                </div>

                <div className="flex items-center justify-around md:justify-start gap-4 md:gap-8 px-4 md:px-8 py-4 border border-border bg-background/50 backdrop-blur-sm overflow-x-auto">
                    <div className="text-center min-w-[60px]">
                        <span className="block text-[8px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total Vault</span>
                        <span className="font-serif italic text-base md:text-lg">{stats.total}</span>
                    </div>
                    <div className="w-px h-8 bg-border shrink-0" />
                    <div className="text-center min-w-[60px]">
                        <span className="block text-[8px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Growth</span>
                        <span className="font-serif italic text-base md:text-lg text-primary flex items-center justify-center gap-1">
                            <TrendingUp size={12} className="md:w-3.5 md:h-3.5" /> +{stats.newUsers}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-border shrink-0" />
                    <div className="text-center min-w-[60px]">
                        <span className="block text-[8px] md:text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Distribution</span>
                        <span className="text-[8px] md:text-[10px] uppercase tracking-tight text-muted-foreground flex gap-2 justify-center">
                            <span>M: {stats.male}</span>
                            <span>F: {stats.female}</span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
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

            {/* Users Table */}
            <div className="bg-background border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border bg-secondary/30">
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Identity</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Contact</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Gender</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">Admission</th>
                                <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedUsers.map((user, index) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-secondary/20 transition-colors group"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                                                <UserCircle size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-serif italic text-base leading-tight">{user.name}</span>
                                                <span className="text-[10px] text-muted-foreground mt-0.5 tracking-wider">ID: #00{user.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-foreground lowercase flex items-center gap-1.5 font-medium tracking-wide">
                                                <Mail size={12} className="text-muted-foreground" /> {user.email}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-widest">
                                                <Phone size={12} /> {user.mobile}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-secondary border border-border">
                                            {user.gender}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar size={12} />
                                            <span className="text-[10px] uppercase tracking-[0.2em]">
                                                {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-1 transition-opacity duration-300">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="p-2 hover:bg-background border border-transparent hover:border-border transition-all"
                                                title="View Narrative"
                                            >
                                                <Eye size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredUsers.length === 0 && (
                    <div className="py-20 text-center border-t border-border">
                        <p className="luxury-text text-muted-foreground italic lowercase">
                            No clients identified in this aesthetic domain.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-border bg-secondary/10 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Exhibiting {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
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

            {/* Profile Detail Modal */}
            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-5">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                            onClick={() => setSelectedUser(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-lg bg-background border border-border p-8 md:p-12 shadow-2xl overflow-hidden h-[85vh] flex flex-col"
                        >
                            {/* Decorative ID background */}
                            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.02] pointer-events-none select-none">
                                <span className="text-[80px] md:text-[120px] font-serif italic">#{selectedUser.id}</span>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="absolute right-4 top-4 md:right-8 md:top-8 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-6 md:mb-10 relative shrink-0">
                                <span className="luxury-label block mb-2 text-[8px] md:text-[10px] lowercase italic">Client Profile</span>
                                <h2 className="section-heading italic text-2xl md:text-3xl">{selectedUser.name}</h2>
                                <div className="luxury-divider mt-4 md:mt-6" />
                            </div>

                            <div className="relative flex-1 overflow-hidden flex flex-col min-h-0">
                                <div className="grid grid-cols-2 gap-8 shrink-0 mb-8">
                                    <div>
                                        <span className="luxury-label text-[10px] mb-2 block uppercase tracking-widest text-muted-foreground">Digital Coordinates</span>
                                        <p className="text-sm font-serif italic mb-1">{selectedUser.email}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{selectedUser.mobile}</p>
                                    </div>
                                    <div>
                                        <span className="luxury-label text-[10px] mb-2 block uppercase tracking-widest text-muted-foreground">Attributes</span>
                                        <p className="text-xs uppercase tracking-[0.2em]">{selectedUser.gender}</p>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                                    {/* <div className="mb-6 border-t border-border/50 shrink-0">
                                        <span className="luxury-label text-[10px] mb-2 block uppercase tracking-widest text-muted-foreground">Admission History</span>
                                        <div className="flex items-center gap-3 p-3 bg-secondary/10 border border-border">
                                            <UserPlus size={14} className="text-muted-foreground" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-widest opacity-70">Added to collection on</span>
                                                <span className="text-xs italic font-serif mt-0.5">
                                                    {new Date(selectedUser.created_at).toLocaleString(undefined, {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div> */}
                                    <span className="luxury-label text-[10px] mb-3 block uppercase tracking-widest text-muted-foreground shrink-0 font-medium">Booking History</span>

                                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[0px]">
                                        {isFetchingBookings ? (
                                            <div className="py-8 flex justify-center">
                                                <div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground animate-spin" />
                                            </div>
                                        ) : userBookings.length > 0 ? (
                                            <div className="space-y-3 pb-2">
                                                {userBookings.map((booking) => (
                                                    <div key={booking.id} className="p-4 bg-secondary/20 border border-border group hover:border-foreground/30 transition-all">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-[10px] uppercase tracking-widest font-medium text-foreground/80">
                                                                {booking.appointmentType}
                                                            </span>
                                                            <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 border ${booking.status === 'CONFIRMED' ? 'border-primary/30 text-primary' :
                                                                booking.status === 'CANCELLED' ? 'border-destructive/30 text-destructive' :
                                                                    'border-orange-500/30 text-orange-500'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div className="flex flex-col">
                                                                {booking.slot ? (
                                                                    <span className="text-[11px] italic font-serif">
                                                                        {new Date(booking.slot.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {booking.slot.time}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-[11px] italic font-serif text-muted-foreground">No slot assigned</span>
                                                                )}
                                                                <span className="text-[9px] text-muted-foreground uppercase tracking-tight mt-1">{booking.shirtType}</span>
                                                            </div>
                                                            <span className="font-serif italic text-sm">${booking.price}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 border border-dashed border-border text-center">
                                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground italic">No reservations on file</p>
                                            </div>
                                        )}
                                    </div>


                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-full mt-12 py-4 text-[10px] uppercase tracking-[0.3em] border border-border hover:bg-secondary transition-all duration-300 shrink-0"
                            >
                                Dismiss Archive
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UsersPage;
