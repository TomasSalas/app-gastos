import api from './api'

export const insertBills = async (data) => {
  try {
    const user = JSON.parse(window.localStorage.getItem('user'))
    const cleanAmount = parseInt(data.monto.replace(/[^0-9]/g, ''), 10)

    const dataPost = {
      email: user.email,
      type: data.tipoIngreso.option,
      amount: cleanAmount,
      date: data.fecha,
      description: data.descripcion,
      subtype: data.tipoIngreso.value,
    }

    const response = await api.post('/create-bill', dataPost)
    const result = await response.data
    return {
      error: false,
      message: result.message,
      result: result.result,
    }
  } catch (error) {
    console.error('Error en insertBills:', error)
    return {
      error: true,
      message: error.response?.data?.message || 'Error al insertar las facturas',
      status: error.response?.status
    }
  }
}
