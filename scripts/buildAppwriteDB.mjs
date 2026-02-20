import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client();
const databases = new Databases(client);

// Environment setup
const endpoint = 'https://sfo.cloud.appwrite.io/v1';
const projectId = '6997f46e002a99aeab7a';
const apiKey = 'standard_e4d93f09a648d5831ba314148bfb6f5228baa5ddc18b15e636d6e7c0bcaca68bbc67b49ae597c71aa321033cd9b0597216f24c772f707212bfdea6ebfd90f8d94b6fd1447d7d0717c6c2f5807709d15027ec86e20a402183a417f92f379fe9744dca87dd251d59d46d188c69efcae766491476bbe1ef2a1e48f8871577cce2d5';

client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buildDatabase = async () => {
    const dbId = 'gridpunk-arcana';

    try {
        console.log(`Deleting existing database '${dbId}'...`);
        await databases.delete(dbId);
        console.log(`Database deleted.`);
        await sleep(2000);
    } catch (err) {
        if (err.code !== 404) console.warn("Delete DB error:", err.message);
    }

    try {
        console.log(`Creating database '${dbId}'...`);
        await databases.create(dbId, 'Gridpunk Arcana DB');
    } catch (error) {
        throw error;
    }

    // Define our collections
    const schema = {
        profiles: {
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: true },
                { key: 'givenName', type: 'string', size: 100, required: false },
                { key: 'currentName', type: 'string', size: 100, required: false },
                { key: 'birthDate', type: 'string', size: 20, required: false },
                { key: 'level', type: 'integer', required: false },
                { key: 'xp', type: 'integer', required: false },
                { key: 'stardust', type: 'integer', required: false },
                { key: 'isPremium', type: 'boolean', required: false },
                { key: 'subTier', type: 'string', size: 20, required: false, default: 'free' },
                { key: 'subExpiry', type: 'string', size: 50, required: false },
                { key: 'decks', type: 'string', size: 255, required: false, array: true },
                { key: 'achievements', type: 'string', size: 255, required: false, array: true }
            ],
            indexes: [
                { key: 'idx_profiles_user', type: 'key', attributes: ['userId'], orders: ['ASC'] }
            ]
        },
        readings: {
            documentSecurity: true,
            permissions: [Permission.create(Role.users())],
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: true },
                { key: 'profileId', type: 'string', size: 36, required: false },
                { key: 'spread', type: 'string', size: 50, required: false },
                { key: 'question', type: 'string', size: 500, required: false },
                { key: 'cards', type: 'string', size: 2000, required: false },
                { key: 'aiSummary', type: 'string', size: 5000, required: false },
                { key: 'notes', type: 'string', size: 2000, required: false },
                { key: 'createdAt', type: 'string', size: 50, required: true }
            ],
            indexes: [
                { key: 'idx_readings_user', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'idx_readings_created', type: 'key', attributes: ['createdAt'], orders: ['DESC'] }
            ]
        },
        journal_entries: {
            documentSecurity: true,
            permissions: [Permission.create(Role.users())],
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: true },
                { key: 'profileId', type: 'string', size: 36, required: false },
                { key: 'text', type: 'string', size: 5000, required: false },
                { key: 'linkedCard', type: 'string', size: 50, required: false },
                { key: 'createdAt', type: 'string', size: 50, required: true }
            ],
            indexes: [
                { key: 'idx_journal_user', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'idx_journal_created', type: 'key', attributes: ['createdAt'], orders: ['DESC'] }
            ]
        },
        daily_draws: {
            documentSecurity: true,
            permissions: [Permission.create(Role.users())],
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: true },
                { key: 'card', type: 'string', size: 50, required: false },
                { key: 'isRev', type: 'boolean', required: false },
                { key: 'date', type: 'string', size: 20, required: false },
                { key: 'insights', type: 'string', size: 1000, required: false }
            ],
            indexes: [
                { key: 'idx_daily_user', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'idx_daily_date', type: 'key', attributes: ['date'], orders: ['DESC'] }
            ]
        },
        purchases: {
            documentSecurity: true,
            permissions: [Permission.create(Role.users())],
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: true },
                { key: 'type', type: 'string', size: 50, required: false },
                { key: 'amount', type: 'integer', required: false },
                { key: 'stripeId', type: 'string', size: 100, required: false },
                { key: 'status', type: 'string', size: 20, required: false },
                { key: 'createdAt', type: 'string', size: 50, required: true }
            ],
            indexes: [
                { key: 'idx_purchases_user', type: 'key', attributes: ['userId'], orders: ['ASC'] }
            ]
        },
        system_logs: {
            attributes: [
                { key: 'userId', type: 'string', size: 36, required: false },
                { key: 'action', type: 'string', size: 100, required: false },
                { key: 'details', type: 'string', size: 5000, required: false },
                { key: 'timestamp', type: 'string', size: 50, required: true }
            ],
            indexes: [
                { key: 'idx_syslogs_user', type: 'key', attributes: ['userId'], orders: ['ASC'] },
                { key: 'idx_syslogs_time', type: 'key', attributes: ['timestamp'], orders: ['DESC'] }
            ]
        }
    };

    for (const [colName, config] of Object.entries(schema)) {
        try {
            console.log(`Checking collection '${colName}'...`);
            await databases.getCollection(dbId, colName);
            console.log(`Collection '${colName}' exists. Skipping creation.`);
            continue;
        } catch (e) {
            if (e.code === 404) {
                console.log(`Creating collection '${colName}'...`);
                // permissions array is empty means use DB default settings
                await databases.createCollection(dbId, colName, colName);
                console.log(`Created collection '${colName}'.`);
                await sleep(500); // Wait for Appwrite metadata propagation
            } else {
                throw e;
            }
        }

        // Process Attributes
        for (const attr of config.attributes) {
            console.log(`- Adding attribute '${attr.key}' of type '${attr.type}'...`);
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(dbId, colName, attr.key, attr.size, attr.required, attr.default, attr.array);
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(dbId, colName, attr.key, attr.required, attr.default >= 0 ? 0 : null, null, attr.default);
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(dbId, colName, attr.key, attr.required, attr.default);
                }
                await sleep(400); // Important! API throttles concurrent attribute creations occasionally
            } catch (err) {
                if (err.code === 409) {
                    console.log(`  Attribute '${attr.key}' already exists.`);
                } else {
                    console.error(`  Error adding attribute '${attr.key}':`, err);
                }
            }
        }

        // Wait for attributes to become "available" before indexing
        console.log(`- Waiting for attributes on '${colName}' to process before indexing...`);
        await sleep(2000);

        // Process Indexes
        for (const idx of config.indexes) {
            console.log(`- Adding index '${idx.key}'...`);
            try {
                await databases.createIndex(dbId, colName, idx.key, idx.type, idx.attributes, idx.orders);
                await sleep(500);
            } catch (err) {
                if (err.code === 409) {
                    console.log(`  Index '${idx.key}' already exists.`);
                } else {
                    console.error(`  Error adding index '${idx.key}':`, err.message);
                }
            }
        }
        console.log(`--- Finished collection '${colName}' ---`);
    }

    console.log("Database Setup Complete!");
};

buildDatabase().catch(console.error);
