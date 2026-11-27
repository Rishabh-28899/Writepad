
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import noteContext from "../context_notes/noteContext";
import NotesItem from "./NotesItem";
import "./Notes.css";

const Notes = () => {
    const {
        notes = [],
        getNotes,
        updateNote,
        deleteNote
    } = useContext(noteContext);

    const [showModal, setShowModal] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    // LOAD NOTES
    useEffect(() => {
        let active = true;

        const loadNotes = async () => {
            try {
                await getNotes();
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load notes.");
                    console.error("Unable to load notes:", err);
                }
            }
        };

        loadNotes();

        return () => {
            active = false;
        };
    }, [getNotes]);

    // OPEN EDIT MODAL
    const handleEdit = (note) => {
        setCurrentNote(note);

        setTitle(note.title || "");
        setDescription(note.description || note.content || "");
        setTag(note.tag || note.topic || "");

        setError("");
        setShowModal(true);
    };

    // CLOSE EDIT MODAL
    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setCurrentNote(null);
        setError("");
    };

    // UPDATE NOTE
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!currentNote) return;

        if (typeof updateNote !== "function") {
            setError("updateNote is missing from NoteState.jsx.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateNote(
                currentNote.noteId,
                title,
                description,
                tag
            );

            setShowModal(false);
            setCurrentNote(null);

        } catch (err) {
            setError(err.message || "Failed to update note.");
        } finally {
            setSaving(false);
        }
    };

    // DELETE NOTE
    const handleDelete = async (id) => {
        if (typeof deleteNote !== "function") {
            alert("deleteNote is missing from NoteState.jsx.");
            return;
        }

        try {
            await deleteNote(id);
        } catch (err) {
            console.error("Unable to delete note:", err);
            alert(err.message || "Failed to delete note.");
        }
    };

    return (
        <div className="wp-user-page">

            {/* DASHBOARD HEADER */}
            <header className="wp-user-header">
                <div>
                    <span className="wp-user-eyebrow">
                        PERSONAL WORKSPACE
                    </span>

                    <h1>My Dashboard</h1>

                    <p>
                        Welcome back! Manage and organize your notes.
                    </p>
                </div>

                <Link
                    to="/add-note"
                    className="wp-user-add-button"
                >
                    <span>+</span> Add New Note
                </Link>
            </header>

            {/* STATISTICS */}
            <section className="wp-user-stats">

                <div className="wp-user-stat-card">
                    <div className="wp-user-stat-icon blue">
                        <span>▤</span>
                    </div>

                    <div>
                        <p>Total Notes</p>
                        <h2>{notes.length}</h2>
                    </div>
                </div>

                <div className="wp-user-stat-card">
                    <div className="wp-user-stat-icon green">
                        <span>✓</span>
                    </div>

                    <div>
                        <p>My Workspace</p>
                        <h2>Active</h2>
                    </div>
                </div>

            </section>

            {/* NOTES SECTION */}
            <section className="wp-user-notes-section">

                <div className="wp-user-section-header">
                    <div>
                        <h2>My Notes</h2>
                        <p>
                            View, edit and manage your saved notes.
                        </p>
                    </div>

                    <span className="wp-user-note-count">
                        {notes.length} Notes
                    </span>
                </div>

                {error && !showModal && (
                    <div className="wp-user-error">
                        {error}
                    </div>
                )}

                {notes.length === 0 ? (
                    <div className="wp-user-empty">
                        <div className="wp-user-empty-icon">
                            ▤
                        </div>

                        <h3>No notes available</h3>

                        <p>
                            Start organizing your thoughts by creating
                            your first note.
                        </p>

                        <Link
                            to="/add-note"
                            className="wp-user-add-button"
                        >
                            + Create Your First Note
                        </Link>
                    </div>
                ) : (
                    <div className="wp-user-notes-grid">
                        {notes.map((note) => (
                            <NotesItem
                                key={note.noteId}
                                note={note}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </section>

            {/* EDIT MODAL */}
            {showModal && (
                <div
                    className="wp-user-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >
                    <div
                        className="wp-user-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-note-title"
                    >

                        <div className="wp-user-modal-header">
                            <div>
                                <h2 id="edit-note-title">
                                    Edit Note
                                </h2>

                                <p>
                                    Update your note information.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="wp-user-modal-close"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="wp-user-modal-body">

                                {error && (
                                    <div className="wp-user-error">
                                        {error}
                                    </div>
                                )}

                                <div className="wp-user-field">
                                    <label htmlFor="edit-title">
                                        Title
                                    </label>

                                    <input
                                        id="edit-title"
                                        type="text"
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="wp-user-field">
                                    <label htmlFor="edit-description">
                                        Description
                                    </label>

                                    <textarea
                                        id="edit-description"
                                        rows="5"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="wp-user-field">
                                    <label htmlFor="edit-tag">
                                        Tag
                                    </label>

                                    <input
                                        id="edit-tag"
                                        type="text"
                                        value={tag}
                                        onChange={(e) =>
                                            setTag(e.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            <div className="wp-user-modal-footer">

                                <button
                                    type="button"
                                    className="wp-user-cancel-button"
                                    onClick={closeModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="wp-user-save-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Notes;





