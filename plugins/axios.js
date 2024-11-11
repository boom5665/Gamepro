import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const axiosInstance = axios.create({
        baseURL: config.public.baseURL // ใส่ base URL ของคุณที่นี่
    })

    // Request interceptor
    axiosInstance.interceptors.request.use(config => {
        // ทำบางอย่างก่อน request ถูกส่ง
        // คุณสามารถเพิ่ม headers หรือ config อื่น ๆ ได้ที่นี่
        // config.headers['Authorization'] = 'Bearer YOUR_TOKEN'
        
        // เปิด Loader action
        nuxtApp.$mainStore.loaderAction(true);
        return config
    }, error => {
        // ทำบางอย่างกับ request error
        return Promise.reject(error)
    })

    // Response interceptor
    axiosInstance.interceptors.response.use(response => {
        // ทำบางอย่างกับ response data
        // console.log('Response Interceptor', response)

        // ปิด Loader action
        nuxtApp.$mainStore.loaderAction(false);
        return response
    }, error => {
        // ทำบางอย่างกับ response error
        return Promise.reject(error)
    })

    nuxtApp.provide('axios', axiosInstance)
})
