import axios, {
    type AxiosResponse,
    type AxiosInstance,
    type AxiosRequestConfig,
    AxiosError
  } from 'axios'
  
  export const baseURL = 'http://localhost:3000'

  /** Some CORS Issues i am using CORS Unblock Chrome Extension */
  const config: AxiosRequestConfig = {
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  function apiError(error: AxiosError): unknown {
    if (error && 'isAxiosError' in error && error.isAxiosError) {
      const { response } = error
      return { ...response }
    }
  }
  const apiService: AxiosInstance = axios.create(config)
  
  const errorHandler = (error: AxiosError) => {
    const isRespError = apiError(error)
    if (isRespError) {
      console.error(error)
    }
    return Promise.reject({ ...error })
  }
  
  const successHandler = (response: AxiosResponse) => {
    const { data } = response
    return data
  }
  
  apiService.interceptors.response.use(
    (response) => successHandler(response),
    (error) => errorHandler(error)
  )
  
  export default apiService
  