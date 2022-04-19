import { MessageEmbed } from "discord.js"
import { client } from "../.."
import { LFGInstance } from "../../models/lfg"
import { LFGPost } from "../../models/lfg-post"
import { ServerSettings } from "../../models/settings"

function createLFGEmbed(data: LFGInstance) {
    const embed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle(data.activity)
        .setDescription(data.description)
        .addField("Time", data.time)
        .setFooter({ text: `LFG ID: ${data.lfg_id.toString()}` })

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

    const post_channel = client.channels.cache.find(channel => channel.id == server_setting.lfg_channel);

    if (!post_channel) return;

    if (!post_channel.isText()) return;

    const post_message = await post_channel.send({ embeds: createLFGEmbed(data) });
}

export async function updateLFGPost(data: LFGInstance) {
    const posts = await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    });


}