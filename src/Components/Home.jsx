
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showAlert } from "./Alert";

function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginType, setLoginType] = useState("User");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password) {
            await showAlert(
                "Validation Error",
                "Please enter username and password.",
                "error"
            );
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "https://localhost:7067/api/Auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                await showAlert(
                    "Login Failed!",
                    data.message || "Invalid username or password.",
                    "error"
                );
                return;
            }

            if (!data.accessToken) {
                await showAlert(
                    "Login Failed!",
                    "Access token was not returned by the API.",
                    "error"
                );
                return;
            }

            // Save authentication tokens
            localStorage.setItem("accessToken", data.accessToken);

            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            } else {
                localStorage.removeItem("refreshToken");
            }

            // Ask the backend for the authenticated user's actual role
            const userResponse = await fetch(
                "https://localhost:7067/api/User/getuser",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${data.accessToken}`
                    }
                }
            );

            if (!userResponse.ok) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                await showAlert(
                    "Login Error",
                    "Unable to verify your account role. Please check the backend.",
                    "error"
                );
                return;
            }

            const userData = await userResponse.json();
            const actualRole = String(userData.role || "").toLowerCase();

            // Verify the selected login option matches the real role
            if (loginType === "Admin" && actualRole !== "admin") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                await showAlert(
                    "Access Denied",
                    "This account is not an Admin account. Please select User Login.",
                    "error"
                );
                return;
            }

            if (loginType === "User" && actualRole === "admin") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                await showAlert(
                    "Select Admin Login",
                    "This is an Admin account. Please select Admin Login.",
                    "error"
                );
                return;
            }

            // Save role for frontend display/routing
            localStorage.setItem("userRole", userData.role);

            await showAlert(
                "Login Successful!",
                `Welcome to WritePad, ${userData.username || username}.`,
                "success"
            );

            if (actualRole === "admin") {
                navigate("/admin", { replace: true });
            } else {
                navigate("/notes", { replace: true });
            }
        } catch (error) {
            console.error("Login error:", error);

            await showAlert(
                "Connection Error!",
                "Unable to connect to the server or verify your account. Check that your backend is running.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow p-4">
                        <h2 className="text-center mb-2">
                            WritePad
                        </h2>

                        <p className="text-center text-muted mb-4">
                            Sign in to your account
                        </p>

                        <div className="btn-group w-100 mb-4" role="group"> 
                            <button
                                type="button"
                                className={`btn ${
                                    loginType === "User"
                                        ? "btn-primary"
                                        : "btn-outline-primary"
                                }`}
                                onClick={() => setLoginType("User")}
                                disabled={loading}
                            >
                                User Login
                            </button>

                            <button
                                type="button"
                                className={`btn ${
                                    loginType === "Admin"
                                        ? "btn-dark"
                                        : "btn-outline-dark"
                                }`}
                                onClick={() => setLoginType("Admin")}
                                disabled={loading}
                            >
                                Admin Login
                            </button>
                        </div>

                        <h5 className="text-center mb-3">
                            {loginType === "Admin"
                                ? "Admin Dashboard Login"
                                : "User Login"}
                        </h5>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label
                                    htmlFor="username"
                                    className="form-label"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    autoComplete="username"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label
                                    htmlFor="password"
                                    className="form-label"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    autoComplete="current-password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={`btn ${
                                    loginType === "Admin"
                                        ? "btn-dark"
                                        : "btn-primary"
                                } w-100`}
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : loginType === "Admin"
                                    ? "Login as Admin"
                                    : "Login as User"}
                            </button>
                        </form>

                        <p className="text-center mt-3 mb-0">
                            Don't have an account?{" "}
                            <Link to="/register">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;


