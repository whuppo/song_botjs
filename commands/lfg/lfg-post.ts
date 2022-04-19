import { MessageEmbed, TextBasedChannel } from "discord.js"
import { client } from "../.."
import { LFGInstance } from "../../models/lfg"
import { LFGPost } from "../../models/lfg-post"
import { LFGSubscribe } from "../../models/lfg-subscribe"
import { ServerSettings } from "../../models/settings"

function createLFGEmbed(data: LFGInstance) {
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

    return [embed]
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

    let message_post_ids: string[] = [];
    channels_to_post.forEach(async (element) => {
        let message = await element.send({ embeds: createLFGEmbed(data) });
        message_post_ids.push(message.id);
    });

    message_post_ids.forEach(async (element) => {
        await LFGPost.create({
            lfg_id: data.lfg_id,
            message_id: element
        });
    });
}

export async function updateLFGPost(data: LFGInstance) {
    const posts = await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    });


}