import { useForm } from 'react-hook-form'
import { userSesion } from '../functions/userSesion'
import { Toaster, toast } from 'sonner'
import { Loading } from '../components/Loading'
import { useState, useEffect } from 'react'
import { PiggyBank, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react'
import api from '../functions/api'

export const Login = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({})
  const [loading, setLoading] = useState(false)

  const clearStorage = () => {
    window.localStorage.clear()
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })
  }

  useEffect(() => {
    const token = window.localStorage.getItem('token')
    if (token) {
      window.location.href = '/start'
    } else {
      clearStorage()
    }
  }, [])

  useEffect(() => {
    const expiredMessage = api.getExpiredSessionMessage()
    if (expiredMessage) {
      toast.error(expiredMessage.title, {
        description: expiredMessage.description,
        duration: 3000,
      })
    }
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error, result } = await userSesion(String(data.email).toLowerCase(), data.password)
      if (!error) {
        window.localStorage.setItem('token', result.accessToken)
        window.localStorage.setItem('user', JSON.stringify(result.user))
        window.location.href = '/start'
      } else {
        toast.error('Error al iniciar sesión', { duration: 2000 })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loading />}
      <Toaster richColors />
      <div className='min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4'>
        <div className='w-full max-w-md'>
          {/* Card */}
          <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
            {/* Header */}
            <div className='bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-center'>
              <div className='inline-flex items-center justify-center p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4'>
                <PiggyBank size={32} className='text-white' />
              </div>
              <h1 className='text-3xl font-bold text-white mb-1'>Rinde</h1>
              <p className='text-emerald-100 text-sm'>Gestión financiera inteligente</p>
            </div>

            {/* Form */}
            <div className='p-8'>
              <h2 className='text-xl font-semibold text-gray-800 mb-6 text-center'>Iniciar Sesión</h2>

              <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' className='space-y-5'>
                {/* Email Field */}
                <div className='space-y-1'>
                  <label htmlFor='email' className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    <Mail size={16} className='text-emerald-600' />
                    Correo electrónico
                  </label>
                  <div className='relative'>
                    <input
                      {...register('email', {
                        required: 'Este campo es obligatorio',
                      })}
                      id='email'
                      type='text'
                      placeholder='ejemplo@correo.com'
                      className={`w-full p-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                        errors.email
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className='text-xs text-red-500 flex items-center gap-1 mt-1'>
                      <span className='inline-block w-1 h-1 bg-red-500 rounded-full' />
                      Este campo es obligatorio
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className='space-y-1'>
                  <label htmlFor='password' className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    <Lock size={16} className='text-emerald-600' />
                    Contraseña
                  </label>
                  <div className='relative'>
                    <input
                      {...register('password', {
                        required: 'Este campo es obligatorio',
                      })}
                      id='password'
                      type='password'
                      placeholder='••••••••'
                      className={`w-full p-3 border rounded-lg focus:outline-none transition-all duration-200 ${
                        errors.password
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className='text-xs text-red-500 flex items-center gap-1 mt-1'>
                      <span className='inline-block w-1 h-1 bg-red-500 rounded-full' />
                      Este campo es obligatorio
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                >
                  Iniciar Sesión
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className='px-8 pb-8 pt-2'>
              <div className='border-t border-gray-200 pt-4'>
                <div className='flex flex-col space-y-2'>
                  <div className='flex items-center text-sm text-gray-600'>
                    <CheckCircle size={16} className='text-emerald-500 mr-2' />
                    <span>Gestión financiera simplificada</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <CheckCircle size={16} className='text-emerald-500 mr-2' />
                    <span>Seguimiento de ingresos y gastos</span>
                  </div>
                  <div className='flex items-center text-sm text-gray-600'>
                    <CheckCircle size={16} className='text-emerald-500 mr-2' />
                    <span>Reportes financieros personalizados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <p className='text-center text-gray-500 text-xs mt-6'>
            © {new Date().getFullYear()} Rinde. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </>
  )
}
