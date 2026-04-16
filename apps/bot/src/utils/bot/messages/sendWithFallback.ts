import { AnyComponentV2, ComponentBuilder, Guild, Message, MessageFlags, TextBasedChannel } from "discord.js"


type SendWithFallbackReturn = (
    {
        success: true
        data: {
            message: Message
            destination: 'preferred' | 'system' | 'public_updates' | 'any_guild_text' | 'guild_owner_dm'
        }
        error?: never
    } | {
        success: false
        data?: never
        error: any
    }
)


async function sendWithFallback(guild: Guild, content: ComponentBuilder<AnyComponentV2> | string, opts?: {
    /** Attempts to send to this channel id first */
    preferredChannelId?: string,
    /** Disallow guild owner dm fallback - defaults to false */
    disableOwnerDm?: boolean,
}): Promise<SendWithFallbackReturn> {

    try {
        // UTIL: Send Msg to Sendable Channel
        async function sendToChannel(channel: TextBasedChannel, c: typeof content) {
            let sent: Message | undefined = undefined
            if (!channel.isSendable()) throw new Error('Not sendable')
            // Send by Content Type:
            if (typeof c == 'string') {
                // String Messages
                sent = await channel.send({
                    content: c
                })
            } else {
                // Component Messages:
                sent = await channel.send({
                    components: [c as any],
                    flags: MessageFlags.IsComponentsV2
                })
            }
            // Return Sent Msg:
            if (sent) { return sent }
        }

        // Preferred Channel:
        try {
            if (opts?.preferredChannelId) {
                const prefChannel = await guild.channels.fetch(opts.preferredChannelId)
                if (!prefChannel.isSendable()) throw new Error('Not sendable')
                const sentMessage = await sendToChannel(prefChannel, content)
                if (sentMessage) {
                    return {
                        success: true,
                        data: {
                            destination: 'preferred',
                            message: sentMessage
                        }
                    } as const
                }
            }
        } catch (e) { }

        // System Channel:
        try {
            if (guild?.systemChannelId) {
                const systemChannel = guild?.systemChannel ?? await guild.channels.fetch(guild.systemChannelId)
                if (!systemChannel.isSendable()) throw new Error('Not sendable')
                const sentMessage = await sendToChannel(systemChannel, content)
                if (sentMessage) {
                    return {
                        success: true,
                        data: {
                            destination: 'system',
                            message: sentMessage
                        }
                    } as const
                }
            }
        } catch (e) { }

        // Public Updates Channel:
        try {
            if (guild?.publicUpdatesChannelId) {
                const publicUpdatesChannel = guild?.publicUpdatesChannel ?? await guild.channels.fetch(guild.publicUpdatesChannelId)
                if (!publicUpdatesChannel.isSendable()) throw new Error('Not sendable')
                const sentMessage = await sendToChannel(publicUpdatesChannel, content)
                if (sentMessage) {
                    return {
                        success: true,
                        data: {
                            destination: 'public_updates',
                            message: sentMessage
                        }
                    } as const
                }
            }
        } catch (e) { }

        // Any Available Guild Text Channel:
        try {
            let target: typeof cachedAvailable = undefined
            const cachedAvailable = guild.channels.cache?.find(c => c.isSendable())
            if (!cachedAvailable) {
                const allChannels = await guild.channels.fetch()
                const sendable = allChannels?.find(c => c.isSendable())
                if (sendable) target = sendable
                else throw new Error('Not sendable')
            } else {
                target = cachedAvailable
            }
            const sentMessage = await sendToChannel(target, content)
            if (sentMessage) {
                return {
                    success: true,
                    data: {
                        destination: 'any_guild_text',
                        message: sentMessage
                    }
                } as const
            }
        } catch (e) { }

        // LAST ATTEMPT
        if (!opts?.disableOwnerDm) {
            const owner = await guild.fetchOwner()
            const ownerDM = await owner.createDM()
            const sentMessage = await sendToChannel(ownerDM, content)
            if (sentMessage) {
                return {
                    success: true,
                    data: {
                        destination: 'guild_owner_dm',
                        message: sentMessage
                    }
                } as const
            }
        } else throw new Error('All send attempts failed - This guild may no longer be reachable?')

    } catch (err) {
        // All Send A Failure - Return:
        return {
            success: false,
            error: err
        } as const
    }
}

export default sendWithFallback