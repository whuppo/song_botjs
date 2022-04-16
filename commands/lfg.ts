import { SlashCommandBuilder } from "@discordjs/builders";
import { Op } from "sequelize";
import { ServerSettings } from "../models/settings";
import { Command } from "./ICommand";
import { LFGCreate } from "./lfg-create";

//activity select general -> specific
//time -> h:m am/pm tz m/d
//description -> text

export const lfg: Command = {
    data: new SlashCommandBuilder()
        .setName("lfg")
        .setDescription("Create an LFG post.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("create")
                .setDescription("Create an LFG post.")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("edit")
                .setDescription("Edit an LFG post, you need to be the creator of it to edit it.")
                .addIntegerOption((option) =>
                    option
                        .setName("lfg-id")
                        .setDescription("The LFG ID of the post you want to edit.")
                        .setRequired(true)
                    )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("delete")
                .setDescription("Delete an LFG post, you need to be the creator of it to delete it.")
                .addIntegerOption((option) =>
                    option
                        .setName("lfg-id")
                        .setDescription("The LFG ID of the post you want to delete.")
                        .setRequired(true)
                    )
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

        switch (interaction.options.getSubcommand()) {
            case "create": {
                await LFGCreate(interaction);
                break;
            }
            case "edit": {
                // TODO
                break;
            }
            case "delete": {
                // TODO
                break;
            }
        }
    }
}