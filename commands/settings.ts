import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import { ServerSettings } from "../models/settings";
import { Command } from "./ICommand";

export const settings: Command = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Set some settings.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("lfg")
                .setDescription("Set the channel for where LFG Posts are posted.")
                .addChannelOption((option) =>
                    option
                        .setName("channel")
                        .setDescription("The channel to post LFGs to, leave blank to use channel command was sent in.")
                )
        ),
    run: async (interaction) => {
        await interaction.deferReply()
        let channelID = interaction.options.getChannel("channel")?.id;
        if (!channelID) {
            channelID = interaction.channelId;
        }
        
        let serverSetting = await ServerSettings.findOne({
            where: {
                server_id: interaction.guildId
            }
        });
        if (!serverSetting) {
            serverSetting = ServerSettings.build({ server_id: interaction.guildId });
        }

        serverSetting.lfg_channel = channelID;
        await serverSetting.save();
    }
}