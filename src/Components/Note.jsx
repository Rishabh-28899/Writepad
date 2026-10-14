
import React, { useContext, useEffect, useState } from "react";
import noteContext from "../context_notes/noteContext";
import NotesItem from "./NotesItem";

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

    useEffect(() => {
        getNotes();
    }, []);

    // Open the modal and load the selected note
    const handleEdit = (note) => {
        setCurrentNote(note);
        setTitle(note.title || "");
        setDescription(note.description || "");
        setTag(note.tag || "");
        setError("");
        setShowModal(true);
    };

    // Update the selected note
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!currentNote) return;

        // Check whether NoteState provides updateNote
        if (typeof updateNote !== "function") {
            setError(
                "updateNote is missing from NoteState.jsx. Add the function and expose it through noteContext.Provider."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateNote(
                currentNote.id,
                title,
                description,
                tag
            );

            await getNotes();

            setShowModal(false);
            setCurrentNote(null);
        } catch (err) {
            setError(err.message || "Failed to update note.");
        } finally {
            setSaving(false);
        }
    };

    // Delete the selected note
    const handleDelete = async (id) => {
        if (typeof deleteNote !== "function") {
            alert("deleteNote is missing from NoteState.jsx.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this note?")) {
            return;
        }

        try {
            await deleteNote(id);
            await getNotes();
        } catch (err) {
            alert(err.message || "Failed to delete note.");
        }
    };

    return (
        <div className="container">
            <h2 className="my-3 text-center">Your Notes</h2>

            <div className="row">
                {notes.map((note) => (
                    <NotesItem
                        key={note.id}
                        note={note}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {/* Edit Note Modal */}
            {showModal && (
                <>
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <form onSubmit={handleUpdate}>
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Edit Note
                                        </h5>

                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            disabled={saving}
                                            onClick={() => setShowModal(false)}
                                        />
                                    </div>

                                    <div className="modal-body">
                                        {error && (
                                            <div className="alert alert-danger">
                                                {error}
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={title}
                                                onChange={(e) =>
                                                    setTitle(e.target.value)
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Description
                                            </label>
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                value={description}
                                                onChange={(e) =>
                                                    setDescription(e.target.value)
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Tag
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={tag}
                                                onChange={(e) =>
                                                    setTag(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            disabled={saving}
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary"
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
                    </div>

                    <div
                        className="modal-backdrop fade show"
                        onClick={() => {
                            if (!saving) setShowModal(false);
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default Notes;


