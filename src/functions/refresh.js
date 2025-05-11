import { RUTABASE } from './rutas'

// Función para refrescar el token
const refreshToken = async () => {
  const url = RUTABASE + '/refresh'
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // Para enviar las cookies
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const result = await response.json()
    window.localStorage.setItem('token', result.accessToken)
    return result.accessToken
  } catch (error) {
    console.error('Error refreshing token:', error)
    throw error
  }
}

// Función principal de logout con interceptor
export const logoutUser = async (retry = true) => {
  const url = RUTABASE + '/logout'
  let token = window.localStorage.getItem('token')
  const user = JSON.parse(window.localStorage.getItem('user'))

  const data = {
    email: user.email
  }

  const makeRequest = async () => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    }

    return await fetch(url, requestOptions)
  }

  try {
    let response = await makeRequest(token)

    // Si recibimos 401 y es el primer intento, intentamos refrescar el token
    if (response.status === 401 && retry) {
      try {
        token = await refreshToken()
        response = await makeRequest(token) // Reintentar con el nuevo token
      } catch (refreshError) {
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('user')
        return {
          error: true,
          message: 'Sesión expirada. Por favor, inicie sesión nuevamente.',
        }
      }
    }

    if (response.status !== 200) {
      return {
        error: true,
        message: 'Error al cerrar sesión',
      }
    }

    const result = await response.json()
    return {
      error: false,
      message: result.message,
      result
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      error: true,
      message: 'Error de conexión',
    }
  }
}
