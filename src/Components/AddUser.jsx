
import { useState } from "react";
import { Link } from "react-router-dom";
import "./AddUser.css";

const AddUser = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        role: "User"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (
            !form.username.trim() ||
            !form.email.trim() ||
            !form.password
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error("Please log in first.");
            }

            const response = await fetch(
                "https://localhost:7067/api/Admin/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        username: form.username.trim(),
                        email: form.email.trim(),
                        password: form.password,
                        role: form.role
                    })
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Session expired. Please log in again.");
                }

                if (response.status === 403) {
                    throw new Error("Only an Admin can add users.");
                }

                throw new Error(
                    data?.message ||
                    data?.title ||
                    `Failed to add user. HTTP ${response.status}.`
                );
            }

            setMessage("User created successfully!");

            setForm({
                username: "",
                email: "",
                password: "",
                role: "User"
            });

        } catch (err) {
            setError(
                err instanceof TypeError
                    ? "Cannot connect to the backend API."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm({
            username: "",
            email: "",
            password: "",
            role: "User"
        });

        setMessage("");
        setError("");
    };

    return (
        <div className="wp-adduser-page">

            <div className="wp-adduser-header">
                <div>
                    <h1>Add New User</h1>
                    <p>Create and manage WritePad user accounts.</p>
                </div>

                <Link to="/admin" className="wp-adduser-back">
                    ← Back to Dashboard
                </Link>
            </div>

            <div className="wp-adduser-card">

                <div className="wp-adduser-card-header">
                    <h2>User Information</h2>
                    <p>Enter the details below to create an account.</p>
                </div>

                <div className="wp-adduser-card-body">

                    {message && (
                        <div className="wp-adduser-success">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="wp-adduser-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="wp-adduser-field">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={form.username}
                                onChange={handleChange}
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div className="wp-adduser-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter email address"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="wp-adduser-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                minLength={8}
                                required
                            />
                            <small>Minimum 8 characters required.</small>
                        </div>

                        <div className="wp-adduser-field">
                            <label htmlFor="role">Select Role</label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="User">User</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="wp-adduser-actions">
                            <button
                                type="submit"
                                className="wp-adduser-submit"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create User"}
                            </button>

                            <button
                                type="button"
                                className="wp-adduser-reset"
                                onClick={handleReset}
                                disabled={loading}
                            >
                                Reset
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddUser;
