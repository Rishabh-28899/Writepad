
import { useContext } from "react";
import noteContext from "../context_notes/noteContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/apiClient";

// =====================================
// READ ROLE FROM JWT
// =====================================

function getAuthInfo() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        return { isLoggedIn: false, isAdmin: false };
    }

    try {
        const payload = token.split(".")[1];

        const base64 = payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(payload.length / 4) * 4, "=");

        const binary = atob(base64);

        const bytes = Uint8Array.from(
            binary,
            char => char.charCodeAt(0)
        );

        const decoded = JSON.parse(
            new TextDecoder().decode(bytes)
        );

        const role =
            decoded.role ||
            decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        return {
            isLoggedIn: true,
            isAdmin: role === "Admin"
        };

    } catch (error) {
        console.error("Unable to read user role:", error);

        return {
            isLoggedIn: true,
            isAdmin: false
        };
    }
}

// =====================================
// NAVBAR COMPONENT
// =====================================

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { clearNotes } = useContext(noteContext);

    const auth = getAuthInfo();

    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem("refreshToken");

        try {
            if (refreshToken) {
                const response = await apiRequest(
                    "https://localhost:7067/api/Auth/logout",
                    {
                        method: "POST",
                        skipRefresh: true,
                        body: JSON.stringify({
                            refreshToken
                        })
                    }
                );

                console.log(
                    "Backend logout status:",
                    response.status
                );

                const result = await response.json().catch(() => null);

                if (!response.ok) {
                    console.warn(
                        "Backend logout failed:",
                        result?.message || response.status
                    );
                } else {
                    console.log(
                        "Backend logout:",
                        result?.message || "Logged out successfully."
                    );
                }
            }

        } catch (error) {
            console.error("Logout API request failed:", error);

        } finally {
            // Clear frontend notes
            clearNotes();

            // Remove authentication tokens
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");

            // Redirect to Home
            navigate("/", { replace: true });
        }
    };

    // =====================================
    // JSX
    // =====================================

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/">
                    WritePad
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarSupportedContent"
                >

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/" ? "active" : ""
                                    }`}
                                to="/"
                            >
                                Home
                            </Link>
                        </li>

                        {auth.isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/notes"
                                                ? "active"
                                                : ""
                                            }`}
                                        to="/notes"
                                    >
                                        My Notes
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/add-note"
                                                ? "active"
                                                : ""
                                            }`}
                                        to="/add-note"
                                    >
                                        + New Note
                                    </Link>
                                </li>
                            </>
                        )}

                        {auth.isLoggedIn && auth.isAdmin && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname.startsWith("/admin")
                                                ? "active"
                                                : ""
                                            }`}
                                        to="/admin"
                                    >
                                        Admin Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/admin/add-user"
                                                ? "active"
                                                : ""
                                            }`}
                                        to="/admin/add-user"
                                    >
                                        + Add User / Admin
                                    </Link>
                                </li>
                            </>
                        )}

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/about" ? "active" : ""
                                    }`}
                                to="/about"
                            >
                                About
                            </Link>
                        </li>

                    </ul>

                    <div className="d-flex me-3">

                        {!auth.isLoggedIn ? (
                            <>
                                <Link
                                    className="btn btn-outline-primary me-2"
                                    to="/"
                                >
                                    Login
                                </Link>

                                <Link
                                    className="btn btn-primary"
                                    to="/register"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <button
                                className="btn btn-outline-danger"
                                type="button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

