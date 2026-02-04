import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-h-screen w-full lg:ml-64 transition-all duration-300">
                <AdminNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="p-4 md:p-8 flex-grow">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
