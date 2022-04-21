import { SlashCommandBuilder } from "@discordjs/builders";
import { Op } from "sequelize";
import { LFG } from "../models/lfg";
import { ServerSettings } from "../models/settings";
import { Command } from "./ICommand";
import { LFGCreate } from "./lfg/lfg-create";
import { deleteLFGPost } from "./lfg/lfg-post";

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
                const lfg_id = interaction.options.getInteger("lfg-id")
                await LFG.findOne({
                    where: { lfg_id: lfg_id }
                })
                .then(async (data) => {
                    if (data) {
                        if (data.author_id === interaction.user.id) {
                            await deleteLFGPost(data);
                            await interaction.editReply(`LFG Post ${lfg_id} has been deleted.`);
                        }
                        else {
                            await interaction.editReply(`You are not the author of LFG Post ${lfg_id}!`);
                        }
                    }
                    else {
                        await interaction.editReply(`LFG Post ID is invalid.`);
                    }
                })
                break;
            }
        }
    }
}