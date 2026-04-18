import 'dotenv/config'
import fs from "fs";
import path from "node:path";

import { Client, Collection } from "discord.js"
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const debugFileLoader = false;

const BOT_TOKEN = process.env?.['DISCORD_BOT_TOKEN'];


// Create Discord Bot Client:
const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'GuildWebhooks']
});


// Util - File Loader Utility:
function getFilePaths(dirPath: string) {
    let paths: string[] = [];
    // Confirm Directory:
    if (!fs.existsSync(dirPath)) return paths;
    // Get & Filter File Paths:
    const files = fs.readdirSync(dirPath, { recursive: true, withFileTypes: true })
        ?.filter(f => !f.isDirectory() && !f.parentPath?.includes('disabled'))
    // For Each File Path:
    for (const file of files) {
        const filePath = path.join(file.parentPath ?? dirPath, file.name);
        if (debugFileLoader) console.info(`Loaded File:`, filePath)
        if (filePath?.endsWith('.js') || filePath?.endsWith('.ts')) {
            paths.push(filePath)
        }
    }
    return paths;
}


// Load & Initialize Commands:
client.commands = new Collection();
const commandFiles = getFilePaths(path.join(__dirname, 'commands'));
for (const filePath of commandFiles) {
    const { default: command } = await import(pathToFileURL(filePath)?.href);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command?.data?.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load & Initialize Buttons:
client.buttons = new Collection();
const buttonFiles = getFilePaths(path.join(__dirname, 'buttons'));
for (const filePath of buttonFiles) {
    const { default: button } = await import(pathToFileURL(filePath).href);
    if ('data' in button && 'execute' in button) {
        client.buttons.set(button.data.customId, button);
    } else {
        console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load & Initialize Events:
const eventFiles = getFilePaths(path.join(__dirname, 'events'));
for (const filePath of eventFiles) {
    const { default: event } = await import(pathToFileURL(filePath).href);
    if ('execute' in event) {
        // - Only Process "clientReady" event in API_ONLY Env Mode:
        if (process.env.ENVIRONMENT == 'api_only' && event?.name != 'clientReady') continue
        if (event?.once) {
            client.once(event?.name, (...args) => event?.execute(...args));
        } else {
            client.on(event?.name, (...args) => event?.execute(...args));
        }
    } else {
        console.log(`[WARNING] The event at ${filePath} is missing a required or "execute" property.`);
    }
}


// - DEBUG - File Loader Utility:
if (debugFileLoader) {
    console.log(`[✅] Loaded ${client.commands.size} command(s).`);
    console.log(`[✅] Loaded ${client.buttons.size} button(s).`);
    console.log(`[✅] Loaded ${eventFiles.length} event file(s).`);
}


// + Discord Bot Login:
await client.login(BOT_TOKEN)