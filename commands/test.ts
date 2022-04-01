import { SlashCommandBuilder } from "@discordjs/builders";
import { Test } from "../models/testmodel";
import { Command } from "./ICommand";

export const test: Command = {
    data: new SlashCommandBuilder()
        .setName("test")
        .setDescription("Testing.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("Test string.")
        ),
    run: async (interaction) => {
        await interaction.deferReply();
        const { user } = interaction;
        const message = interaction.options.getString("message");

        const test = await Test.findOne({
            where: {id: user.id}
        });

        if (test) {
            if (message) {
                test.message = message;
                await test.save();
                await interaction.editReply(`Test has been updated to ${message}`);
            }
            else {
                await interaction.editReply(test.message || "Test was null.");
            }
        }
        else {
            await Test.create({
                id: user.id,
                message: message
            });

            await interaction.editReply(`Test has been created to ${message}`);
        }
    }
}