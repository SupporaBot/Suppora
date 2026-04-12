// Imports
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { REST, RESTPutAPIApplicationCommandsResult, Routes } from "discord.js";
import { fileURLToPath, pathToFileURL } from "node:url";


// Bot Variables:
const botToken = process.env?.DISCORD_BOT_TOKEN
const clientId = process.env?.DISCORD_CLIENT_ID
const rest = new REST().setToken(botToken);

// File Variables:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cmdFolderPath = path.join(__dirname, "../commands");



// Load Command Files:
const loadedCommands = []
const cmdFiles = fs.readdirSync(cmdFolderPath, { recursive: true, withFileTypes: true })
    .filter(f => !f.isDirectory() && !f.parentPath?.includes('disabled'))

for (const file of cmdFiles) {
    // Get Data from Cmd File(s):
    const filePath = path.join(file.parentPath, file.name)
    const fileModule = await import(String(pathToFileURL(filePath)));
    const fileData = fileModule?.default ?? fileModule
    // Confirm & Add to Loaded Array:
    if ("data" in fileData && "execute" in fileData) {
        const cmdJSON = fileData?.data?.toJSON()
        loadedCommands.push(cmdJSON)
    }
    else {
        console.warn(`[WARNING] Missing either required "data" or "execute" property from command file: "${file.name}"`, filePath)
    }
}


// Deploy Loaded Commands to Discord API:
(async () => {
    try {
        console.log(`(i) Started refreshing ${loadedCommands.length} application (/) commands.`);
        // API Call:
        const data: RESTPutAPIApplicationCommandsResult = await rest.put(Routes.applicationCommands(clientId), {
            body: loadedCommands
        }) as any;
        console.log(`(✔) Successfully reloaded ${data?.length} application (/) commands.`);

    } catch (error) {
        // On API Error:
        console.error('[FAILED] Deploying bot commands to Discord API', error);
    }
})();
