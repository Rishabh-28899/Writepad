
const HOST = "https://localhost:7067";

// Prevent multiple simultaneous refresh requests
let refreshPromise = null;

// Refresh access token using refresh token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
        throw new Error("Refresh token is missing");
    }

    const response = await fetch(`${HOST}/api/Auth/refresh`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refreshToken: refreshToken
        })
    });

    if (!response.ok) {
        throw new Error("Session expired. Please log in again.");
    }

    const result = await response.json();

    // Validate standardized API response
    if (!result.success || !result.data?.accessToken || !result.data?.refreshToken) {
        throw new Error(
            result.message || "Token refresh failed."
        );
    }

    // Store new tokens
    localStorage.setItem("accessToken", result.data.accessToken);
    localStorage.setItem("refreshToken", result.data.refreshToken);

    return result.data.accessToken;
};

// Central API request function
export const apiRequest = async (url, options = {}) => {
    const accessToken = localStorage.getItem("accessToken");

    const createHeaders = (token) => ({
        ...options.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    });

    let response = await fetch(url, {
        ...options,
        headers: createHeaders(accessToken)
    });

    // If access token expires, refresh it
    if (response.status === 401) {
        try {
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;

            // Retry original request with new access token
            response = await fetch(url, {
                ...options,
                headers: createHeaders(newAccessToken)
            });

        } catch (error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");

            window.location.replace("/");

            throw error;
        }
    }

    return response;
};
