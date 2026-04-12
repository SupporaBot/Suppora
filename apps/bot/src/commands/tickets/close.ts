import { CommandData, CommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";

export default <CommandData>{
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Closes the current ticket with provided options')
        .setContexts(InteractionContextType.Guild)
    ,
    cooldown: 10,
    execute: async (i: CommandInteraction) => {

        await i.reply({
            content: 'Closing Current Ticket...',
            flags: MessageFlags.Ephemeral
        })

    }
}