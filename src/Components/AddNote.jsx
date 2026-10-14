import React, { useContext, useState } from "react";
import noteContext from "../context_notes/noteContext";

const AddNote = () => {

    const context = useContext(noteContext);

    const { addNote } = context;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [topic, setTopic] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await addNote(title, content, topic);

            alert("Note added successfully!");

            // Clear form
            setTitle("");
            setContent("");
            setTopic("");

        } catch (error) {

            console.error("Error adding note:", error);

            alert("Failed to add note");
        }
    };

    return (
        <div className="container">

            <h2 className="my-3">
                Add Note
            </h2>

            <form onSubmit={handleSubmit}>

                {/* Title */}
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


                {/* Content */}
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


                {/* Topic */}
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


                {/* Submit */}
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    Add Note
                </button>

            </form>

        </div>
    );
};

export default AddNote;