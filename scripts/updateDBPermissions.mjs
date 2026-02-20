import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client();
const databases = new Databases(client);

// Environment setup
const endpoint = 'https://sfo.cloud.appwrite.io/v1';
const projectId = '6997f46e002a99aeab7a';
// We must use the API Key here to bypass the CLI restrictions on permissions edits
const apiKey = '841812c3a04c31e69b046a89090832aa4a22aae925932eb14b5ef80fc4c76c1fbadb137d5b3640a8aeb9be13bee3446a8b98e1ee7d6aaac9cba1b33cc0f51a8063a7fa9675276249d41b5b2c606d47f9b54b3ce35b437c1007faad64b98f999c7067210ff9561dd5ba0d971c2e055186d4810d100641410ab84fc74102bfd63f';

client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const dbId = 'gridpunk-arcana';

// The private collections where users only see their own data
const privateCollections = ['profiles', 'readings', 'journal_entries', 'daily_draws', 'purchases'];

const updatePermissions = async () => {
    for (const collectionId of privateCollections) {
        try {
            console.log(`Securing collection '${collectionId}'...`);
            const col = await databases.getCollection(dbId, collectionId);

            await databases.updateCollection(
                dbId,
                collectionId,
                col.name,
                [
                    Permission.create(Role.users()) // Any logged-in user can create a document
                    // Note: We DO NOT add Read/Update/Delete here.
                    // Appwrite automatically grants those to the Document Creator when documentSecurity is true.
                ],
                true // Enable Document Level Security!
            );
            console.log(`Secured '${collectionId}' with DLS.`);
        } catch (err) {
            console.error(`Error securing '${collectionId}':`, err.message);
        }
    }

    // System logs shouldn't even be created by users, only the backend
    try {
        console.log(`Securing collection 'system_logs'...`);
        const col = await databases.getCollection(dbId, 'system_logs');
        await databases.updateCollection(
            dbId,
            'system_logs',
            col.name,
            [], // Empty array = No client access at all. Only Server SDK functions can read/write this.
            false
        );
        console.log(`Secured 'system_logs'.`);
    } catch (err) {
        console.error(`Error securing 'system_logs':`, err.message);
    }

    console.log("All Database Permissions successfully secured!");
};

updatePermissions().catch(console.error);
