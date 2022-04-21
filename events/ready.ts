import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { Routes } from "discord.js/node_modules/discord-api-types/v9";
import { CommandList } from "../commands/_CommandList";
import { getDB } from "../database/database";

export const onReady = async (client: Client) => {
    const rest = new REST({ version: "9" })
        .setToken(process.env.TOKEN as string);

    const commandData = CommandList.map((command) => command.data.toJSON());

    await rest.put(
        Routes.applicationGuildCommands(
            client.user?.id || "missing id",
            process.env.GUILD_ID as string
        ),
        { body: commandData }
    );

    await rest.put(
        Routes.applicationGuildCommands(
            client.user?.id || "missing id",
            process.env.GUILD_ID2 as string
        ),
        { body: commandData }
    );

    // alter can have destructive properties, make sure to double-check table changes
    getDB().sync({alter: true});
    // getDB().sync();

    console.log( "Ready." );
};