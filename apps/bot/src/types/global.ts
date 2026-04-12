import { User } from "@supabase/supabase-js";
import { Database } from "@suppora/shared";
import { Collection, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";


// - Extended Discord.js Types:
declare module "discord.js" {

    interface CommandData {
        /** Command definition data */
        data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
        /** The cooldown *(in secs)* for each use.
         * @default- 3 seconds */
        cooldown?: number
        /** The function to execute for each use. */
        execute: (i: CommandInteraction) => any;
        /** The autocomplete logic to use for this command (if applicable). 
         * @see https://discordjs.guide/legacy/slash-commands/autocomplete for more details.*/
        autocomplete?: (i: AutocompleteInteraction) => Promise<void> | void;
    }

    interface ButtonData {
        /** Button definition data */
        data: {
            customId: string
        };
        /** The cooldown *(in secs)* for each use. */
        cooldown?: number
        /** The function to execute for each use. */
        execute: (i: ButtonInteraction) => any;
    }

    interface EventData {
        /** The `ClientEvent` name to "watch" for */
        name: keyof ClientEvents
        /** Weather or not if this event should only fire once. 
         * @default- false */
        once?: true;
        /** The function to execute on the events occurrence.
         * @see https://discord.js.org/docs/packages/discord.js/14.25.1/Client:Class for param typings */
        execute: (...args: any) => any;
    }

    interface Client {
        commands: Collection<string, CommandData>
        buttons: Collection<string, ButtonData>
    }

}


declare module "Express"
declare module "express-serve-static-core" {

    interface Request {
        auth?: {
            user: User,
            profile: Database['public']['Tables']['profiles']['Row']
        }
    }

}
