import api from './api'

export const logoutUser = async () => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user') || '{}')

    const response = await api.post('/logout', {
      email: user.email || ''
    })

    api.clearAuth()
    return {
      error: false,
      message: response.data?.message || 'Sesión cerrada correctamente',
      data: response.data
    }
  } catch (error) {
    console.error('Error en logout:', error)
    api.clearAuth()
    return {
      error: true,
      message: error.response?.data?.message || 'Sesión finalizada',
      status: error.response?.status
    }
  }
}
