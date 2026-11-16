
import { useEffect, useState } from "react";

const API = "https://localhost:7067/api/Admin";

function Admin() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const token = localStorage.getItem("accessToken");

                if (!token) {
                    throw new Error("Please log in first.");
                }

                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [dashboardRes, usersRes, notesRes] =
                    await Promise.all([
                        fetch(`${API}/dashboard`, { headers }),
                        fetch(`${API}/users`, { headers }),
                        fetch(`${API}/notes`, { headers })
                    ]);

                const responses = [
                    dashboardRes,
                    usersRes,
                    notesRes
                ];

                if (responses.some(res => !res.ok)) {
                    const failed = responses.find(res => !res.ok);

                    if (failed.status === 401) {
                        throw new Error(
                            "Please log in again."
                        );
                    }

                    if (failed.status === 403) {
                        throw new Error(
                            "Admin access is required."
                        );
                    }

                    throw new Error(
                        "Unable to load dashboard data."
                    );
                }

                const [dashboard, userData, noteData] =
                    await Promise.all(
                        responses.map(res => res.json())
                    );

                setStats(dashboard);
                setUsers(userData);
                setNotes(noteData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const filteredUsers = users.filter(user =>
        `${user.username} ${user.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) return <p>Loading admin dashboard...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2>WritePad Admin Dashboard</h2>

            <div className="row g-3 my-2">
                {[
                    ["Total Users", stats.totalUsers],
                    ["Total Admins", stats.totalAdmins],
                    ["Regular Users", stats.regularUsers],
                    ["Total Notes", stats.totalNotes]
                ].map(([label, value]) => (
                    <div className="col-md-3" key={label}>
                        <div className="card p-3 h-100">
                            <h6>{label}</h6>
                            <h2>{value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="mt-4">All Registered Users</h3>

            <input
                className="form-control mb-3"
                placeholder="Search username or email"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h3 className="mt-4">All Notes</h3>

            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Note ID</th>
                            <th>Title</th>
                            <th>Topic</th>
                            <th>Owner</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map(note => (
                            <tr key={note.id}>
                                <td>{note.id}</td>
                                <td>{note.title}</td>
                                <td>{note.topic || "-"}</td>
                                <td>{note.username}</td>
                                <td>
                                    {new Date(
                                        note.createdAt
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {notes.length === 0 && (
                            <tr>
                                <td colSpan="5">
                                    No notes found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Admin;
