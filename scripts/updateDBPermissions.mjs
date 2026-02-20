import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client();
const databases = new Databases(client);

// Environment setup
const endpoint = 'https://sfo.cloud.appwrite.io/v1';
const projectId = '6997f46e002a99aeab7a';
const apiKey = '841812c3a04c31e69b046a89090832aa4a22aae925932eb14b5ef80fc4c76c1fbadb137d5b3640a8aeb9be13bee3446a8b98e1ee7d6aaac9cba1b33cc0f51a8063a7fa9675276249d41b5b2c606d47f9b54b3ce35b437c1007faad64b98f999c7067210ff9561dd5ba0d971c2e055186d4810d100641410ab84fc74102bfd63f';

client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const dbId = 'gridpunk-arcana';
const collections = ['profiles', 'readings', 'journal_entries', 'daily_draws', 'purchases', 'system_logs'];

// Granting blanket Any access for now to ensure the frontend works.
// You can lock this down later in the Appwrite Dashboard to only 'users' if desired!
const basePermissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any())
];

const updatePermissions = async () => {
    for (const collectionId of collections) {
        try {
            console.log(`Updating permissions for collection '${collectionId}'...`);
            // We get the collection first to know its current name
            const col = await databases.getCollection(dbId, collectionId);

            await databases.updateCollection(
                dbId,
                collectionId,
                col.name,
                basePermissions,
                false // documentSecurity 
            );
            console.log(`Updated permissions for '${collectionId}'.`);
        } catch (err) {
            console.error(`Error updating collection '${collectionId}':`, err.message);
        }
    }
    console.log("Permissions update complete!");
};

updatePermissions().catch(console.error);
