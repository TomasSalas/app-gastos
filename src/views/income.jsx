'use client'

import { useEffect, useState } from 'react'
import { Autocomplete } from '../components/AutoComplete'
import { DatePicker } from '../components/DatePicker'
import { useForm, Controller } from 'react-hook-form'
import { MenuDrawer } from '../components/MenuDrawer'
import { dataTipoIngreso } from '../info/data'
import { insertBills } from '../functions/insertBills'
import { toast } from 'sonner'
import { Loading } from '../components/Loading'
import { CreditCard, DollarSign, PiggyBank, Wallet, CalendarDays, FileText, Plus } from 'lucide-react'

export const Income = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    resetField,
    reset,
  } = useForm({})
  const [activeTab, setActiveTab] = useState('Ingresos')
  const [amount, setAmount] = useState('')
  const [optionSelect, setOptionSelect] = useState([])
  const [loading, setLoading] = useState(false)

  const typeLabel =
    {
      Ingresos: 'Tipo de Ingreso',
      Egresos: 'Tipo de Gasto',
      Deudas: 'Tipo de Deuda',
      Ahorro: 'Tipo de Ahorro',
    }[activeTab] || 'Tipo'

  const tabIcons = {
    Ingresos: <DollarSign className='w-5 h-5' />,
    Egresos: <Wallet className='w-5 h-5' />,
    Deudas: <CreditCard className='w-5 h-5' />,
    Ahorros: <PiggyBank className='w-5 h-5' />,
  }

  const formatCLP = (value) => {
    const numericValue = value.replace(/[^0-9]/g, '')
    if (!numericValue) return ''

    const formattedValue = Number.parseInt(numericValue)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    return `$ ${formattedValue}`
  }

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    setAmount(rawValue)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const { error } = await insertBills(data)
      if (!error) {
        toast.success('Registrado Exitosamente', { duration: 2000 })
      } else {
        toast.error('No se pudo registrar', { duration: 2000 })
      }
    } finally {
      setLoading(false)
      setAmount('')
      reset({
        monto: '',
        descripcion: '',
        tipoIngreso: null,
        fecha: null,
      })
    }
  }

  useEffect(() => {
    resetField('tipoIngreso', { defaultValue: null })
    const filteredOptions = dataTipoIngreso.filter((option) => option.option === activeTab)
    setOptionSelect(filteredOptions)
  }, [activeTab, resetField])

  return (
    <>
      {loading && <Loading />}
      <MenuDrawer>
        <div className='p-4 md:p-6 bg-gray-50 transition-colors duration-200'>
          <div className='max-w-4xl mx-auto'>
            <div className='flex flex-col items-start justify-center mb-8'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Control Financiero</h1>
            </div>

            <div className='bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-all duration-200'>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-1.5 p-3 bg-white border-b border-gray-100'>
                {['Ingresos', 'Egresos', 'Deudas', 'Ahorros'].map((tab) => {
                  const isActive = activeTab === tab
                  return (
                    <button
                      key={tab}
                      className={`flex items-center justify-center gap-2 py-3 px-4 font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tabIcons[tab]}
                      <span>{tab}</span>
                    </button>
                  )
                })}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6 p-6 md:p-8' autoComplete='off'>
                <div className='grid md:grid-cols-2 gap-6'>
                  {/* Monto Field */}
                  <div>
                    <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5'>
                      <DollarSign className='w-4 h-4 text-emerald-600' />
                      Monto
                    </label>
                    <div className='relative'>
                      <input
                        {...register('monto', {
                          required: 'Este campo es obligatorio',
                        })}
                        type='text'
                        value={formatCLP(amount)}
                        onChange={handleAmountChange}
                        placeholder='$ 0'
                        className={`h-[42px] w-full p-3 border rounded-lg bg-white text-gray-900 focus:outline-none transition-all duration-200 ${
                          errors.monto ? 'border-red-400 bg-red-50' : 'border-gray-300'
                        } ${!errors.monto ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200' : ''}`}
                      />
                      <div className='h-[4px] my-[0.5px] ml-2'>
                        <p className='text-xs text-red-600'>{errors.monto ? 'Este campo es obligatorio' : ' '}</p>
                      </div>
                    </div>
                  </div>

                  {/* Fecha Field */}
                  <div>
                    <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5'>
                      <CalendarDays className='w-4 h-4 text-emerald-600' />
                      Fecha
                    </label>
                    <div className='relative'>
                      <Controller
                        name='fecha'
                        control={control}
                        rules={{ required: 'Este campo es obligatorio' }}
                        render={({ field }) => (
                          <DatePicker
                            {...field}
                            placeholder='Selecciona una fecha'
                            className='w-full'
                            selectedClassName='bg-emerald-600 text-white'
                            hoverClassName='hover:bg-emerald-600 hover:text-white hover:transition-colors hover:duration-300'
                            onDateChange={(e) => {
                              field.onChange(e)
                            }}
                            error={!!errors.fecha}
                          />
                        )}
                      />

                    </div>
                  </div>
                </div>

                {/* Tipo de Ingreso Field */}
                <div>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5'>
                    <FileText className='w-4 h-4 text-emerald-600' />
                    {typeLabel}
                  </label>
                  <div className='relative'>
                    <Controller
                      name='tipoIngreso'
                      control={control}
                      rules={{
                        required: 'Este campo es obligatorio',
                      }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={optionSelect}
                          placeholder='Selecciona una opción...'
                          noOptionsText='No se encontraron resultados'
                          isClearable
                          onChange={(value) => {
                            field.onChange(value)
                          }}
                          className='w-full'
                          selectedClassName='bg-emerald-600 text-white hover:text-white hover:bg-emerald-700 rounded-md'
                          hoverClassName='hover:bg-emerald-600 hover:text-white hover:rounded-md hover:transition-colors hover:duration-300'
                          error={!!errors.tipoIngreso}
                        />
                      )}
                    />

                  </div>
                </div>

                {/* Descripción Field */}
                <div>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5'>
                    <FileText className='w-4 h-4 text-emerald-600' />
                    Descripción
                  </label>
                  <div className='relative'>
                    <textarea
                      {...register('descripcion', {
                        required: 'Este campo es obligatorio',
                      })}
                      placeholder={`Descripción del ${activeTab.toLowerCase()}`}
                      className={`w-full p-3 border rounded-lg bg-white text-gray-900 resize-none focus:outline-none transition-all duration-200 ${
                        errors.descripcion ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      } ${!errors.descripcion ? 'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200' : ''}`}
                      rows='3'
                    />
                    <div className='h-[4px] my-[0.5px] ml-2'>
                      <p className='text-xs text-red-600'>{errors.descripcion ? 'Este campo es obligatorio' : ' '}</p>
                    </div>
                  </div>
                </div>

                <button
                  type='submit'
                  className='mt-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                >
                  <Plus className='w-5 h-5' />
                  Registrar {activeTab.slice(0, -1)}
                </button>
              </form>
            </div>
          </div>
        </div>
      </MenuDrawer>
    </>
  )
}
