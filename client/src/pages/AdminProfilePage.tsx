import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Camera, X, Phone, Lock, Save } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/api/axiosInstance";
import { updateUser } from "@/store/slices/authSlice";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";

const AdminProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        mobile: user?.mobile || "",
        password: "",
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoader());
        try {
            const response = await axiosInstance.put("/users/profile", formData);
            if (response.data.success) {
                dispatch(updateUser(response.data.data));
                toast.success("Profile updated accurately");
                setIsUpdateModalOpen(false);
                setFormData(prev => ({ ...prev, password: "" }));
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Coordination failure");
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header section with cover effect */}
            <div className="relative h-48 bg-secondary/30 overflow-hidden border border-border">
                <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
                    <span className="text-[70px] md:text-[160px] font-serif italic absolute bottom-5 md:-bottom-2 md:right-5 right-2 leading-none">
                        Archive
                    </span>
                </div>

                <div className="absolute left-6 md:left-12 flex items-end gap-6 bottom-[3rem] md:bottom-[1rem] z-10">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-background border border-border flex items-center justify-center text-3xl font-serif shadow-xl">
                            {user?.name?.charAt(0)}
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-background border border-border rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                            <Camera size={14} className="text-muted-foreground" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-12 md:pt-16">
                <div>
                    <h1 className="section-heading text-3xl md:text-4xl italic mb-1 lowercase tracking-tight">{user?.name}</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">System Administrator</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                    {/* Information Column */}
                    <div className="md:col-span-2 space-y-10">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="luxury-label lowercase italic">Personal Coordinates</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Legal Identification</span>
                                    <p className="font-serif italic text-lg">{user?.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Digital Correspondence</span>
                                    <p className="font-serif italic text-lg">{user?.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Telecommunications</span>
                                    <p className="font-serif italic text-lg">{user?.mobile || "Not specified"}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Architectural Role</span>
                                    <p className="text-xs uppercase tracking-[0.2em] font-medium">{user?.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border border-border bg-secondary/10">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <Shield className="text-muted-foreground mt-1 shrink-0" size={20} />
                                <div>
                                    <h3 className="font-serif italic text-xl mb-1">Security & Access</h3>
                                    <p className="text-xs text-muted-foreground mb-6">Your account is governed by high-encryption standards and administrative protocols.</p>
                                    <button
                                        onClick={() => setIsUpdateModalOpen(true)}
                                        className="luxury-button px-6 py-2 text-[10px]"
                                    >
                                        Update Credentials
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info Column */}
                    <div className="space-y-8">
                        <div className="p-6 border border-border space-y-4">
                            <span className="luxury-label text-[10px] block uppercase tracking-widest opacity-60">System Status</span>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest">Active Session</span>
                            </div>
                            <div className="h-px bg-border w-full" />
                            <div className="space-y-2">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Current Node</p>
                                <p className="text-[10px] font-mono tracking-tighter">ADMIN_CLIENT_VX_042</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border">
                            <p className="luxury-text text-muted-foreground italic text-center lowercase text-sm">
                                The administrator's profile remains the central point of the platform's orchestration and aesthetic alignment.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Credentials Modal */}
            <AnimatePresence>
                {isUpdateModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-background border border-border p-8 md:p-12 shadow-2xl"
                        >
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="mb-10">
                                <span className="luxury-label block mb-2 lowercase italic">Security Update</span>
                                <h2 className="section-heading italic text-2xl md:text-3xl">Update Credentials</h2>
                                <div className="luxury-divider mt-6" />
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Phone size={12} /> Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors font-serif italic"
                                        placeholder="Enter secure contact..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Lock size={12} /> New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-secondary/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors font-serif italic"
                                        placeholder="Leave blank to maintain current..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full luxury-button py-4 flex items-center justify-center gap-3 group mt-8"
                                >
                                    <Save size={16} className="group-hover:scale-110 transition-transform" />
                                    Synchronize Profile
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProfilePage;
