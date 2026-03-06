import axios from 'axios'
import echo from '@/echo'

const apiRequest = axios.create({
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

apiRequest.interceptors.request.use((config) => {
    const socketId = echo.socketId()
    if (socketId) {
        config.headers['X-Socket-Id'] = socketId
    }
    return config
})

export { apiRequest }
