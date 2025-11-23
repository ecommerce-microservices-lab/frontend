import axios from 'axios'

// Detectar automáticamente el entorno
const getApiUrl = () => {
  // Si hay una variable de entorno, usarla
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Si estamos en producción (dominio desplegado), usar HTTPS
  if (window.location.hostname === 'app.santiesleo.dev' || 
      window.location.hostname.includes('santiesleo.dev')) {
    return 'https://api.santiesleo.dev'
  }
  
  // Por defecto, usar localhost para desarrollo
  return 'http://localhost:8900'
}

const apiUrl = getApiUrl()
console.log('🔗 API URL configurada:', apiUrl)

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

