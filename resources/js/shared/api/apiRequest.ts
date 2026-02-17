import axios from 'axios'

const apiRequest = axios.create({
    baseURL: '/api',
    headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

export { apiRequest }
