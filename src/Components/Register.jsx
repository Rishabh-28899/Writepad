
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const username = credentials.name.trim();
        const email = credentials.email.trim();

        if (!username || !email || !credentials.password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (credentials.password !== credentials.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "https://localhost:7067/api/User/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        password: credentials.password
                    })
                }
            );

            const responseText = await response.text();

            let data = null;

            try {
                data = responseText
                    ? JSON.parse(responseText)
                    : null;
            } catch {
                data = responseText;
            }

            console.log("Registration status:", response.status);
            console.log("Registration response:", data);

            if (!response.ok) {
                const message =
                    typeof data === "string"
                        ? data
                        : data?.message ||
                          data?.title ||
                          data?.error ||
                          "Registration failed. Please try again.";

                throw new Error(message);
            }

            setSuccess(
                typeof data === "object" && data?.message
                    ? data.message
                    : "Registration successful! Redirecting to login..."
            );

            setCredentials({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

            // Navigate to the actual login route
            setTimeout(() => {
                navigate("/", { replace: true });
            }, 1500);

        } catch (err) {
            console.error("Registration error:", err);

            if (err instanceof TypeError) {
                setError(
                    "Could not connect to the backend. Check that the API is running and its HTTPS certificate is trusted."
                );
            } else {
                setError(err.message || "Registration failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-4">

                            <h2 className="text-center mb-2">
                                Create Account
                            </h2>

                            <p className="text-center text-muted mb-4">
                                Register for WritePad
                            </p>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success" role="alert">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Username
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Choose a username"
                                        value={credentials.name}
                                        onChange={handleChange}
                                        autoComplete="username"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Create a password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="form-label"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        name="confirmPassword"
                                        className="form-control"
                                        placeholder="Confirm your password"
                                        value={credentials.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>

                            <p className="text-center mt-3 mb-0">
                                Already have an account?{" "}
                                <Link to="/">
                                    Login here
                                </Link>
                            </p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;



