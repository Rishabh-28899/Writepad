
import { useState, useCallback } from "react";
import { apiRequest } from "../Services/apiClient";
import noteContext from "./noteContext";
import Swal from "sweetalert2";

const NoteState = (props) => {
    const host = "https://localhost:7067";

    const [notes, setNotes] = useState([]);

    // CLEAR NOTES
    const clearNotes = useCallback(() => {
        setNotes([]);
    }, []);

    // GET NOTES BELONGING TO CURRENT USER
    const getNotes = useCallback(async () => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            console.error("Access token is missing!");
            clearNotes();
            return [];
        }

        try {
            const response = await apiRequest(
                `${host}/api/Notes/all`,
                {
                    method: "GET"
                }
            );

            console.log("Get Notes API Status:", response.status);

            const result = await response.json();

            console.log("Get Notes API Response:", result);

            if (!response.ok || !result.success) {

                if (
                    (response.status === 401 ||
                        response.status === 403) &&
                    localStorage.getItem("accessToken") === accessToken
                ) {
                    clearNotes();
                }

                throw new Error(
                    result.message || "Unable to retrieve notes."
                );
            }

            const noteList = Array.isArray(result.data)
                ? result.data
                : [];

            console.log("Retrieved notes:", noteList);

            setNotes(noteList);

            return noteList;

        } catch (error) {
            console.error("Get notes error:", error);
            throw error;
        }
    }, [clearNotes]);

    // ADD NOTE
    const addNote = async (title, content, topic) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Please log in before adding a note.");
        }

        try {
            const response = await apiRequest(
                `${host}/api/Notes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        title,
                        content,
                        topic
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to add note."
                );
            }

            // Refresh notes after adding
            await getNotes();

            await Swal.fire({
                title: "Note Added!",
                text: "Your note was saved successfully.",
                icon: "success",
                confirmButtonText: "OK"
            });

            return true;

        } catch (error) {
            await Swal.fire({
                title: "Unable to Add Note",
                text: error.message || "Something went wrong.",
                icon: "error"
            });

            throw error;
        }
    };

    // UPDATE NOTE
    const updateNote = async (id, title, description, tag) => {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            throw new Error("Please log in before updating a note.");
        }

        try {
            const response = await apiRequest(
                `${host}/api/Notes/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        Title: title,
                        Content: description,
                        Topic: tag
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Unable to update note."
                );
            }

            // Refresh notes after updating
            await getNotes();

            await Swal.fire({
                title: "Note Updated!",
                text: "Your changes have been saved.",
                icon: "success",
                confirmButtonText: "OK"
            });

            return true;

        } catch (error) {
            await Swal.fire({
                title: "Unable to Update Note",
                text: error.message || "Something went wrong.",
                icon: "error"
            });

            throw error;
        }
    };

    // DELETE NOTE
    const deleteNote = async (id) => {
        const confirmation = await Swal.fire({
            title: "Are you sure?",
            text: "This note will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (!confirmation.isConfirmed) {
            return false;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            clearNotes();
            throw new Error("Please log in before deleting a note.");
        }

        try {
            const response = await apiRequest(
                `${host}/api/Notes/${id}`,
                {
                    method: "DELETE"
                }
            );

            // Handle empty response and JSON response
            let result = null;

            if (response.status !== 204) {
                result = await response.json().catch(() => null);
            }

            if (!response.ok || result?.success === false) {
                throw new Error(
                    result?.message || "Unable to delete note."
                );
            }

            // Immediately remove deleted note from frontend state
            setNotes(previousNotes =>
                previousNotes.filter(note =>
                    String(note.id ?? note.Id ?? note.noteId ?? note.NoteId) !== String(id)
                )
            );

            // Synchronize frontend with backend
            await getNotes();

            await Swal.fire({
                title: "Deleted!",
                text: "Your note has been deleted.",
                icon: "success",
                confirmButtonText: "OK"
            });

            return true;

        } catch (error) {
            await Swal.fire({
                title: "Unable to Delete Note",
                text: error.message || "Something went wrong.",
                icon: "error"
            });

            throw error;
        }
    };

    return (
        <noteContext.Provider
            value={{
                notes,
                getNotes,
                addNote,
                updateNote,
                deleteNote,
                clearNotes
            }}
        >
            {props.children}
        </noteContext.Provider>
    );
};

export default NoteState;



