import express from 'express'
import verifyToken from '../../middleware/verifyToken'
import { log } from '../../../utils/logs/logs'
import { ApiResponse, TeamSchema } from '@suppora/shared'
import { HttpStatusCode } from 'axios'
import { supabase } from '../../../utils/database/supabase'
import { verifyGuildMembership } from '../../middleware/verifyGuildMember'
import { DiscordAPIError, Guild } from 'discord.js'

const teamsRouter = express.Router({ mergeParams: true })


// CREATE / POST - New Team:
// URL: https://api.suppora.app/guilds/:guildId/teams
teamsRouter.post('/', verifyToken, verifyGuildMembership(true), async (req, res) => {
    const guildId = req.params?.['guildId'] as string
    try {
        // Confirm GuildId:
        if (!guildId) return new ApiResponse(res).failure(`[Bad Request]: Guild Id is missing from request!`, HttpStatusCode.BadRequest)
        // Validate Request Data/Body
        const reqSchema = TeamSchema.pick({
            title: true
        })
        const validated = reqSchema.safeParse(req.body, { reportInput: true })
        if (!validated.success) return new ApiResponse(res).failure(`[BAD REQUEST]: Invalid body/team data provided!`, HttpStatusCode.BadRequest)
        const data = validated.data

        // Get Guild:
        const guild = req?.guild
        if (!guild) return new ApiResponse(res).failure(`[Internal Error]: Cannot find/fetch guild to create team for!`, 500)

        // Create Server Roles:
        const [onCallRole, offCallRole] = await Promise.all([
            guild.roles.create({
                name: `${data.title} - On Call`,
                color: 0x717ff0
            }),
            guild.roles.create({
                name: `${data.title} - Off Call`,
                color: 0x717ff0
            })
        ])


        // Create New Team for Guild:
        const { data: newTeam, error: newTeamErr } = await supabase.from('teams').insert({
            guild_id: guildId,
            title: data.title,
            role_id_on_call: onCallRole?.id,
            role_id_off_call: offCallRole?.id,
        }).select()
        if (newTeamErr) throw new Error('[Team Creation Failure - DB]: Failed to save new team to database!', { cause: newTeamErr })

        // Return Success:
        return new ApiResponse(res).success({
            message: 'Team created!',
            team: newTeam
        })

    } catch (err) {
        // Log & Return - Errored Response
        log.for('API').error(`[CREATE/POST TEAM] API Failure - Couldn't create a new team for guild!`, { guildId, err })
        return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to create new team due to an internal error!`)
    }
})


// EDIT / PATCH - Existing Team:
// URL: https://api.suppora.app/guilds/:guildId/teams/:teamId
teamsRouter.patch('/:teamId', verifyToken, verifyGuildMembership(true), async (req, res) => {
    const guildId = req.params?.['guildId'] as string
    const teamId = req.params?.['teamId'] as string
    try {
        // Confirm Guild & Team Ids:
        if (!guildId) return new ApiResponse(res).failure(`[Bad Request]: Guild Id is missing from request!`, HttpStatusCode.BadRequest)
        if (!teamId) return new ApiResponse(res).failure(`[Bad Request]: Team Id is missing from request!`, HttpStatusCode.BadRequest)
        // Validate Request Data/Body
        const reqSchema = TeamSchema.pick({
            title: true
        })
        const validated = reqSchema.safeParse(req.body, { reportInput: true })
        if (!validated.success) return new ApiResponse(res).failure(`[BAD REQUEST]: Invalid body/team data provided!`, HttpStatusCode.BadRequest)
        const data = validated.data

        // Get Guild:
        const guild = req?.guild
        if (!guild) return new ApiResponse(res).failure(`[Internal Error]: Cannot find/fetch guild to create team for!`, 500)

        // Fetch Existing Team:
        const { data: existingTeam, error: existingTeamErr } = await supabase.from('teams').select('*')
            .eq('id', teamId)
            .single()
        if (existingTeamErr || !existingTeam) throw new Error('Failed to fetch existing team for update from database!', { cause: existingTeamErr })

        // Update Server Roles:
        async function updateRole(id: string, type: 'On' | 'Off') {
            try {
                // Edit Existing Role:
                const updated = await guild.roles.edit(id, {
                    name: `${data.title} - ${type} Call`,

                })
                return updated
            } catch (editErr) {
                // Edit Role Failed:
                if (editErr instanceof DiscordAPIError) {
                    if (editErr.code == 10011 || editErr.code == 10007) {
                        // Role Deleted/Missing:
                        const newRole = await guild.roles.create({
                            name: `${data.title} - ${type} Call`,
                            color: 0x717ff0
                        })
                        return newRole
                    } else if (editErr.code == 50013 || editErr.code == 50001) {
                        // Cannot Edit due to HIERARCHY/Permissions:
                        throw new Error(`[Edit Team Role]: Cannot edit team role(id: ${id}) due to ROLE HIERARCHY/PERMISSIONS!`, { cause: editErr })
                    }
                }
                throw editErr
            }
        }
        const [onCallRole, offCallRole] = await Promise.all([
            updateRole(existingTeam.role_id_on_call, 'On'),
            updateRole(existingTeam.role_id_off_call, 'Off')
        ])

        // Update Database Team:
        const { data: updatedTeam, error: updatedTeamErr } = await supabase.from('teams').update({
            guild_id: guildId,
            id: teamId,
            title: data.title,
            role_id_on_call: onCallRole.id,
            role_id_off_call: offCallRole.id
        }).eq('id', teamId).select().single()
        if (!updatedTeam || updatedTeamErr) throw new Error('Failed to update existing team within database!', { cause: updatedTeamErr })

        // Return Success:
        return new ApiResponse(res).success({
            message: 'Team updated!',
            updatedTeam
        })

    } catch (err) {
        // Log & Return - Errored Response
        log.for('API').error(`[EDIT/PATCH TEAM] API Failure - Couldn't update an existing team for guild!`, { guildId, teamId, err })
        return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to update an existing team due to an internal error!`)
    }
})


// REMOVE / DELETE - Existing Team:
// URL: https://api.suppora.app/guilds/:guildId/teams/:teamId
teamsRouter.delete('/:teamId', verifyToken, verifyGuildMembership(true), async (req, res) => {
    const guildId = req.params?.['guildId'] as string
    const teamId = req.params?.['teamId'] as string
    try {
        // Confirm Guild & Team Ids:
        if (!guildId) return new ApiResponse(res).failure(`[Bad Request]: Guild Id is missing from request!`, HttpStatusCode.BadRequest)
        if (!teamId) return new ApiResponse(res).failure(`[Bad Request]: Team Id is missing from request!`, HttpStatusCode.BadRequest)

        // Get Guild:
        const guild = req?.guild
        if (!guild) return new ApiResponse(res).failure(`[Internal Error]: Cannot find/fetch guild to create team for!`, 500)

        // Delete Existing Team:
        const { data, error: deleteDbErr } = await supabase.from('teams').delete()
            .eq('id', teamId).select().single()
        if (deleteDbErr) throw new Error('Failed to delete existing team from database!', { cause: deleteDbErr })

        // Delete Team Roles:
        async function safeDeleteRole(guild: Guild, id: string) {
            try {
                await guild.roles.delete(id)
                return true
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    if (err.code === 10011 || err.code === 50028) return true
                    if (err.code === 50001 || err.code === 50013) {
                        throw new Error('[PERMISSIONS]: Cannot delete role', { cause: err })
                    }
                }
                throw err
            }
        }
        await Promise.all([
            safeDeleteRole(guild, data.role_id_on_call),
            safeDeleteRole(guild, data.role_id_off_call)
        ])

        // Return Success:
        return new ApiResponse(res).success({
            message: 'Team deleted!',
            team: data
        })

    } catch (err) {
        // Log & Return - Errored Response
        log.for('API').error(`[DELETE TEAM] API Failure - Couldn't delete an existing team for guild!`, { guildId, teamId, err })
        return new ApiResponse(res).failure(`[INTERNAL ERROR]: Failed to delete an existing team due to an internal error!`)
    }
})



// Export Router
export default teamsRouter