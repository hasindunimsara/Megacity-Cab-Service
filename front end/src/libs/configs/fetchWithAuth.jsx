import { BASE_URL } from "./config";

const fetchWithAuth = async (url, options = {}) => {
    // const auth = JSON.parse(localStorage.getItem('auth')) || {};

    // const headers = new Headers(options.headers || {});
    // if (auth.accessToken) {
    //     headers.append('Authorization', `Bearer ${auth.accessToken}`);
    // }

    const fetchOptions = {
        ...options,
        // headers,
        // credentials: 'include',
    };

    const response = await fetch(`${BASE_URL}${url}`, fetchOptions);
    if (response.status === 403) {
        // Attempt to refresh the token
        const refreshSuccess = await refreshAccessToken();
        if (refreshSuccess) {
            const newAuth = JSON.parse(localStorage.getItem('auth'));
            headers.set('Authorization', `Bearer ${newAuth.accessToken}`);
            return fetch(`${BASE_URL}${url}`, {
                ...options,
                headers,
            });
        } else {
            // Redirect to login if refresh fails
            localStorage.removeItem('auth');
            window.location.href = '/';
            throw new Error('Session expired. Redirecting to login.');
        }
    }

    return response;
};

// Refresh Access Token
const refreshAccessToken = async () => {
    try {
        const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'POST',
            credentials: 'include', // Include cookies for refresh token
        });
        if (response.ok) {
            const data = await response.json();
            const { accessToken } = data;
            // Update the auth in localStorage
            localStorage.setItem(
                'auth',
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem('auth')),
                    accessToken,
                })
            );

            return true;
        } else {
            console.error('Failed to refresh access token');
            return false;
        }
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return false;
    }
};

export default fetchWithAuth;
