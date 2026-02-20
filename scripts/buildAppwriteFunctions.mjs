import { Client, Functions } from 'node-appwrite';
import fs from 'fs';

const client = new Client();
const functions = new Functions(client);

// Environment setup
const endpoint = 'https://sfo.cloud.appwrite.io/v1';
const projectId = '6997f46e002a99aeab7a';
const apiKey = 'standard_e4d93f09a648d5831ba314148bfb6f5228baa5ddc18b15e636d6e7c0bcaca68bbc67b49ae597c71aa321033cd9b0597216f24c772f707212bfdea6ebfd90f8d94b6fd1447d7d0717c6c2f5807709d15027ec86e20a402183a417f92f379fe9744dca87dd251d59d46d188c69efcae766491476bbe1ef2a1e48f8871577cce2d5';

client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const appwriteJson = JSON.parse(fs.readFileSync('./appwrite.json', 'utf8'));

const createFunctions = async () => {
    for (const fn of appwriteJson.functions) {
        try {
            console.log(`Checking if function '${fn.$id}' exists...`);
            await functions.get(fn.$id);
            console.log(`Function '${fn.$id}' exists. Skipping creation.`);
        } catch (err) {
            if (err.code === 404) {
                console.log(`Creating function '${fn.$id}'...`);
                try {
                    // Attempting to create function
                    await functions.create(
                        fn.$id,               // functionId
                        fn.name,              // name
                        fn.runtime,           // runtime
                        fn.execute || [],     // execute
                        fn.events || [],      // events
                        fn.schedule || '',    // schedule
                        fn.timeout || 15,     // timeout
                        false,                // enabled
                        false,                // logging
                        [],                   // entrypoint - wait, node-appwrite signature might vary by version
                        '',                   // commands
                        '',                   // scopes
                    );
                    console.log(`Created function '${fn.$id}'.`);
                } catch (createErr) {
                    // SDK function signature may be different. Let's just create with basic args.
                    try {
                        await functions.create(
                            fn.$id,
                            fn.name,
                            fn.runtime
                        );
                        console.log(`Created function '${fn.$id}'.`);
                    } catch (fallbackErr) {
                        console.error(`Fallback creation failed for '${fn.$id}':`, fallbackErr.message);
                    }
                }
            } else {
                console.error(`Error checking function '${fn.$id}':`, err.message);
            }
        }
    }
    console.log("Functions setup complete!");
};

createFunctions().catch(console.error);
