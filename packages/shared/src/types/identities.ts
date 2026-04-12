// Self Identity:
export type API_SelfUserIdentity_Guild = {

}

export type API_SelfUserIdentity = {
    id: string;
    username: string;
    display_name: string;
    accent_color?: number;
    avatar_url: string;
    guilds: {
        id: string;
        name: string;
        icon: string;
        owner: boolean;
        permissions: string;
        can_manage: boolean;
        bot_installed: boolean;
    }[]
    _fetched_at: string,
    _cache?: boolean
}


export type API_GuildIdentity = {
    name: string;
    id: string;
    owner_id: string;
    icon_url: string;
    missing_permissions: Record<string, string[]>;
}


export type API_UserIdentity = {
    username: string
    display_name: string
    avatar_url: string
}