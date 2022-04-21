import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

(async () => {
    await client.login(process.env.TOKEN);
})();