
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
            refreshToken
        })
    });

    if (!response.ok) {
        throw new Error("Session expired. Please log in again.");
    }

    const result = await response.json();

    // Validate standardized API response
    if (
        !result.success ||
        !result.data?.accessToken ||
        !result.data?.refreshToken
    ) {
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

    // Extract custom option
    const { skipRefresh = false, ...requestOptions } = options;

    const accessToken = localStorage.getItem("accessToken");

    // Create request headers
    const createHeaders = (token) => {
        const headers = {
            ...requestOptions.headers
        };

        // Add JSON Content-Type automatically
        if (
            requestOptions.body &&
            !(requestOptions.body instanceof FormData) &&
            !headers["Content-Type"]
        ) {
            headers["Content-Type"] = "application/json";
        }

        // Attach access token
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    };

    // First API request
    let response = await fetch(url, {
        ...requestOptions,
        headers: createHeaders(accessToken)
    });

    // Identify refresh endpoint
    const isRefreshRequest = url.includes("/api/Auth/refresh");

    // Handle expired access token
    if (
        response.status === 401 &&
        !isRefreshRequest &&
        !skipRefresh
    ) {
        try {
            // Share one refresh request among simultaneous API calls
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken().finally(() => {
                    refreshPromise = null;
                });
            }

            const newAccessToken = await refreshPromise;

            // Retry original API request
            response = await fetch(url, {
                ...requestOptions,
                headers: createHeaders(newAccessToken)
            });

        } catch (error) {
            console.error("Token refresh failed:", error);

            // Clear authentication data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userRole");

            // Redirect to login
            window.location.replace("/");

            throw error;
        }
    }

    return response;
};
