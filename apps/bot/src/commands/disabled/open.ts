import { CommandData, CommandInteraction, InteractionContextType, MessageFlags, SlashCommandBuilder } from "discord.js";

export default <CommandData>{
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Opens a new ticket with provided options')
        .setContexts(InteractionContextType.Guild)
    ,
    cooldown: 10,
    execute: async (i: CommandInteraction) => {

        await i.reply({
            content: 'Opening NEW Ticket...',
            flags: MessageFlags.Ephemeral
        })

    }
}