
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
            const response = await apiRequest(`${host}/api/Notes/all`, {
                method: "GET"
            });

            console.log("API Status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();

                console.error("API Error Response:", errorText);

                if (
                    (response.status === 401 || response.status === 403) &&
                    localStorage.getItem("accessToken") === accessToken
                ) {
                    clearNotes();
                }

                throw new Error(
                    errorText || `Get notes failed: ${response.status}`
                );
            }

            const data = await response.json();

            const result = Array.isArray(data) ? data : [];

            setNotes(result);

            return result;

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
            const response = await apiRequest(`${host}/api/Notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    content,
                    topic
                })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || `Add note failed: ${response.status}`
                );
            }

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
            const response = await apiRequest(`${host}/api/Notes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Title: title,
                    Content: description,
                    Topic: tag
                })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || `Update failed: ${response.status}`
                );
            }

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
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This note will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) {
            return false;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            clearNotes();
            throw new Error("Please log in before deleting a note.");
        }

        try {
            const response = await apiRequest(`${host}/api/Notes/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || `Delete failed: ${response.status}`
                );
            }

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




