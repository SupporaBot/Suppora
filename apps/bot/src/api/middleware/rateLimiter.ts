import { ApiResponse } from "@suppora/shared";
import { HttpStatusCode } from "axios";
import rateLimit, { ipKeyGenerator, type AugmentedRequest } from "express-rate-limit";

/** GLOBAL Backend Web Server/API Rate Limiter */
export default rateLimit({
    legacyHeaders: false,
    standardHeaders: 'draft-6',
    windowMs: (1000 * 60), // 1 min time frame
    limit: 40, // 40 requests allowed
    keyGenerator: (req) => ipKeyGenerator(req?.ip),
    handler: (rawReq, res) => {
        const req = rawReq as AugmentedRequest
        const resetTime = req?.rateLimit?.resetTime?.getTime() ?? null;
        const retryAfterSeconds = resetTime ? Math.max(
            Math.ceil((resetTime - Date.now()) / 1000),
            0
        ) : null;

        // Send Rate Limit - API Response:
        new ApiResponse(res).failure({
            message: 'Too many requests! Please slow down and try again later.',
            path: req.originalUrl,
            retry_after: retryAfterSeconds
        }, HttpStatusCode.TooManyRequests)

    },
    skip: (req) => req.method == 'OPTIONS',
})