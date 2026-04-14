import { ApiResponse } from '@suppora/shared'
import axios from 'axios'
import Express from 'express'
import { log } from '../../utils/logs/logs'

const systemRoutes = Express.Router({ mergeParams: true })


// System Root - All - API System Status Check
// URL: https://api.suppora.app/system
systemRoutes.all(`/`, (req, res) => {
    return new ApiResponse(res).success('Operational')
})

// GET - System Status(es) - All Monitors
// URL: https://api.suppora.app/system/status
systemRoutes.get(`/status`, async (req, res) => {
    try {
        // Make Betterstack API Request:
        const status_page_id = `243766`
        const { data } = await axios.get<{ data: any[] }>(`https://uptime.betterstack.com/api/v2/status-pages/${status_page_id}/resources`, { headers: { Authorization: `Bearer ${process.env.BETTERSTACK_UPTIME_API_KEY}` } })

        // Map BetterStack Response & Return:
        const monitors = data?.data?.map(r => {
            const ctx = r?.attributes
            return {
                name: ctx?.public_name,
                description: ctx?.explanation,
                type: ctx?.resource_type,
                up_percent: ctx?.availability,
                status: ctx?.status
            }
        })

        // Return Result:
        return new ApiResponse(res).success(monitors)

    } catch (err) {
        // Request Failure:
        log.for('API').error(`System Status Endpoint - FAILED`, { err })
        return new ApiResponse(res).failure(`Status Fetch Failure - Backend Responded`, 500)

    }
})