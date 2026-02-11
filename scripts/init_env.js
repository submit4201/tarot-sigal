import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');

const PROJECT_ID = '69477c330029f16459cd';

try {
    console.log('Generating API Key via Appwrite CLI...');

    // Create API Key
    const cmd = `appwrite projects create-key --project-id ${PROJECT_ID} --name "Auto Setup Script" --scopes databases.read databases.write collections.read collections.write attributes.read attributes.write indexes.read indexes.write --json`;
    const output = execSync(cmd, { encoding: 'utf-8' });

    const keyData = JSON.parse(output);
    const newKey = keyData.secret;

    console.log('API Key generated successfully.');

    // Update .env
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Remove existing APPWRITE_API_KEY if present
    const lines = envContent.split('\n').filter(line => !line.startsWith('APPWRITE_API_KEY='));

    // Add new key
    lines.push(`APPWRITE_API_KEY=${newKey}`);

    const newEnvContent = lines.join('\n');
    fs.writeFileSync(envPath, newEnvContent);

    console.log('.env file updated with new API Key.');

} catch (error) {
    console.error('Error generating API Key via CLI:', error.message);
    if (error.stdout) console.log('Stdout:', error.stdout.toString());
    if (error.stderr) console.error('Stderr:', error.stderr.toString());
    process.exit(1);
}
