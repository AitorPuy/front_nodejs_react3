import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
    const access = localStorage.getItem("access");
    const userRole = localStorage.getItem("role");

    if (!access) {
        return <Navigate to="/login" replace />;
    }

    if (role && role !== userRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
