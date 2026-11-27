
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from "../context_notes/noteContext";

const AddNote = () => {

    const { addNote } = useContext(noteContext);

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            // Save note and refresh notes list
            await addNote(title, content, topic);

            // Clear form
            setTitle("");
            setContent("");
            setTopic("");

            // Navigate to Notes Dashboard
            navigate("/notes", { replace: true });

        } catch (error) {

            console.error("Error adding note:", error);

            // NoteState already displays the error using SweetAlert

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="container">

            <h2 className="my-3">
                Add Note
            </h2>

            <form onSubmit={handleSubmit}>

                {/* TITLE */}
                <div className="mb-3">

                    <label
                        htmlFor="title"
                        className="form-label"
                    >
                        Title
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                </div>

                {/* CONTENT */}
                <div className="mb-3">

                    <label
                        htmlFor="content"
                        className="form-label"
                    >
                        Content
                    </label>

                    <textarea
                        className="form-control"
                        id="content"
                        rows="4"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                </div>

                {/* TOPIC */}
                <div className="mb-3">

                    <label
                        htmlFor="topic"
                        className="form-label"
                    >
                        Topic
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />

                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Note"}
                </button>

            </form>

        </div>
    );
};

export default AddNote;
