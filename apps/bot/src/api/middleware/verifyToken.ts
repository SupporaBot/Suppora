import { ApiResponse } from "@suppora/shared"
import { HttpStatusCode } from "axios"
import { NextFunction, Request, Response } from "express"
import { log } from "../../utils/logs/logs"
import { supabase } from "../../utils/database/supabase"

/**`Middleware Util 🔑` - Verifies the provided authorization "Bearer" token provided with the API request. 
 * @IF User token **is valid**: the user data/session will be attached to the request. */
async function verifyToken(req: Request, res: Response, next: NextFunction) {

    try {
        // Parse Request Authorization:
        const authHeader = req.headers.authorization
        const bearerProvided = authHeader?.startsWith('Bearer ')
        if (!bearerProvided) return new ApiResponse(res).failure(`[UNAUTHORIZED]: No valid Bearer token provided!`, HttpStatusCode.Unauthorized)
        const token = authHeader.split(` `)?.[1]
        if (!token) return new ApiResponse(res).failure(`[UNAUTHORIZED]: Invalid access token provided!`, HttpStatusCode.Unauthorized)

        // Verify Token:
        const { data: { user }, error: tokenError } = await supabase.auth.getUser(token)

        // Token Error:
        if (tokenError) {
            if (tokenError.code == 'bad_jwt') {
                return new ApiResponse(res).failure(`[FORBIDDEN]: Invalid access token provided!`, HttpStatusCode.Forbidden)
            } else throw tokenError
        }
        if (!user) throw new Error(`USER NOT FOUND from VerifyToken -- No Token Error & No User?`)

        // Get User Profile:
        const { data: profile, error: profileError } = await supabase.from('profiles').select('*')
            .eq('id', user.id)
            .single()
        // Profile Error:
        if (profileError || !profile) {
            return new ApiResponse(res).failure(`[FORBIDDEN]: Couldn't verify user profile!`, HttpStatusCode.Forbidden)
        }

        // Attach User/Profile to Request - Allow:
        req.auth = {
            profile: profile,
            user: user
        }
        return next()

    } catch (err) {
        // ERR Verifying Token:
        log.for('API').error(`[VERIFY TOKEN]: Caught - Internal Error`, { err })
        return new ApiResponse(res).failure(`[FORBIDDEN]: Failed to verify user authentication!`, HttpStatusCode.Forbidden)
    }

}

export default verifyToken