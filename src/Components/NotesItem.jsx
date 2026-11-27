
import "./NotesItem.css";

const NotesItem = ({ note, onEdit, onDelete }) => {

    return (
        <article className="wp-note-card">

            {/* CARD HEADER */}
            <div className="wp-note-card-header">

                <div className="wp-note-title-area">
                    <span className="wp-note-icon">▤</span>

                    <h3>
                        {note.title || "Untitled Note"}
                    </h3>
                </div>

                {/* EDIT AND DELETE ACTIONS */}
                <div className="wp-note-actions">

                    <button
                        type="button"
                        className="wp-note-edit"
                        title="Edit note"
                        aria-label="Edit note"
                        onClick={() => onEdit?.(note)}
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        className="wp-note-delete"
                        title="Delete note"
                        aria-label="Delete note"
                        onClick={() => onDelete?.(note.noteId)}
                    >
                        🗑️
                    </button>

                </div>

            </div>

            {/* NOTE CONTENT */}
            <div className="wp-note-card-content">
                <p>
                    {note.description ||
                        note.content ||
                        "No description available."}
                </p>
            </div>

            {/* NOTE TAG */}
            <div className="wp-note-card-footer">

                <span className="wp-note-tag">
                    #{note.tag || note.topic || "General"}
                </span>

            </div>

        </article>
    );
};

export default NotesItem;


