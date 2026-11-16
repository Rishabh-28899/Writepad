
import { Navigate, Outlet } from "react-router-dom";

// Decode JWT and get user role
function getUserRole(token) {
    try {
        const payload = token.split(".")[1];

        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(
                Math.ceil(payload.length / 4) * 4,
                "="
            );

        const decoded = JSON.parse(
            atob(base64)
        );

        return (
            decoded.role ||
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
            null
        );
    } catch (error) {
        console.error("JWT decoding error:", error);
        return null;
    }
}

function ProtectedRoute({ adminOnly = false }) {

    const accessToken = localStorage.getItem("accessToken");

    // Check whether user is logged in
    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    // Check Admin role
    if (adminOnly) {
        const role = getUserRole(accessToken);

        if (role !== "Admin") {
            return <Navigate to="/notes" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;




