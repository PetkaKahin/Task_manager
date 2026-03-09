import './echo'
import axios from 'axios'
import echo from '@/echo'

axios.interceptors.request.use((config) => {
    const socketId = echo.socketId()
    if (socketId) {
        config.headers['X-Socket-Id'] = socketId
    }
    return config
})
