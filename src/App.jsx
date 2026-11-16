
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

// Components
import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Navbar from "./Components/Navbar.jsx";
import Notes from "./Components/Note.jsx";
import AddNote from "./Components/AddNote.jsx";
import Register from "./Components/Register.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Admin from "./Components/Admin.jsx";
import AddUser from "./Components/AddUser.jsx";

// Context
import NoteState from "./context_notes/NoteState";

// CSS
import "./App.css";

function App() {
    return (
        <NoteState>
            <Router>

                <Navbar />

                <div className="container">

                    <Routes>

                        {/* PUBLIC ROUTES */}

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        {/* PROTECTED USER ROUTES */}

                        <Route element={<ProtectedRoute />}>

                            <Route
                                path="/notes"
                                element={<Notes />}
                            />

                            <Route
                                path="/add-note"
                                element={<AddNote />}
                            />

                        </Route>

                        {/* ADMIN ROUTES */}

                        <Route
                            element={<ProtectedRoute adminOnly={true} />}
                        >

                            <Route
                                path="/admin"
                                element={<Admin />}
                            />

                            <Route
                                path="/admin/add-user"    
                                element={<AddUser />}
                            />

                        </Route>

                    </Routes>

                </div>

            </Router>
        </NoteState>
    );
}

export default App;




