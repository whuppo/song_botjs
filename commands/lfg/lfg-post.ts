import { MessageActionRow, MessageButton, MessageEmbed, MessageOptions, TextBasedChannel } from "discord.js"
import { client } from "../.."
import { LFGInstance } from "../../models/lfg"
import { LFGPost } from "../../models/lfg-post"
import { LFGSubscribe } from "../../models/lfg-subscribe"
import { ServerSettings } from "../../models/settings"

async function createLFGEmbed(data: LFGInstance) {
    let message: MessageOptions = {};
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(data.activity)
        .setDescription(data.description)
        .addField("Time", data.time)
        .setFooter({ text: `LFG ID: ${data.lfg_id}` })

    const user = client.users.cache.get(data.author_id);
    if (user) {
        embed.setAuthor({
           name: "Creator: " + user.username,
           iconURL: user.displayAvatarURL(),
        });
    }

    message.embeds = [ embed ];

    const buttons = new MessageActionRow()
        .addComponents([
            new MessageButton()
                .setCustomId("lfg_join_" + data.lfg_id)
                .setLabel("Join")
                .setStyle("SUCCESS")
                .setEmoji("✔"),
            new MessageButton()
                .setCustomId("lfg_alt_" + data.lfg_id)
                .setLabel("Join as alt")
                .setStyle("PRIMARY")
                .setEmoji("❔"),
            new MessageButton()
                .setCustomId("lfg_leave_" + data.lfg_id)
                .setLabel("Leave")
                .setStyle("SECONDARY")
                .setEmoji("🏃‍♂️")
        ])

    message.components = [ buttons ];

    return message
}

export async function createLFGPost(data: LFGInstance, server_id: string | undefined) {
    if (!server_id) return;

    const server_setting = await ServerSettings.findOne({
        where: { server_id: server_id }
    });

    if (!server_setting) return;

    let channels_to_check: string[] = [];
    channels_to_check.push(server_setting.lfg_channel);

    const subscribed_servers = await LFGSubscribe.findAll({
        where: { subscribed_server_id: server_id }
    });

    if (subscribed_servers.length) {
        subscribed_servers.forEach(async (element) => {
            let subscribed_server_setting = await ServerSettings.findOne({
                where: { server_id: element.server_id }
            });

            if (!subscribed_server_setting) return;

            channels_to_check.push(subscribed_server_setting.lfg_channel);
        });
    }

    let channels_to_post: TextBasedChannel[] = [];
    channels_to_check.forEach(async (element) => {
        let check = client.channels.cache.find(channel => channel.id == element);

        if (check && check.isText()) {
            channels_to_post.push(check);
        }
    });

    channels_to_post.forEach(async (element) => {
        await element.send(await createLFGEmbed(data))
            .then(async (message) => {
                await LFGPost.create({
                    message_id: message.id
                });
            });
    });
}

export async function updateLFGPost(data: LFGInstance) {
    const posts = await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    });


}