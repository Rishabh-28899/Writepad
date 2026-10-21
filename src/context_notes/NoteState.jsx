
import React, { useState } from "react";
import noteContext from "./noteContext";
import Swal from "sweetalert2";

// GET NOTES
const NoteState = (props) => {
    const host = "https://localhost:7067";
    const [notes, setNotes] = useState([]);

    // GET NOTES
    const getNotes = async () => {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(`${host}/api/Notes/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Get notes failed: ${response.status}`);
        }

        const data = await response.json();
        setNotes(data);

        return data;
    };

    // ADD NOTE
    const addNote = async (title, content, topic) => {
        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${host}/api/Notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ title, content, topic })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Add note failed: ${response.status}`);
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

        try {
            const response = await fetch(`${host}/api/Notes/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    Title: title,
                    Description: description,
                    Tag: tag
                })
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Update failed: ${response.status}`);
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

        // Stop if the user cancels
        if (!result.isConfirmed) {
            return false;
        }

        const accessToken = localStorage.getItem("accessToken");

        try {
            const response = await fetch(`${host}/api/Notes/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || `Delete failed: ${response.status}`);
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
                deleteNote
            }}
        >
            {props.children}
        </noteContext.Provider>
    );
};

export default NoteState;

