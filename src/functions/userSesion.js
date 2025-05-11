import { RUTABASE } from './rutas'

export const userSesion = async (email, password) => {
  const url = RUTABASE + '/login'
  const data = {
    email,
    password,
  }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  }
  try {
    const response = await fetch(url, requestOptions)
    console.log('Response:', response)
    if (response.status !== 200) {
      return {
        error: true,
        message: 'Error al iniciar sesión',
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
  }
}
