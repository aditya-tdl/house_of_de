import { motion } from "framer-motion";
import { Settings as SettingsIcon, Shield, Bell, Database, Palette } from "lucide-react";

const SettingsPage = () => {
    const categories = [
        { icon: <Shield size={20} />, title: "Security", desc: "Access control and authentication settings" },
        { icon: <Bell size={20} />, title: "Notifications", desc: "System alerts and automated client updates" },
        { icon: <Palette size={20} />, title: "Appearance", desc: "Customize the portal aesthetic and branding" },
        { icon: <Database size={20} />, title: "Maintenance", desc: "System backups and database optimization" }
    ];

    return (
        <div className="space-y-12 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div>
                <span className="luxury-label block mb-2 lowercase italic">System Configuration</span>
                <h1 className="section-heading italic text-4xl">Administration Settings</h1>
            </div>

            {/* Placeholder Content */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, index) => (
                    <motion.div
                        key={cat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group p-8 bg-background border border-border hover:border-foreground/30 transition-all duration-500 cursor-not-allowed"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-12 h-12 bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-foreground/5 transition-colors duration-500">
                                {cat.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-serif italic text-xl mb-1">{cat.title}</h3>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">{cat.desc}</p>
                                <div className="h-px w-full bg-border group-hover:bg-foreground/20 transition-colors" />
                                <span className="mt-4 block text-[10px] uppercase tracking-widest text-muted-foreground italic">Configuration subspace currently under development</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div> */}

            {/* Branding Aesthetic Card */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-12 border border-border bg-secondary/20 flex flex-col items-center text-center space-y-6"
            >
                <SettingsIcon size={40} className="text-muted-foreground/30 animate-pulse" />
                <div className="max-w-md">
                    <p className="luxury-text text-muted-foreground italic lowercase">
                        The settings module is being meticulously crafted to provide granular control over the aesthetic and functional domain of the portal.
                    </p>
                </div>
                <div className="luxury-divider w-24" />
            </motion.div>
        </div>
    );
};

export default SettingsPage;
