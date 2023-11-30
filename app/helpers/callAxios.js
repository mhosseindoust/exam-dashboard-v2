import axios from 'axios'
import { CatchMessage } from '@/utils/errorHandle'
// import { CatchMessage } from '@utils/errorHandle'
// import { getSession } from 'next-auth/react'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  // headers: {
  // 'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Headers': '*',
  // 'Access-Control-Allow-Credentials': 'true',
  // },
})

instance.interceptors.request.use(
  async function (config) {
    config.withCredentials = true
    // const session = await getSession()
    // if (session) {
    //   config.headers.Authorization = `Bearer ${session.accessToken}`
    // }

    if (config.url.startsWith('/v2')) {
      config.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL_V2
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const errorData = CatchMessage(error)
    error.errorData = errorData
    console.log('Error occurred:', error)
    return Promise.reject(error)
  },
)

export default instance
