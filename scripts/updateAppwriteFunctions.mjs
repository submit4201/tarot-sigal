import { Client, Functions } from 'node-appwrite';
import fs from 'fs';

const client = new Client();
const functions = new Functions(client);

// Environment setup
const endpoint = 'https://sfo.cloud.appwrite.io/v1';
const projectId = '6997f46e002a99aeab7a';
const apiKey = '841812c3a04c31e69b046a89090832aa4a22aae925932eb14b5ef80fc4c76c1fbadb137d5b3640a8aeb9be13bee3446a8b98e1ee7d6aaac9cba1b33cc0f51a8063a7fa9675276249d41b5b2c606d47f9b54b3ce35b437c1007faad64b98f999c7067210ff9561dd5ba0d971c2e055186d4810d100641410ab84fc74102bfd63f';

client.setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const appwriteJson = JSON.parse(fs.readFileSync('./appwrite.json', 'utf8'));

const updateFunctions = async () => {
    for (const fn of appwriteJson.functions) {
        try {
            console.log(`Updating function '${fn.$id}'...`);
            // Appwrite 1.4+ update function 
            // functionId, name, runtime, execute, events, schedule, timeout, enabled, logging, entrypoint, commands, scopes
            await functions.update(
                fn.$id,
                fn.name,
                fn.runtime,
                fn.execute || [],
                fn.events || [],
                fn.schedule || '',
                fn.timeout || 15,
                true, // enabled
                true, // logging
                fn.entrypoint || 'src/main.js',
                fn.commands || 'npm install',
                fn.scopes || []
            );
            console.log(`Updated function '${fn.$id}'.`);
        } catch (err) {
            console.error(`Error updating function '${fn.$id}':`, err.message);
        }
    }
    console.log("Functions update complete!");
};

updateFunctions().catch(console.error);
