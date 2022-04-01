import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { onInteraction } from './events/interaction';
import { onReady } from './events/ready';
dotenv.config();

(async () => {
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES
        ]
    });
    
    client.on("ready", async () => await onReady(client));
    client.on("interactionCreate", async (interaction) => await onInteraction(interaction));

    await client.login(process.env.TOKEN);
})();