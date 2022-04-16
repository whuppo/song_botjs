import { channelMention, SlashCommandBuilder } from "@discordjs/builders";
import { GuildBasedChannel } from "discord.js";
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
        let interactionChannel = interaction.options.getChannel("channel");
        if (!interactionChannel) {
            interactionChannel = interaction.channel as GuildBasedChannel;
        }
        
        let serverSetting = await ServerSettings.findOne({
            where: {
                server_id: interaction.guildId
            }
        });
        if (!serverSetting) {
            serverSetting = ServerSettings.build({ server_id: interaction.guildId });
        }

        serverSetting.lfg_channel = interactionChannel.id;
        await serverSetting.save();
        await interaction.editReply(`LFG Posts will now be posted to ${channelMention(interactionChannel.id)}.`);
    }
}