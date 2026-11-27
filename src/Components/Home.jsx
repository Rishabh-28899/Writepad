
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
            // 1. Login API
            const response = await fetch(
                "https://localhost:7067/api/Auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                await showAlert(
                    "Login Failed!",
                    result.message || "Invalid username or password.",
                    "error"
                );
                return;
            }

            // 2. Extract tokens from ApiResponse data
            const accessToken = result.data?.accessToken;
            const refreshToken = result.data?.refreshToken;

            if (!accessToken || !refreshToken) {
                await showAlert(
                    "Login Failed!",
                    "Access token or refresh token was not returned by the API.",
                    "error"
                );
                return;
            }

            // 3. Save authentication tokens
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);

            // 4. Get authenticated user's actual details
            const userResponse = await fetch(
                "https://localhost:7067/api/User/getuser",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (!userResponse.ok) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRole");

                await showAlert(
                    "Login Error",
                    "Unable to verify your account role. Please check the backend.",
                    "error"
                );
                return;
            }

            const userResult = await userResponse.json();

            // GetUser also returns ApiResponse<T>
            if (!userResult.success || !userResult.data) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRole");

                await showAlert(
                    "Login Error",
                    userResult.message || "Unable to retrieve user details.",
                    "error"
                );
                return;
            }

            const userData = userResult.data;

            const actualRole = String(
                userData.role || ""
            ).toLowerCase();

            // 5. Verify selected login option against actual role
            if (loginType === "Admin" && actualRole !== "admin") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userRole");

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
                localStorage.removeItem("userRole");

                await showAlert(
                    "Select Admin Login",
                    "This is an Admin account. Please select Admin Login.",
                    "error"
                );
                return;
            }

            // 6. Save actual role
            localStorage.setItem("userRole", userData.role);

            await showAlert(
                "Login Successful!",
                `Welcome to WritePad, ${userData.username || username}.`,
                "success"
            );

            // 7. Navigate according to actual role
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
                                className={`btn ${loginType === "User"
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
                                className={`btn ${loginType === "Admin"
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
                                className={`btn ${loginType === "Admin"
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


