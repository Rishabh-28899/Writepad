
import React, { useState } from "react";
import noteContext from "./noteContext";

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

        const response = await fetch(`${host}/api/Notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ title, content, topic })
        });

        if (!response.ok) {
            throw new Error(`Add note failed: ${response.status}`);
        }

        const data = await response.json();
        await getNotes();
        return data;
    };

    // UPDATE NOTE
    const updateNote = async (id, title, description, tag) => {
        const accessToken = localStorage.getItem("accessToken");

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
        return true;
    };

    return (
        <noteContext.Provider
            value={{
                notes,
                getNotes,
                addNote,
                updateNote
            }}
        >
            {props.children}
        </noteContext.Provider>
    );
};

export default NoteState;

