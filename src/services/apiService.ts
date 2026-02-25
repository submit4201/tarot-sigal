/**
 * API Service for FastAPI backend
 * Replaces the previous Appwrite service.
 */

const API_BASE = import.meta.env.VITE_APP_URL || 'http://localhost:8000/api';

// --- Auth Utilities ---
function getToken() {
    return localStorage.getItem('jwt_token');
}

function setToken(token: string) {
    localStorage.setItem('jwt_token', token);
}

function removeToken() {
    localStorage.removeItem('jwt_token');
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API request failed: ${response.statusText}`);
    }

    // Return undefined for 204 No Content
    if (response.status === 204) {
        return;
    }
    return response.json();
}

// --- Auth Endpoints ---
export const auth = {
    login: async (email: string, password: string) => {
        // FastAPI OAuth2 implementation uses form data
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Login failed');
        }
        const data = await response.json();
        setToken(data.access_token);
        return data;
    },

    register: async (email: string, password: string, name: string) => {
        return apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, given_name: name })
        });
    },

    logout: async () => {
        removeToken();
    },

    getCurrentUser: async () => {
        if (!getToken()) return null;
        try {
            return await apiFetch('/auth/me');
        } catch (error) {
            removeToken();
            return null;
        }
    }
};

// --- CRUD Endpoints ---
export const db = {
    // Current User Profile wrapper (now wrapped in /auth/me)
    getProfile: async () => {
        return auth.getCurrentUser();
    },
    // We update via FastAPI endpoint, wait we don't have an update profile route yet! 
    // Need to add that to the backend if needed, or we adapt. Let's add an update profile endpoint to `api/auth.py` or similar later.
    updateProfile: async (updates: any) => {
        return apiFetch('/auth/me', {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    },

    // Readings
    getReadings: async () => {
        const data = await apiFetch('/readings/');
        return data;
    },
    saveReading: async (reading: any) => {
        return apiFetch('/readings/', {
            method: 'POST',
            body: JSON.stringify(reading)
        });
    },
    updateReading: async (id: string, notes: string) => {
        return apiFetch(`/readings/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ notes })
        });
    },

    // Journal
    getJournalEntries: async () => {
        const data = await apiFetch('/journal/');
        return data;
    },
    addJournalEntry: async (entry: any) => {
        return apiFetch('/journal/', {
            method: 'POST',
            body: JSON.stringify(entry)
        });
    },

    // Daily Draws
    getDailyHistory: async () => {
        const data = await apiFetch('/daily-draws/');
        return data;
    },
    addDailyDraw: async (draw: any) => {
        return apiFetch('/daily-draws/', {
            method: 'POST',
            body: JSON.stringify(draw)
        });
    },
    updateDailyDraw: async (id: string, insights: string) => {
        return apiFetch(`/daily-draws/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ insights })
        });
    }
};

export const birthProfile = {
    get: async () => {
        return apiFetch('/birth-profile/');
    },
    update: async (data: any) => {
        return apiFetch('/birth-profile/', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
};
