import crypto from 'crypto'
import express from "express";
import { log } from "../../../utils/logs/logs";
import { URLS } from "../../../utils/core";
import { DiscordAPIError, OAuth2Scopes } from "discord.js";
import axios from "axios";
import { supabase } from "../../../utils/database/supabase";
import { DiscordOAuth2TokenResponse, upsertAuthUser } from './authUtils';


// ENV Variables:
const client_id = process.env?.DISCORD_CLIENT_ID
const client_secret = process.env?.DISCORD_CLIENT_SECRET
const environment = process.env?.ENVIRONMENT || 'development'

// oAuth URLS & Scopes
const oAuth2ScopesURI: string = <(keyof typeof OAuth2Scopes)>['Identify', 'Guilds']?.map(s => s.toLowerCase())?.join('+')
// ! FORCE: PUBLISHED API:
const oAuthRedirectURI = environment == 'production' || true
    ? 'https://api.suppora.app/auth/discord-callback'
    : 'http://localhost:3000/api/v1/auth/discord-callback';
const oAuthUrl = environment == 'production'
    ? `https://discord.com/oauth2/authorize?client_id=1491140828574515330&response_type=code&redirect_uri=${encodeURIComponent(oAuthRedirectURI)}&scope=${oAuth2ScopesURI}`
    : `https://discord.com/oauth2/authorize?client_id=1491140828574515330&response_type=code&redirect_uri=${encodeURIComponent(oAuthRedirectURI)}&scope=${oAuth2ScopesURI}`;
// oAuth2 Token Response Type:


// Router:
const authRoutes = express.Router({ mergeParams: true })


// ALL - Sign In - Discord oAuth Prompt
// URL: https://api.suppora.app/v1/auth/sign-in
authRoutes.all(`/sign-in`, (req, res) => {
    // Create OAuth State:
    const state = crypto.randomUUID()
    res.cookie('oauth_state', state, {
        maxAge: 60_000 * 7,
        secure: process.env?.ENVIRONMENT == 'production',
        httpOnly: true,
        sameSite: 'lax'
    })
    // Redirect User to Discord oAuth:
    return res.redirect(oAuthUrl + `&state=${state}`)
})

// ALL - Discord Callback - oAuth 2 Authorization:
// URL: https://api.suppora.app/v1/auth/discord-callback
authRoutes.get('/discord-callback', async (req, res) => {
    try {
        const { code, error, state } = req.query
        // Redirect - FAILED - Missing Code/Error Received from Discord:
        if (error) return res.redirect(URLS.website + `/sign-in?failed=true&reason=${encodeURI(String(error))}`)
        if (!code) return res.redirect(URLS.website + `/sign-in?failed=true&reason=missing+code`)
        if (!state) return res.redirect(URLS.website + `/sign-in?failed=true&reason=oAuth+state`)

        // Confirm oAuth State:
        const stateCookie = req.cookies?.oauth_state;
        if (!stateCookie || state != stateCookie) {
            log.for('Auth').error(`FAILED - Discord AUTH Callback - Missing/Invalid State`, { states: { from_discord: state, from_cookie: stateCookie } })
            return res.redirect(URLS.website + `/sign-in?failed=true&reason=oAuth+state`)
        }
        res.clearCookie('oauth-state');

        // Exchange Code for Access Token(s):
        const { data, status } = await axios.post<DiscordAPIError | DiscordOAuth2TokenResponse>('https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id,
                client_secret,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: oAuthRedirectURI
            } as any),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        )

        // Confirm Token Response:
        if (!("access_token" in data) || !("refresh_token" in data)) {
            const err = Error('Discord API FAILURE - Token Exchange', { cause: { data, status } })
            throw err
        } else {
            // Update/Create Auth User:
            const { user, profile } = await upsertAuthUser(data)
            // Create/Get Magic Sign In URL:
            const { data: link, error: linkError } = await supabase.auth.admin.generateLink({
                email: user?.email,
                type: 'magiclink',
                options: {
                    redirectTo: process.env.ENVIRONMENT != 'production'
                        ? 'http://localhost:5173'
                        : URLS.website
                }
            })
            // Confirm Magic Link:
            if (linkError || !link) throw new Error(`Discord Auth Callback Error - MAGIC LINK FAILED`, { cause: linkError })
            else {
                return res.redirect(URLS.website + `#access-token=${link.properties.hashed_token}`)
            }
        }


    } catch (err) {
        // FAILED - Discord Auth Callback - Log & Redirect:
        log.for('Auth').error(`FAILED - Discord AUTH Callback`, { err })
        return res.redirect(URLS.website + `/sign-in?failed=true&reason=internal+error`)
    }

})


export default authRoutes