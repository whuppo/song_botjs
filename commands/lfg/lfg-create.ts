import { plainToInstance } from "class-transformer";
import { ButtonInteraction, CommandInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageSelectOptionData, SelectMenuInteraction } from "discord.js";
import { Group } from "../../data/activities";
import { data } from "../../data/activities.json";
import { LFG } from "../../models/lfg";
import { createLFGPost } from "./lfg-post";

export const LFGCreate = async (interaction: CommandInteraction) => {
    const activities = plainToInstance(Group, data);
    let navigation: string[] = [];
    let currNav: Group;
    let componentsToAdd: MessageActionRow[] = [];
    
    const doNav = async (toNav: string, componentInteraction?: SelectMenuInteraction | ButtonInteraction ) => {
        let group = activities.find(x => x.id == toNav);
        if (!group) {
            // TODO: handle invalid group nav, currently defaults to main group
            group = activities.find(x => x.id == "main");
        }
        currNav = group!;
    
        componentsToAdd = [];
        // create back button if inside subgroups
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
    
        // create dropdown menu options
        let options: MessageSelectOptionData[] = [];
        group?.values.forEach(x => {
            let value = x.value;
            if (x.group) {
                // group navigation identifier
                value = ">" + value
            }
            let data: MessageSelectOptionData = {
                label: x.label,
                value: value,
                description: x.description,
                emoji: x.emoji
            };
            options.push(data);
        });
    
        // add dropdowns to message
        componentsToAdd.unshift( new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("activity")
                    .setPlaceholder("Select an activity...")
                    .addOptions(options)
            )
        )
    
        // send an update if not initial message send
        if (componentInteraction) {
            componentInteraction.update({ content: `*${currNav.title}*\n${currNav.description}`, components: componentsToAdd });
        }
    }
    
    let toCollect = await interaction.fetchReply() as Message;
    await doNav("menu");
    
    // probably want an embed for content
    await interaction.editReply({ content: `*${currNav!.title}*\n${currNav!.description}`, components: componentsToAdd });
    const buttonCollector = toCollect.createMessageComponentCollector({ componentType: "BUTTON" });
    const menuCollector = toCollect.createMessageComponentCollector({ componentType: "SELECT_MENU" });
    
    buttonCollector.on("collect", async (i) => {
        if (i.user.id === interaction.user.id) {
            if (i.customId == "back") {
                let toNav = navigation.pop();
                await doNav( toNav!, i );
            }
        }
        else {
            await i.reply({ content: "You're not creating this LFG, use `/lfg create` to create your own.", ephemeral: true });
        }
    });
    
    menuCollector.on("collect", async (i) => {
        if (i.user.id === interaction.user.id) {
            if (i.values[0].charAt(0) == ">") {
                navigation.push( currNav!.id );
                await doNav( i.values[0].split(">")[1], i );
            }
            else {
                // ACTIVITY HAS BEEN SELECTED HERE
                let lfg_post = await LFG.create({
                    activity: i.values[0],
                    time: "not implemented",
                    description: "not implemented",
                    author_id: interaction.user.id
                });
                await createLFGPost(lfg_post, interaction.guild?.id);
                await interaction.editReply({ content: `${i.values[0]} has been selected.`, components: [] });
            }
        }
        else {
            await i.reply({ content: "You're not creating this LFG, use `/lfg create` to create your own.", ephemeral: true });
        }
    });
}