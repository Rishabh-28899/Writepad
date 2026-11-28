
import { Navigate, Outlet } from "react-router-dom";

// =====================================
// DECODE JWT AND GET USER ROLE
// =====================================

function getUserRole(token) {

    try {

        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

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

        console.log("Decoded JWT Payload:", decoded);

        const role =
            decoded.role ||
            decoded.Role ||
            decoded.roles ||
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role"] ||
            null;

        console.log("Detected User Role:", role);

        return Array.isArray(role) ? role[0] : role;

    } catch (error) {

        console.error("JWT decoding error:", error);

        return null;

    }

}

// =====================================
// PROTECTED ROUTE
// =====================================

function ProtectedRoute({ adminOnly = false }) {

    const accessToken = localStorage.getItem("accessToken");

    // Check login
    if (!accessToken) {

        return <Navigate to="/" replace />;

    }

    // Check Admin authorization
    if (adminOnly) {

        const role = getUserRole(accessToken);

        if (
            typeof role !== "string" ||
            role.toLowerCase() !== "admin"
        ) {

            console.warn(
                "Access denied: Admin privileges required."
            );

            return <Navigate to="/notes" replace />;

        }

    }

    return <Outlet />;

}

export default ProtectedRoute;





