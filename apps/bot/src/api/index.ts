import Express from 'express'
import cors from './middleware/cors'
import rateLimiter from './middleware/rateLimiter'
import { ApiResponse } from '@suppora/shared'
import authRoutes from './routes/auth'
import identityRoutes from './routes/identity'

// Express App:
const app = Express()
const PORT = process.env.PORT || 3000;
const ENVIRONMENT = process.env?.ENVIRONMENT || 'development'

// Config - Auto Parse JSON:
app.use(Express.json())

// Config - Trust Proxy:
app.set('trust-proxy', true)

// Middleware - Use Cors:
app.use(cors)

// Middleware - Rate Limiter:
app.use(rateLimiter)


// API Routes:
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/identity', identityRoutes)


// NOT FOUND - 404 Handler:
app.use((req, res) => {
    return new ApiResponse(res).failure('NOT FOUND', 404)
})


// START SERVER / LISTEN TO PORT:
export default function START_SERVER() {
    app.listen(PORT, () => {
        console.info(`[🌐] Web Server is running on ${PORT}`);
        if (ENVIRONMENT != 'production') console.info(`[🌐] Visit at http://localhost:${PORT}`);
    })
}
