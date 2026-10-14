
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

import NoteState from "./context_notes/NoteState";
import "./App.css";

function App() {
  return (
    <NoteState>
      <Router>
        <Navbar />

        <div className="container">
          <Routes>
            {/* Home page */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* My Notes page */}
            <Route
              path="/notes"
              element={<Notes />}
            />

            {/* Add New Note page */}
            <Route
              path="/add-note"
              element={<AddNote />}
            />

            {/* About page */}
            <Route
              path="/about"
              element={<About />}
            />
          </Routes>
        </div>
      </Router>
    </NoteState>
  );
}

export default App;