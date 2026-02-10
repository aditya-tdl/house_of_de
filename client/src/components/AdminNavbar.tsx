import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useLocation, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

interface AdminNavbarProps {
    onMenuClick: () => void;
}

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname.split("/").pop();
        if (!path) return "Admin";
        return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ");
    };

    return (
        <header className="h-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-secondary transition-colors"
                >
                    <Menu size={20} />
                </button>
                <h2 className="section-heading text-xl md:text-2xl lowercase italic tracking-tight">
                    {getPageTitle()}
                </h2>
            </div>

            <div className="flex items-center gap-6">
                <ModeToggle />
                <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 md:gap-4 hover:opacity-70 transition-all group"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-medium uppercase tracking-widest group-hover:text-primary transition-colors">{user?.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{user?.role}</p>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary flex items-center justify-center border border-border group-hover:border-foreground/30 transition-all">
                        <span className="text-xs font-medium">{user?.name?.charAt(0)}</span>
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default AdminNavbar;
