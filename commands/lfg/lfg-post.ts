import { MessageEmbed } from "discord.js"
import { client } from "../.."
import { LFGInstance } from "../../models/lfg"
import { LFGPost } from "../../models/lfg-post"
import { ServerSettings } from "../../models/settings"

function createLFGEmbed(data: LFGInstance) {
    const embed = new MessageEmbed()
        .setTitle("test")
}

export async function createLFGPost(data: LFGInstance, server_id: string) {
    const server_setting = await ServerSettings.findOne({
        where: { server_id: server_id }
    });

    if (!server_setting) return;

    const post_channel = client.channels.cache.find(channel => channel.id == server_setting.lfg_channel);

    if (!post_channel) return;

    if (!post_channel.isText()) return;

    post_channel.send("lfg_text");
}

export async function updateLFGPost(data: LFGInstance) {
    const posts = await LFGPost.findAll({
        where: { lfg_id: data.lfg_id }
    });


}