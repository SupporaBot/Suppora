import { HttpStatusCode } from 'axios'
import type { Response } from 'express'

/** Base {@linkcode ApiResponse} Return Value */
export type APIResponseValue<d = unknown, e = unknown> = ({
    success: true,
    data: d,
} | {
    success: false,
    error: e
}) & {
    status: {
        code: number,
        message: string
    }
}


/** Constructor utility class to be used for **sending API responses** — properly typed */
export class ApiResponse {

    // Get Responder from Class:
    private res: Response<APIResponseValue>
    constructor(res: Response) {
        this.res = res
    }

    /** Reply - Successful API Result
     * @default-status-code `200`
     * @returns- {@linkcode APIResponseValue} */
    public success<ResData>(data: ResData, statusCode: HttpStatusCode | number = 200) {
        return this.res.status(statusCode).json({
            success: true,
            data,
            status: {
                code: statusCode,
                message: HttpStatusCode[statusCode]
            }
        })
    }

    /** Reply - Failed API Result
     * @default-status-code `500`
     * @returns- {@linkcode APIResponseValue} */
    public failure<ResData>(error: ResData, statusCode: HttpStatusCode | number = 500) {
        return this.res.status(statusCode).json(<APIResponseValue>{
            success: false,
            error,
            status: {
                code: statusCode,
                message: HttpStatusCode[statusCode]
            }
        })
    }

}