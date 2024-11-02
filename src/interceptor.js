import axios from "axios"
import {useRouter} from "vue-router";

const router = useRouter()

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
})

api.interceptors.request.use(response => response, error => {
    if (error.response && error.response.status === 401) {
        router.push({name: 'Login'})
    }

    return Promise.reject(error)
})

export default api