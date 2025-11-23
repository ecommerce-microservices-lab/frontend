import { createContext, useState, useContext, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Verificar si el token es válido obteniendo el usuario
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      // Aquí puedes hacer una llamada para obtener el usuario actual
      // Por ahora solo guardamos el token
      setLoading(false)
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
    }
  }

  const login = async (username, password) => {
    try {
      const response = await api.post('/app/api/authenticate', {
        username,
        password
      })
      
      // El endpoint devuelve 'jwtToken', no 'token'
      const newToken = response.data.jwtToken || response.data.token
      setToken(newToken)
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/app/api/users', userData)
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Register error:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrar usuario' 
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

