import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarCheck,
    Clock,
    Users,
    Settings,
    LogOut,
    FileText,
    X
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const menuItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Bookings", path: "/admin/bookings", icon: CalendarCheck },
        { name: "Time Slots", path: "/admin/slots", icon: Clock },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Journal", path: "/admin/journal", icon: FileText },
        { name: "Settings", path: "/admin/settings", icon: Settings },
    ];

    const handleLogout = () => {
        dispatch(logout());
        toast.info("Logged out successfully");
    };

    const SidebarContent = (
        <aside className="w-64 h-full bg-background border-r border-border flex flex-col shadow-2xl lg:shadow-none">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <Link to="/" className="flex flex-col" onClick={onClose}>
                    <span className="text-lg font-serif tracking-wide">House of De</span>
                    <span className="text-[12px] uppercase tracking-[0.2em] text-muted-foreground">Admin Portal</span>
                </Link>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 hover:bg-secondary transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-grow py-8 px-4 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest transition-all duration-300 ${isActive
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-foreground/60 hover:text-foreground hover:bg-secondary"
                                }`}
                        >
                            <Icon size={16} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={() => {
                        handleLogout();
                        onClose();
                    }}
                    className="w-full flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-all duration-300"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                {SidebarContent}
            </div>
        </>
    );
};

export default AdminSidebar;
