import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ProtectedRoute = () => {
    const { token, user, isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated || !token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (user?.role !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
