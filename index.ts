import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { onInteraction } from './events/interaction';
import { onReady } from './events/ready';
dotenv.config();

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

(async () => {
    client.on("ready", async () => await onReady(client));
    client.on("interactionCreate", async (interaction) => await onInteraction(interaction));

    await client.login(process.env.TOKEN);
})();