import { SlashCommandBuilder } from "@discordjs/builders";
import { ValidationError } from "sequelize";
import { Character } from "../models/character";
import { Command } from "./ICommand";

const classes: Array<[string, string]> = [
    [ "Berserker", "berserker" ],
    // [ "Destroyer", "destroyer" ],
    [ "Gunlancer", "gunlancer" ],
    [ "Paladin", "paladin" ],
    // [ "Arcana", "arcana" ],
    [ "Bard", "bard" ],
    [ "Sorceress", "sorceress" ],
    // [ "Summoner", "summoner" ],
    // [ "Lancer", "lancer" ],
    [ "Scrapper", "scrapper" ],
    [ "Soulfist", "soulfist" ],
    [ "Striker", "striker" ],
    [ "Wardancer", "wardancer" ],
    [ "Artillerist", "artillerist" ],
    [ "Deadeye", "deadeye" ],
    [ "Gunslinger", "gunslinger" ],
    // [ "Scouter", "scouter" ],
    [ "Sharpshooter", "sharpshooter" ],
    [ "Deathblade", "deathblade" ],
    // [ "Reaper", "reaper" ],
    [ "Shadowhunter", "shadowhunter" ]
]

export function formatName(name: string | null) {
    return `${name?.charAt(0).toUpperCase()}${name?.slice(1).toLowerCase()}`;
}

export const register: Command = {
    data: new SlashCommandBuilder()
        .setName("register")
        .setDescription("Register a character to your Discord profile.")
        .addStringOption((option) =>
            option
                .setName("character-name")
                .setDescription("The in-game name of your character.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName("item-level")
                .setDescription("The item level of your character.")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("class")
                .setDescription("The class of your character.")
                .addChoices( classes )
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const character_name = formatName(interaction.options.getString("character-name"));
        const item_level = interaction.options.getInteger("item-level");
        const character_class = interaction.options.getString("class");

        const character = await Character.findOne({
            where: {character_name: character_name}
        });

        try {
            // does character already exist
            if (character) {
                // check ownership
                if (character.player_id === user.id) {
                    character.update({
                        item_level: item_level
                    })

                    character.save();
                    await interaction.editReply(`${character_name} has been updated to Item Level ${item_level}.`);
                }
                else {
                    // ownership check fail
                    await interaction.editReply("You cannot edit a character you do not own.");
                }
            }
            else {
                if (character_class) {
                    await Character.create({
                        character_name: character_name,
                        player_id: user.id,
                        item_level: item_level,
                        class: character_class
                    });
        
                    // character registration confirmed
                    // ex: Whuppo (Berserker @ Item Level 1385) has been registered to whuppo.
                    await interaction.editReply(`${character_name} (${formatName(character_class)} @ Item Level ${item_level}) has been registered to ${user.username}.`);
                }
                else {
                    // registering new character but missing class
                    await interaction.editReply("You must specify a class when registering a new character.");
                }
            }
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                await interaction.editReply(`Something went wrong. (${error.name})`);
            }
            else {
                await interaction.editReply("Something went horribly wrong and we cannot determine the error.");
            }
        }
    }
}