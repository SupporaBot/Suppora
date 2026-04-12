import 'dotenv/config'
import fs from "fs";
import path from "node:path";

import { Client, Collection, Events, GatewayIntentBits } from "discord.js"
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = process.env?.['DISCORD_BOT_TOKEN'];


// Create Discord Bot Client:
const client = new Client({
    intents: ['Guilds', 'GuildMessages', 'DirectMessages', 'GuildWebhooks']
});


// Util - File Loader Utility:
async function getAllFiles(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory() && file != 'disabled') {
            getAllFiles(filePath, fileList); // Recurse into subfolder
        } else if (file.endsWith('.js') || file.endsWith('.ts')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}


// Load & Initialize Commands:
client.commands = new Collection();
const commandFiles = await getAllFiles(path.join(__dirname, 'commands'));
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
const buttonFiles = await getAllFiles(path.join(__dirname, 'buttons'));
for (const filePath of buttonFiles) {
    const { default: button } = await import(pathToFileURL(filePath).href);
    if ('data' in button && 'execute' in button) {
        client.buttons.set(button.data.customId, button);
    } else {
        console.log(`[WARNING] The button at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

// Load & Initialize Events:
const eventFiles = await getAllFiles(path.join(__dirname, 'events'));
for (const filePath of eventFiles) {
    const { default: event } = await import(pathToFileURL(filePath).href);
    if ('execute' in event) {
        if (event?.once) {
            // - Only Process "clientReady" event in API_ONLY Env Mode:
            if (process.env.ENVIRONMENT == 'api_only' && event?.name != 'clientReady') continue
            client.once(event?.name, (...args) => event?.execute(...args));
        } else {
            client.on(event?.name, (...args) => event?.execute(...args));
        }
    } else {
        console.log(`[WARNING] The event at ${filePath} is missing a required or "execute" property.`);
    }
}


// - DEBUG - File Loader Utility:
const debugFileLoader = false;
if (debugFileLoader) {
    console.log(`[✅] Loaded ${client.commands.size} command(s).`);
    console.log(`[✅] Loaded ${client.buttons.size} button(s).`);
    console.log(`[✅] Loaded ${eventFiles.length} event file(s).`);
}


// + Discord Bot Login:
client.login(BOT_TOKEN)