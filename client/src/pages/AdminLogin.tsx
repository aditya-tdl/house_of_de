import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { showLoader, hideLoader } from "@/store/slices/loaderSlice";
import axiosInstance from "@/api/axiosInstance";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoader());

        try {
            const response = await axiosInstance.post("/auth/login", {
                username: email,
                password,
            });

            const data = response.data;

            if (data.success) {
                const { token, ...user } = data.data;
                dispatch(setCredentials({ user, token }));
                toast.success("Welcome back, Admin");
                navigate("/admin/dashboard");
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            console.error("Login error:", error);
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow flex items-center justify-center px-6 py-20 mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-12">
                        <span className="luxury-label block mb-4">Administration</span>
                        <h1 className="section-heading italic">Sign In</h1>
                        <div className="luxury-divider mx-auto mt-6" />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2">
                            <label className="luxury-label text-[10px]" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-foreground/20 py-3 text-sm focus:border-foreground outline-none transition-colors duration-300"
                                placeholder="admin@gmail.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="luxury-label text-[10px]" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-foreground/20 py-3 pr-10 text-sm focus:border-foreground outline-none transition-colors duration-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors duration-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            className="luxury-button w-full flex items-center justify-center gap-2 group"
                        >
                            Access Dashboard
                        </motion.button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="luxury-text text-xs text-foreground/40 italic">
                            Reserved for authorized personnel only.
                        </p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminLogin;
