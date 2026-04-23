import { supabase } from "@/utils/supabase"

export const fetchGuildTickets = async (guildId?: string) => {
    try {
        if (!guildId) throw new Error('[Fetch Tickets]: Error - "guildId" was NOT provided!')
        const { data, error } = await supabase.from('tickets').select('*')
            .eq('guild_id', guildId)
        if (error) throw error
        else return { data }
    } catch (err) { return Promise.reject(err) }
}

export const fetchGuildPanels = async (guildId?: string) => {
    try {
        if (!guildId) throw new Error('[Fetch Panels]: Error - "guildId" was NOT provided!')
        const { data, error } = await supabase.from('panels').select('*')
            .eq('guild_id', guildId)
        if (error) throw error
        else return { data }
    } catch (err) { return Promise.reject(err) }
}

export const fetchGuildTeams = async (guildId?: string) => {
    try {
        if (!guildId) throw new Error('[Fetch Teams]: Error - "guildId" was NOT provided!')
        const { data, error } = await supabase.from('teams').select('*')
            .eq('guild_id', guildId)
        if (error) throw error
        else return { data }
    } catch (err) { return Promise.reject(err) }
}