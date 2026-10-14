
import React, { useState } from "react";

function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Submit clicked");
        console.log("Username:", username);
        console.log("Password:", password);

        try {
            const response = await fetch(
                "https://localhost:7067/api/Auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            console.log("Login status:", response.status);

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`);
            }

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            console.log("Access token saved");
            console.log("Refresh token saved");

            alert("Login successful!");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="container">

            <h1>Add Notes</h1>

            <form onSubmit={handleSubmit}>

                <div className="mb-3 row">
                    <label
                        htmlFor="username"
                        className="col-sm-2 col-form-label"
                    >
                        Username
                    </label>

                    <div className="col-sm-10">
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-3 row">
                    <label
                        htmlFor="password"
                        className="col-sm-2 col-form-label"
                    >
                        Password
                    </label>

                    <div className="col-sm-10">
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        Submit
                    </button>
                </div>

            </form>
        </div>
    );
}

export default Home;



