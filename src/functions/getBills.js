import api from './api'

export const getBills = async () => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))

    const response = await api.get('/get-bills/' + user.email)

    const result = await response.data
    return {
      error: false,
      message: result.message,
      result: result.result,
    }
  } catch (error) {
    console.error('Error en getBills:', error)
    return {
      error: true,
      message: error.response?.data?.message || 'Error al obtener las facturas',
      status: error.response?.status
    }
  }
}
