import express from 'express'
import teamsRouter from './teams'
import verifyToken from '../../middleware/verifyToken'
import { verifyGuildMembership } from '../../middleware/verifyGuildMember'
import { ApiResponse } from '@suppora/shared'
import { log } from '../../../utils/logs/logs'
import { ChannelType } from 'discord.js'

const guildsRouter = express.Router({ mergeParams: true })


// Nested Routes:
guildsRouter.use('/:guildId/teams', teamsRouter)

// GET - Guild Roles
// URL: https://api.suppora.app/guilds/:guildId/roles
guildsRouter.get(`/:guildId/roles`, verifyToken, verifyGuildMembership(true), async (req, res) => {
    const guildId = req.params?.['guildId'] as string
    try {
        // Get Guild Roles:
        const guild = req.guild
        const rolesMap = (guild.roles.cache ?? await guild.roles.fetch())?.values()
        if (!rolesMap) throw new Error('Failed to fetch guild roles - no rolesMap', { cause: { rolesMap } })
        const result = [...rolesMap]?.map(r => ({
            id: r.id,
            name: r.name,
            color: (r.color || r.colors),
            permissions: String(r.permissions.bitfield),
            editable: r.editable,
            managed: r.managed
        }))
        // Return Data:
        return new ApiResponse(res).success(result)

    } catch (err) {
        // Log & Return - Errored Response
        log.for('API').error(`[Guild Roles] API Failure - Couldn't fetch guild roles!`, { guildId, err })
        return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to fetch guild roles due to an internal error!`)
    }
})


// GET - Guild Channels
// URL: https://api.suppora.app/guilds/:guildId/channels
guildsRouter.get(`/:guildId/channels`, verifyToken, verifyGuildMembership(true), async (req, res) => {
    const guildId = req.params?.['guildId'] as string
    try {
        // Get Guild Channels:
        const guild = req.guild
        const channelsMap = (guild.channels.cache ?? await guild.channels.fetch())?.values()
        if (!channelsMap) throw new Error('Failed to fetch guild channels - no channelMap', { cause: { channelsMap } })
        const result = [...channelsMap]?.map(c => ({
            id: c.id,
            name: c.name,
            type: c.type,
            manageable: c.manageable,
            viewable: c.viewable,
            sendable: c.isSendable()
        }))?.filter(c =>
            c.type != ChannelType.PublicThread
            && c.type != ChannelType.PrivateThread
            && c.type != ChannelType.AnnouncementThread
        )
        // Return Data:
        return new ApiResponse(res).success(result)

    } catch (err) {
        // Log & Return - Errored Response
        log.for('API').error(`[Guild Channels] API Failure - Couldn't fetch guild channels!`, { guildId, err })
        return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to fetch guild channels due to an internal error!`)
    }
})



// Export Router:
export default guildsRouter