import axios from 'axios'
import { RUTABASE } from './rutas'

const api = axios.create({
  baseURL: RUTABASE,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

let sessionExpiredMessage = null

api.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      sessionExpiredMessage = {
        title: 'Sesión expirada',
        description: 'Por favor inicie sesión nuevamente'
      }

      window.localStorage.removeItem('token')
      window.localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

api.getExpiredSessionMessage = () => {
  const message = sessionExpiredMessage
  sessionExpiredMessage = null
  return message
}

api.setToken = (token) => {
  window.localStorage.setItem('token', token)
  api.defaults.headers.common.Authorization = `Bearer ${token}`
}

api.clearAuth = () => {
  window.localStorage.removeItem('token')
  window.localStorage.removeItem('user')
  delete api.defaults.headers.common.Authorization
}

export default api
