import React, { useState } from "react";
import { Link } from "react-router-dom";

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
                    "Authorization": `Bearer ${token}`
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
                throw new Error(
                    "Your session is invalid or expired. Please log in again."
                );
            }

            if (response.status === 403) {
                throw new Error(
                    "Access denied. Only an Admin can add users."
                );
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
        if (err instanceof TypeError) {
            setError(
                "Cannot connect to the API. Check that your backend is running at https://localhost:7067."
            );
        } else {
            setError(err.message || "Something went wrong.");
        }
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
    <div className="container mt-5 mb-5">
        <div
            className="card shadow mx-auto"
            style={{ maxWidth: "600px" }}
        >
            <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Add New User</h4>
            </div>

            <div className="card-body p-4">
                {message && (
                    <div
                        className="alert alert-success"
                        role="alert"
                    >
                        {message}
                    </div>
                )}

                {error && (
                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>
                )}

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
                            name="username"
                            className="form-control"
                            placeholder="Enter username"
                            value={form.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="form-label"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email address"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
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
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            minLength={8}
                            required
                        />

                        <small className="text-muted">
                            Password must contain at least 8 characters.
                        </small>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="role"
                            className="form-label"
                        >
                            Select Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            className="form-select"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add User"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            Reset
                        </button>

                        <Link
                            to="/admin"
                            className="btn btn-outline-dark"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
);

};

export default AddUser;