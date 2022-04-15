import { SlashCommandBuilder } from "@discordjs/builders";
import { Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { activities, GroupSelection } from "../data/activities";
import { Command } from "./ICommand";

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
        switch (interaction.options.getSubcommand()) {
            case "create": {
                let navigation: string[] = [];
                let doNav = async (toNav: string) => {
                    let componentsToAdd = [];
                    let group = activities.find(x => x.id == toNav);
                    if (!group) {
                        // TODO: handle invalid group nav, currently defaults to main group
                        group = activities.find(x => x.id == "main");
                    }

                    if (navigation.length) {
                        componentsToAdd.unshift( new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId("back")
                                    .setLabel("Back")
                                    .setStyle("PRIMARY")
                                    .setEmoji("⬅")
                            )
                        )
                    }

                    let options: MessageSelectOptionData[] = [];
                    group?.values.forEach(value => options.push(value.getOptionData()));

                    componentsToAdd.unshift( new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId("activity")
                                .setPlaceholder("Select an activity...")
                                .addOptions(options)
                        )
                    )

                    // probably want an embed for content
                    await interaction.editReply({ content: `*${group?.title}*\n${group?.description}`, components: componentsToAdd });
                    let toCollect = await interaction.fetchReply() as Message;
                    const button_collector = toCollect.createMessageComponentCollector({ componentType: "BUTTON" });
                    const menu_collector = toCollect.createMessageComponentCollector({ componentType: "SELECT_MENU" });

                    button_collector.on("collect", async (i) => {
                        await i.deferUpdate();
                        let toNav = navigation.pop();
                        doNav( toNav! );
                    });
                    menu_collector.on("collect", async (i) => {
                        await i.deferUpdate();
                        if (i.values[0].charAt(0) == ">") {
                            navigation.push( group!.id );
                            doNav( i.values[0].split(">")[1] );
                        }
                        else {
                            await interaction.editReply({ content: `${i.values[0]} has been selected.`, components: undefined });
                        }
                    });
                }

                doNav("menu");
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