
import React from "react";

const NotesItem = (props) => {
    const { note, onEdit, onDelete } = props;

    const handleDelete = () => {
        if (onDelete) {
            onDelete(note.id);
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(note);
        }
    };

    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <h5 className="card-title mb-0">
                            {note.title}
                        </h5>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="edit-btn"
                                title="Edit note"
                                onClick={handleEdit}
                            >
                                ✏️
                            </button>

                            <button
                                type="button"
                                className="delete-btn"
                                title="Delete note"
                                onClick={handleDelete}
                            >
                                🗑️
                            </button>
                        </div>

                    </div>

                    <p className="card-text">
                        {note.description}
                    </p>

                    <p>{note.tag}</p>

                </div>
            </div>
        </div>
    );
};

export default NotesItem;
