import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';
import { UserProfile, SavedReading, JournalEntry, DrawnCard, DailyDrawRecord } from '../types';

// Initialize Appwrite Client
const client = new Client();

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'gridpunk-arcana';

// Collections
export const COLLECTIONS = {
    PROFILES: 'profiles',
    READINGS: 'readings',
    JOURNAL: 'journal_entries',
    DAILY_DRAWS: 'daily_draws',
    PURCHASES: 'purchases'
};

if (PROJECT_ID) {
    client
        .setEndpoint(ENDPOINT)
        .setProject(PROJECT_ID);
} else {
    console.error('Appwrite Project ID not found in environment variables.');
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// --- Auth Helpers ---

export const loginWithEmail = async (email, password) => {
    return await account.createEmailPasswordSession(email, password);
};

export const signupWithEmail = async (email, password, name) => {
    await account.create(ID.unique(), email, password, name);
    return await loginWithEmail(email, password);
};

export const logout = async () => {
    return await account.deleteSession('current');
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        return null;
    }
};

export const loginWithOAuth = (provider) => {
    account.createOAuth2Session(
        provider,
        window.location.origin, // Success URL
        window.location.origin  // Failure URL
    );
};

// --- Database Helpers ---

export const db = {
    // Profile
    getProfile: async (userId) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROFILES,
                [Query.equal('userId', userId)]
            );
            return response.documents[0] || null;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    },

    createProfile: async (profileData) => {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            ID.unique(),
            profileData
        );
    },

    updateProfile: async (documentId, updates) => {
        return await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.PROFILES,
            documentId,
            updates
        );
    },

    // Readings
    saveReading: async (reading) => {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.READINGS,
            ID.unique(),
            reading
        );
    },

    getReadings: async (userId) => {
        return await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.READINGS,
            [Query.equal('userId', userId), Query.orderDesc('createdAt')]
        );
    },

    // Journal
    addJournalEntry: async (entry) => {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.JOURNAL,
            ID.unique(),
            entry
        );
    },

    getJournalEntries: async (userId) => {
        return await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.JOURNAL,
            [Query.equal('userId', userId), Query.orderDesc('createdAt')]
        );
    },

    // Daily Draws
    addDailyDraw: async (draw) => {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.DAILY_DRAWS,
            ID.unique(),
            draw
        );
    },

    getDailyHistory: async (userId) => {
        return await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.DAILY_DRAWS,
            [Query.equal('userId', userId), Query.orderDesc('date'), Query.limit(30)]
        );
    }
};

export default client;
