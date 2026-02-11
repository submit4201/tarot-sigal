import { Client, Databases, ID, Permission, Role } from 'node-appwrite';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || 'gridpunk-arcana';
const API_KEY = process.env.APPWRITE_API_KEY;

if (!API_KEY) {
    console.error('Error: APPWRITE_API_KEY is missing. Please add it to your .env file or pass it as an environment variable.');
    console.error('You can generate an API Key in the Appwrite Console -> Project Settings -> API Keys.');
    console.error('Required scopes: Database (read/write), Collections (read/write), Attributes (read/write), Indexes (read/write).');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const db = new Databases(client);

const COLLECTIONS = {
    PROFILES: 'profiles',
    READINGS: 'readings',
    JOURNAL: 'journal_entries',
    DAILY_DRAWS: 'daily_draws',
    PURCHASES: 'purchases'
};

const setup = async () => {
    console.log(`Initializing Appwrite Setup for Project: ${PROJECT_ID}`);

    // 1. Create Database
    try {
        await db.get(DATABASE_ID);
        console.log(`Database '${DATABASE_ID}' already exists.`);
    } catch (error) {
        if (error.code === 404) {
            console.log(`Creating database '${DATABASE_ID}'...`);
            await db.create(DATABASE_ID, DATABASE_ID);
            console.log('Database created.');
        } else {
            throw error;
        }
    }

    // 2. Create Collections
    await createCollection(COLLECTIONS.PROFILES, 'User Profiles');
    await createCollection(COLLECTIONS.READINGS, 'Tarot Readings');
    await createCollection(COLLECTIONS.JOURNAL, 'Journal Entries');
    await createCollection(COLLECTIONS.DAILY_DRAWS, 'Daily Draws');
    await createCollection(COLLECTIONS.PURCHASES, 'Purchase History');

    // 3. Create Attributes

    // Profiles
    await createAttribute(COLLECTIONS.PROFILES, 'userId', 'string', 36, true);
    await createAttribute(COLLECTIONS.PROFILES, 'givenName', 'string', 100, false);
    await createAttribute(COLLECTIONS.PROFILES, 'currentName', 'string', 100, false);
    await createAttribute(COLLECTIONS.PROFILES, 'birthDate', 'string', 20, false);
    await createAttribute(COLLECTIONS.PROFILES, 'level', 'integer', null, false, 1);
    await createAttribute(COLLECTIONS.PROFILES, 'xp', 'integer', null, false, 0);
    await createAttribute(COLLECTIONS.PROFILES, 'stardust', 'integer', null, false, 0);
    await createAttribute(COLLECTIONS.PROFILES, 'isPremium', 'boolean', null, false, false);
    await createAttribute(COLLECTIONS.PROFILES, 'subscriptionTier', 'string', 20, false, 'free');
    await createAttribute(COLLECTIONS.PROFILES, 'subscriptionExpiry', 'string', 50, false);
    await createAttribute(COLLECTIONS.PROFILES, 'ownedDeckIds', 'string', 255, false, null, true); // Array
    await createAttribute(COLLECTIONS.PROFILES, 'unlockedAchievements', 'string', 255, false, null, true); // Array

    // Readings
    await createAttribute(COLLECTIONS.READINGS, 'userId', 'string', 36, true);
    await createAttribute(COLLECTIONS.READINGS, 'profileId', 'string', 36, false);
    await createAttribute(COLLECTIONS.READINGS, 'spreadType', 'string', 50, true);
    await createAttribute(COLLECTIONS.READINGS, 'question', 'string', 500, false);
    await createAttribute(COLLECTIONS.READINGS, 'cards', 'string', 5000, true);
    await createAttribute(COLLECTIONS.READINGS, 'aiSummary', 'string', 10000, false);
    await createAttribute(COLLECTIONS.READINGS, 'notes', 'string', 5000, false);
    await createAttribute(COLLECTIONS.READINGS, 'createdAt', 'string', 50, true);

    // Journal
    await createAttribute(COLLECTIONS.JOURNAL, 'userId', 'string', 36, true);
    await createAttribute(COLLECTIONS.JOURNAL, 'profileId', 'string', 36, false);
    await createAttribute(COLLECTIONS.JOURNAL, 'text', 'string', 5000, true);
    await createAttribute(COLLECTIONS.JOURNAL, 'linkedCard', 'string', 50, false);
    await createAttribute(COLLECTIONS.JOURNAL, 'createdAt', 'string', 50, true);

    // Daily Draws
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'userId', 'string', 36, true);
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'profileId', 'string', 36, false);
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'cardName', 'string', 50, true);
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'isReversed', 'boolean', null, true);
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'date', 'string', 20, true);
    await createAttribute(COLLECTIONS.DAILY_DRAWS, 'insights', 'string', 1000, false);

    // Purchases
    await createAttribute(COLLECTIONS.PURCHASES, 'userId', 'string', 36, true);
    await createAttribute(COLLECTIONS.PURCHASES, 'type', 'string', 50, true);
    await createAttribute(COLLECTIONS.PURCHASES, 'amount', 'integer', null, true);
    await createAttribute(COLLECTIONS.PURCHASES, 'stripeSessionId', 'string', 100, false);
    await createAttribute(COLLECTIONS.PURCHASES, 'status', 'string', 20, true);
    await createAttribute(COLLECTIONS.PURCHASES, 'createdAt', 'string', 50, true);

    // 4. Create Indexes (Required for queries)
    console.log('Creating Indexes...');
    // Profiles: index on userId
    await createIndex(COLLECTIONS.PROFILES, 'idx_profiles_user', 'key', ['userId'], ['ASC']);

    // Readings: index on userId, createdAt
    await createIndex(COLLECTIONS.READINGS, 'idx_readings_user', 'key', ['userId'], ['ASC']);
    await createIndex(COLLECTIONS.READINGS, 'idx_readings_created', 'key', ['createdAt'], ['DESC']);

    // Journal: index on userId, createdAt
    await createIndex(COLLECTIONS.JOURNAL, 'idx_journal_user', 'key', ['userId'], ['ASC']);
    await createIndex(COLLECTIONS.JOURNAL, 'idx_journal_created', 'key', ['createdAt'], ['DESC']);

    // Daily Draws: index on userId, date
    await createIndex(COLLECTIONS.DAILY_DRAWS, 'idx_daily_user', 'key', ['userId'], ['ASC']);
    await createIndex(COLLECTIONS.DAILY_DRAWS, 'idx_daily_date', 'key', ['date'], ['DESC']);

    // 5. Update Permissions (Allow Access)
    console.log('Updating Collection Permissions...');

    // Default Permissions: Users can read/write their own data
    // We enable Document Security so users can only access their own documents (if set on doc creation)
    // But for "create", we must allow 'users' (any authenticated user) at the collection level.
    const defaultPermissions = [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users())
    ];

    await updatePermissions(COLLECTIONS.PROFILES, defaultPermissions);
    await updatePermissions(COLLECTIONS.READINGS, defaultPermissions);
    await updatePermissions(COLLECTIONS.JOURNAL, defaultPermissions);
    await updatePermissions(COLLECTIONS.DAILY_DRAWS, defaultPermissions);
    await updatePermissions(COLLECTIONS.PURCHASES, defaultPermissions);

    console.log('Setup Complete!');
};

async function createCollection(id, name) {
    try {
        await db.getCollection(DATABASE_ID, id);
        console.log(`Collection '${name}' (${id}) already exists.`);
    } catch (error) {
        if (error.code === 404) {
            console.log(`Creating collection '${name}' (${id})...`);
            // Enabled document security by default
            await db.createCollection(DATABASE_ID, id, name, [
                Permission.read(Role.users()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ], true);
            console.log(`Collection '${name}' created.`);
        } else {
            throw error;
        }
    }
}

async function createAttribute(collectionId, key, type, size, required, ...args) {
    try {
        if (type === 'string') {
            await db.createStringAttribute(DATABASE_ID, collectionId, key, size, required, ...args);
        } else if (type === 'integer') {
            await db.createIntegerAttribute(DATABASE_ID, collectionId, key, required, ...args);
        } else if (type === 'boolean') {
            await db.createBooleanAttribute(DATABASE_ID, collectionId, key, required, ...args);
        }
        console.log(`Attribute '${key}' created in '${collectionId}'.`);
        await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
        if (error.code === 409) {
            console.log(`Attribute '${key}' already exists in '${collectionId}'.`);
        } else {
            console.error(`Error creating attribute '${key}' in '${collectionId}':`, error.message);
        }
    }
}

async function createIndex(collectionId, key, type, attributes, orders) {
    try {
        await db.createIndex(DATABASE_ID, collectionId, key, type, attributes, orders);
        console.log(`Index '${key}' created in '${collectionId}'.`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Indexes take time
    } catch (error) {
        if (error.code === 409) {
            console.log(`Index '${key}' already exists in '${collectionId}'.`);
        } else {
            console.error(`Error creating index '${key}' in '${collectionId}':`, error.message);
        }
    }
}

async function updatePermissions(collectionId, permissions) {
    try {
        // Update collection to enable document security and set permissions
        await db.updateCollection(DATABASE_ID, collectionId, undefined, permissions, true);
        console.log(`Permissions updated for '${collectionId}'.`);
    } catch (error) {
        console.error(`Error updating permissions for '${collectionId}':`, error.message);
    }
}

setup().catch(console.error);
