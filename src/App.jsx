
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Home from "./Components/Home.jsx";
import About from "./Components/About.jsx";
import Navbar from "./Components/Navbar.jsx";
import Notes from "./Components/Note.jsx";
import AddNote from "./Components/AddNote.jsx";
import Register from "./Components/Register";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import NoteState from "./context_notes/NoteState";
import "./App.css";

function App() {
    return (
        <NoteState>
            <Router>
                <Navbar />

                <div className="container">
                    <Routes>
                        {/* Public pages */}
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/register"
                            element={<Register />}
                        />
                        <Route
                            path="/about"
                            element={<About />}
                        />

                        {/* Protected pages */}
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
                    </Routes>
                </div>
            </Router>
        </NoteState>
    );
}

export default App;
