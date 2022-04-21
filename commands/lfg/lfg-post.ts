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

    await LFGSubscribe.findAll({
        where: { subscribed_server_id: server_id }
    })
    .then(async (subscribed) => {
        if (subscribed.length) {
            subscribed.forEach(async (element) => {
                await ServerSettings.findOne({
                    where: { server_id: element.server_id }
                })
                .then(async (subscribed_server_setting) => {
                    if (subscribed_server_setting) {
                        let channelToSend = client.channels.cache.find(channel => channel.id == subscribed_server_setting.lfg_channel);

                        if (channelToSend && channelToSend.isText()) {
                            await channelToSend.send(await createLFGEmbed(data))
                            .then(async (message) => {
                                await LFGPost.create({
                                    lfg_id: data.lfg_id,
                                    channel_id: element.id,
                                    message_id: message.id
                                });
                            });
                        }
                    }
                })
            });
        }

        let channelToSelfSend = client.channels.cache.find(channel => channel.id == server_setting.lfg_channel);
        if (channelToSelfSend && channelToSelfSend.isText()) {
            await channelToSelfSend.send(await createLFGEmbed(data))
            .then(async (message) => {
                await LFGPost.create({
                    lfg_id: data.lfg_id,
                    channel_id: server_setting.lfg_channel,
                    message_id: message.id
                });
            });
        }
    })
}

export async function updateLFGPost(data: LFGInstance) {
    const posts = await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    });


}

export async function deleteLFGPost(data: LFGInstance) {
    await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    })
        .then(async (post) => {
            post.forEach(async (element) => {
                let channel = client.channels.cache.get(element.channel_id)

                if (channel && channel.isText()) {
                    await channel.messages.fetch(element.message_id)
                        .then(async (message) => {
                            await message.delete();
                        });
                }
            });

            data.destroy();
        });
}