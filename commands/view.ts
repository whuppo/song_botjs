import { SlashCommandBuilder } from "@discordjs/builders";
import { Character } from "../models/character";
import { Command } from "./ICommand";
import { formatName } from "./register";

export const view: Command = {
    data: new SlashCommandBuilder()
        .setName("view")
        .setDescription("View the stats of the named character.")
        .addStringOption((option) =>
            option
                .setName("character-name")
                .setDescription("The in-game name of the character.")
                .setRequired(true)
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const character_name = formatName(interaction.options.getString("character-name"));

        const character = await Character.findOne({
            where: {character_name: character_name}
        });

        if (character) {
            const { player_id } = character
            const player_name = async () => {
                const fetch_user = await interaction.guild?.members.fetch(player_id);
                if (fetch_user) {
                    return `by ${fetch_user.displayName}`;
                }
                return "Unknown";
            }
            await interaction.editReply(`${character.character_name} (${formatName(character.class)} @ ${character.item_level}) is owned ${await player_name()}`)
        }
        else {
            await interaction.editReply("No character found.");
        }
    }
}