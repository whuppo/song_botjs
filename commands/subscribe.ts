import { SlashCommandBuilder } from "@discordjs/builders";
import { Op } from "sequelize";
import { client } from "..";
import { LFGSubscribe } from "../models/lfg-subscribe";
import { ServerSettings } from "../models/settings";
import { Command } from "./ICommand";

export const subscribe: Command = {
    data: new SlashCommandBuilder()
        .setName("subscribe")
        .setDescription("Subscribe to a server for cross-server LFG Posts, requires an LFG channel to be setup.")
        .addStringOption((option) =>
            option
                .setName("server-id")
                .setDescription("Server ID to subscribe to.")
                .setRequired(true)
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const serverSetting = await ServerSettings.findOne({
            where: {
                server_id: interaction.guildId,
                lfg_channel: {
                    [Op.not]: null
                }
            }
        });
        if (!serverSetting) {
            await interaction.editReply("LFG Post Channel is not setup.");
            return
        }

        const serverID = interaction.options.getString("server-id");
        if (!serverID) {
            await interaction.editReply("Something went terribly wrong (server-id returned null)");
            return
        }
        const serverSubscribe = await LFGSubscribe.findOne({
            where: {
                server_id: interaction.guildId,
                subscribed_server_id: serverID
            }
        });

        if (!serverSubscribe) {
            const subscribeCheck = await ServerSettings.findOne({
                where: {
                    server_id: serverID,
                    lfg_channel: {
                        [Op.not]: null
                    }
                }
            });

            if (subscribeCheck) {
                await LFGSubscribe.create({
                    server_id: interaction.guildId,
                    subscribed_server_id: serverID
                });

                const server = client.guilds.cache.get(serverID);
                if (server) {
                    await interaction.editReply(`${server.name} has been subscribed to.`)
                }
            }
            else {
                await interaction.editReply("Server being subscribed to does not have their LFG Channel setup.");
            }
        }
        else {
            await interaction.editReply("You are already subscribed to this server!");
        }
    }
}