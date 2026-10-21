
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showAlert } from "./Alert";

function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
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

            // Save tokens returned by the API
            localStorage.setItem("accessToken", data.accessToken);

            if (data.refreshToken) {
                localStorage.setItem("refreshToken", data.refreshToken);
            } else {
                localStorage.removeItem("refreshToken");
            }

            // Show success alert
            await showAlert(
                "Login Successful!",
                "Welcome to WritePad.",
                "success"
            );

            // Navigate after the alert closes
            navigate("/notes", { replace: true });

        } catch (error) {
            console.error("Login error:", error);

            await showAlert(
                "Connection Error!",
                "Unable to connect to the server. Please check your API.",
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
                        <h2 className="text-center mb-4">
                            WritePad Login
                        </h2>

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
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

