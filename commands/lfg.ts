import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { Command } from "./ICommand";
import activitiesJSON from "../data/activities.json";
import { ActivitiesInstance } from "../data/activities";

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
        switch(interaction.options.getSubcommand()) {
            case "create": {
                //test commit
                let options: MessageSelectOptionData[] = [];
                let menu = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("activity")
                            .setPlaceholder("Select an activity...")
                            .addOptions([
                                {
                                    label: "Test Activity 1",
                                    description: "Test Activity 1 Description",
                                    value: "test_activity_1",
                                    emoji: "😩"
                                },
                                {
                                    label: "Test Activity 2",
                                    description: "Test Activity 2 Description",
                                    value: "test_activity_2",
                                    emoji: "🎉"
                                }
                            ])
                    );

                let button = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId("button")
                            .setLabel("Test")
                            .setStyle("PRIMARY")
                            .setEmoji("⬅")
                    );
                
                await interaction.editReply({ content: "Test", components: [menu, button] });
                let test = await interaction.fetchReply() as Message;
                const collector1 = test.createMessageComponentCollector({ componentType: "BUTTON" });
                const collector2 = test.createMessageComponentCollector({ componentType: "SELECT_MENU" });

                collector1.on("collect", async (i) => {
                    await i.deferUpdate();
                    await interaction.editReply(`Last interaction: ${i.customId}`);
                });
                collector2.on("collect", async (i) => {
                    await i.deferUpdate();
                    await interaction.editReply(`Last interaction: ${i.customId}`);
                });
                break;
            }
            case "edit": {
                break;
            }
            case "delete": {
                break;
            }
        }
    }
}