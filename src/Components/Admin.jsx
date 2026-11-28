
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/apiClient";
import "./Admin.css";

// ASP.NET Core Admin API
const ADMIN_API = "https://localhost:7067/api/Admin";

// Initial dashboard values
const initialStats = {
    totalUsers: 0,
    totalAdmins: 0,
    regularUsers: 0,
    totalNotes: 0
};

// =====================================
// COMMON FUNCTION TO CALL ADMIN APIs
// =====================================

async function getAdminData(endpoint, signal) {
    const response = await apiRequest(
        `${ADMIN_API}/${endpoint}`,
        {
            method: "GET",
            signal
        }
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.message ||
            result?.title ||
            `Request failed with status ${response.status}`
        );
    }

    // Handle standardized ApiResponse<T>
    if (result?.success === false) {
        throw new Error(
            result.message || "Unable to retrieve Admin data."
        );
    }

    // Return data from ApiResponse<T>, or raw JSON
    return result && Object.hasOwn(result, "data")
        ? result.data
        : result;
}

// =====================================
// ADMIN COMPONENT
// =====================================

function Admin() {

    // Sidebar navigation
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Dashboard data
    const [stats, setStats] = useState(initialStats);
    const [users, setUsers] = useState([]);
    const [notes, setNotes] = useState([]);

    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Used to trigger dashboard refresh
    const [refreshKey, setRefreshKey] = useState(0);

    // =====================================
    // FETCH ADMIN DASHBOARD DATA
    // =====================================

    useEffect(() => {

        const controller = new AbortController();

        const fetchAdminData = async () => {

            try {

                await Promise.resolve();

                const token = localStorage.getItem("accessToken");

                if (!token) {
                    throw new Error(
                        "Access token not found. Please log in again."
                    );
                }

                // Call all three backend APIs
                const [
                    dashboardData,
                    usersData,
                    notesData
                ] = await Promise.all([

                    getAdminData(
                        "dashboard",
                        controller.signal
                    ),

                    getAdminData(
                        "users",
                        controller.signal
                    ),

                    getAdminData(
                        "notes",
                        controller.signal
                    )

                ]);

                // Don't update state if component was unmounted
                if (controller.signal.aborted) {
                    return;
                }

                // Update dashboard statistics
                setStats({

                    totalUsers:
                        dashboardData?.totalUsers ??
                        dashboardData?.TotalUsers ??
                        0,

                    totalAdmins:
                        dashboardData?.totalAdmins ??
                        dashboardData?.TotalAdmins ??
                        0,

                    regularUsers:
                        dashboardData?.regularUsers ??
                        dashboardData?.RegularUsers ??
                        0,

                    totalNotes:
                        dashboardData?.totalNotes ??
                        dashboardData?.TotalNotes ??
                        0

                });

                // Update users
                setUsers(
                    Array.isArray(usersData)
                        ? usersData
                        : []
                );

                // Update notes
                setNotes(
                    Array.isArray(notesData)
                        ? notesData
                        : []
                );

            } catch (err) {

                if (
                    !controller.signal.aborted &&
                    err.name !== "AbortError"
                ) {
                    console.error(
                        "Admin dashboard error:",
                        err
                    );

                    setError(
                        err.message ||
                        "Unable to load Admin dashboard."
                    );
                }

            } finally {

                if (!controller.signal.aborted) {
                    setLoading(false);
                }

            }
        };

        fetchAdminData();

        // Cleanup
        return () => {
            controller.abort();
        };

    }, [refreshKey]);

    // =====================================
    // REFRESH DASHBOARD
    // =====================================

    const handleRefresh = () => {

        setLoading(true);
        setError("");

        // Trigger useEffect again
        setRefreshKey(current => current + 1);

    };

    // =====================================
    // SIDEBAR NAVIGATION
    // =====================================

    const changePage = (page) => {

        setActivePage(page);
        setSidebarOpen(false);

    };

    const pageTitles = {
        dashboard: "Dashboard",
        users: "User Management",
        notes: "Notes Management"
    };

    // =====================================
    // JSX
    // =====================================

    return (

        <div className="wp-admin">

            {/* SIDEBAR */}

            <aside
                className={`wp-admin-sidebar ${sidebarOpen ? "open" : ""}`}
            >

                <div className="wp-admin-brand">

                    <div className="wp-admin-brand-icon">
                        W
                    </div>

                    <div>
                        <h2>WritePad</h2>
                        <span>Admin Console</span>
                    </div>

                </div>

                <p className="wp-admin-menu-heading">
                    MAIN MENU
                </p>

                <nav className="wp-admin-menu">

                    <button
                        className={
                            activePage === "dashboard"
                                ? "selected"
                                : ""
                        }
                        onClick={() => changePage("dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className={
                            activePage === "users"
                                ? "selected"
                                : ""
                        }
                        onClick={() => changePage("users")}
                    >
                        <span>♙</span>
                        Manage Users
                    </button>

                    <button
                        className={
                            activePage === "notes"
                                ? "selected"
                                : ""
                        }
                        onClick={() => changePage("notes")}
                    >
                        <span>▤</span>
                        Manage Notes
                    </button>

                    <Link
                        to="/admin/add-user"
                        className="wp-admin-add-link"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <span>＋</span>
                        Add User / Admin
                    </Link>

                </nav>

                <div className="wp-admin-sidebar-footer">

                    <Link to="/notes">
                        ← Back to My Notes
                    </Link>

                    <span>
                        WritePad Administration
                    </span>

                </div>

            </aside>

            {/* MAIN CONTENT */}

            <main className="wp-admin-main">

                <header className="wp-admin-header">

                    <div className="wp-admin-header-left">

                        <button
                            className="wp-admin-menu-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            ☰
                        </button>

                        <div>
                            <h1>
                                {pageTitles[activePage]}
                            </h1>

                            <p>
                                Welcome to your WritePad administration panel.
                            </p>
                        </div>

                    </div>

                    <div className="wp-admin-header-right">

                        <span className="wp-admin-role">
                            ADMIN
                        </span>

                        <button
                            className="wp-admin-refresh"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                    </div>

                </header>

                {/* PAGE CONTENT */}

                <section className="wp-admin-content">

                    {loading && (

                        <div className="wp-admin-message">
                            Loading dashboard data...
                        </div>

                    )}

                    {error && !loading && (

                        <div className="wp-admin-error">

                            <strong>
                                Unable to load Admin data
                            </strong>

                            <p>{error}</p>

                            <button onClick={handleRefresh}>
                                Try Again
                            </button>

                            <p>
                                A 401 or 403 response usually means
                                you need to log in with an Admin account.
                            </p>

                        </div>

                    )}

                    {!loading && !error && (

                        <>

                            {/* DASHBOARD */}

                            {activePage === "dashboard" && (

                                <>

                                    <div className="wp-admin-section-title">

                                        <div>
                                            <h2>Overview</h2>

                                            <p>
                                                Summary of your WritePad application.
                                            </p>
                                        </div>

                                    </div>

                                    {/* STATISTICS CARDS */}

                                    <div className="wp-admin-cards">

                                        <StatCard
                                            title="Total Users"
                                            value={stats.totalUsers}
                                            icon="♙"
                                            color="blue"
                                        />

                                        <StatCard
                                            title="Administrators"
                                            value={stats.totalAdmins}
                                            icon="♛"
                                            color="orange"
                                        />

                                        <StatCard
                                            title="Regular Users"
                                            value={stats.regularUsers}
                                            icon="♧"
                                            color="green"
                                        />

                                        <StatCard
                                            title="Total Notes"
                                            value={stats.totalNotes}
                                            icon="▤"
                                            color="red"
                                        />

                                    </div>

                                    {/* DASHBOARD PANELS */}

                                    <div className="wp-admin-dashboard-grid">

                                        <div className="wp-admin-panel">

                                            <h3>User Summary</h3>

                                            <RoleBar
                                                title="Administrators"
                                                value={stats.totalAdmins}
                                                total={stats.totalUsers}
                                                color="orange"
                                            />

                                            <RoleBar
                                                title="Regular Users"
                                                value={stats.regularUsers}
                                                total={stats.totalUsers}
                                                color="green"
                                            />

                                        </div>

                                        <div className="wp-admin-panel">

                                            <h3>Quick Actions</h3>

                                            <button
                                                className="wp-admin-action"
                                                onClick={() => changePage("users")}
                                            >
                                                View All Users →
                                            </button>

                                            <button
                                                className="wp-admin-action"
                                                onClick={() => changePage("notes")}
                                            >
                                                View All Notes →
                                            </button>

                                            <Link
                                                className="wp-admin-action primary"
                                                to="/admin/add-user"
                                            >
                                                + Create User / Admin
                                            </Link>

                                        </div>

                                    </div>

                                    {/* RECENT USERS */}

                                    <div className="wp-admin-panel wp-admin-recent">

                                        <div className="wp-admin-panel-heading">

                                            <h3>Recent Users</h3>

                                            <button
                                                onClick={() => changePage("users")}
                                            >
                                                View All
                                            </button>

                                        </div>

                                        <UsersTable
                                            users={users.slice(0, 5)}
                                        />

                                    </div>

                                </>

                            )}

                            {/* USER MANAGEMENT */}

                            {activePage === "users" && (

                                <div className="wp-admin-panel">

                                    <div className="wp-admin-panel-heading">

                                        <h3>All Registered Users</h3>

                                        <Link
                                            to="/admin/add-user"
                                            className="wp-admin-create-button"
                                        >
                                            + Add User / Admin
                                        </Link>

                                    </div>

                                    <UsersTable users={users} />

                                </div>

                            )}

                            {/* NOTES MANAGEMENT */}

                            {activePage === "notes" && (

                                <div className="wp-admin-panel">

                                    <h3>All Application Notes</h3>

                                    <NotesTable notes={notes} />

                                </div>

                            )}

                        </>

                    )}

                </section>

            </main>

        </div>

    );

}

// =====================================
// STATISTICS CARD COMPONENT
// =====================================

function StatCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <div className={`wp-admin-stat-card ${color}`}>

            <div>
                <p>{title}</p>
                <h2>{value}</h2>
            </div>

            <span className="wp-admin-stat-icon">
                {icon}
            </span>

        </div>

    );

}

// =====================================
// USER ROLE SUMMARY COMPONENT
// =====================================

function RoleBar({
    title,
    value,
    total,
    color
}) {

    const percentage = total > 0
        ? Math.round((value / total) * 100)
        : 0;

    return (

        <div className="wp-admin-role-bar">

            <div>
                <span>{title}</span>

                <strong>
                    {value} ({percentage}%)
                </strong>
            </div>

            <div className="wp-admin-progress">

                <div
                    className={color}
                    style={{
                        width: `${percentage}%`
                    }}
                />

            </div>

        </div>

    );

}

// =====================================
// USERS TABLE COMPONENT
// =====================================

function UsersTable({ users }) {

    if (!users.length) {

        return (
            <p className="wp-admin-empty">
                No users found.
            </p>
        );

    }

    return (

        <div className="wp-admin-table-wrapper">

            <table className="wp-admin-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>

                </thead>

                <tbody>

                    {users.map((user) => {

                        const id = user.id ?? user.Id;

                        const username =
                            user.username ?? user.Username;

                        const email =
                            user.email ?? user.Email;

                        const role =
                            user.role ?? user.Role;

                        return (

                            <tr key={id}>

                                <td>{id}</td>

                                <td>{username}</td>

                                <td>{email}</td>

                                <td>

                                    <span
                                        className={`wp-admin-role-badge ${role === "Admin"
                                                ? "admin"
                                                : "user"
                                            }`}
                                    >
                                        {role}
                                    </span>

                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}

// =====================================
// NOTES TABLE COMPONENT
// =====================================

function NotesTable({ notes }) {

    if (!notes.length) {

        return (
            <p className="wp-admin-empty">
                No notes found.
            </p>
        );

    }

    return (

        <div className="wp-admin-table-wrapper">

            <table className="wp-admin-table">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Topic</th>
                        <th>Created By</th>
                        <th>Created Date</th>
                    </tr>

                </thead>

                <tbody>

                    {notes.map((note) => {

                        const id = note.id ?? note.Id;

                        const title =
                            note.title ?? note.Title;

                        const topic =
                            note.topic ?? note.Topic;

                        const username =
                            note.username ?? note.Username;

                        const createdAt =
                            note.createdAt ?? note.CreatedAt;

                        return (

                            <tr key={id}>

                                <td>{id}</td>

                                <td>{title}</td>

                                <td>{topic}</td>

                                <td>{username}</td>

                                <td>
                                    {createdAt
                                        ? new Date(createdAt).toLocaleDateString()
                                        : "-"}
                                </td>

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}

export default Admin;



