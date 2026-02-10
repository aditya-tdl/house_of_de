import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    CalendarCheck,
    UserPlus,
    Clock,
    TrendingUp
} from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";

const Dashboard = () => {
    const [stats, setStats] = useState<any[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        dispatch(showLoader());
        try {
            const response = await axiosInstance.get("/dashboard/stats");
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "CalendarCheck": return CalendarCheck;
            case "UserPlus": return UserPlus;
            case "Clock": return Clock;
            case "TrendingUp": return TrendingUp;
            default: return TrendingUp;
        }
    };

    return (
        <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.length > 0 ? stats.map((stat, index) => {
                    const Icon = getIcon(stat.icon);
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-background p-6 md:p-8 border border-border group hover:border-foreground transition-all duration-500"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="p-3 bg-secondary rounded-full text-foreground transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                                    <Icon size={20} />
                                </div>
                                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.change}</span>
                            </div>
                            <h3 className="luxury-label mb-2">{stat.label}</h3>
                            <p className="section-heading text-4xl">{stat.value}</p>
                        </motion.div>
                    );
                }) : (
                    // Skeleton or Loading State
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-background p-8 border border-border animate-pulse h-48" />
                    ))
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-background p-8 md:p-12 border border-border min-h-[300px] md:min-h-[400px] flex flex-col items-center justify-center text-center"
            >
                <div className="max-w-md">
                    <span className="luxury-label block mb-4">Activity Monitor</span>
                    <h2 className="section-heading italic mb-6">Welcome to Your Atelier Analytics</h2>
                    <p className="luxury-text text-foreground/60 mb-8 lowercase">
                        Your bespoke business performance at a glance. detailed charts and interaction maps are being refined for your visual excellence.
                    </p>
                    <div className="luxury-divider mx-auto" />
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
