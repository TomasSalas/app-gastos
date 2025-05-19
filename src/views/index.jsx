import { useEffect, useState } from 'react'
import { MenuDrawer } from '../components/MenuDrawer'
import { getBills } from '../functions/getBills'
import { Loading } from '../components/Loading'
import { Autocomplete } from '../components/AutoComplete'
import { Meses } from '../info/data'
import {
  CirclePlus,
  MinusCircle,
  CircleCheck,
  CircleAlert,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  CreditCard,
  DollarSign,
} from 'lucide-react'

export const Index = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState(null)

  const formatCLP = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const paddedDay = String(day).padStart(2, '0')
    const paddedMonth = String(month).padStart(2, '0')
    return `${paddedDay}-${paddedMonth}-${year}`
  }

  const filterDataByMonth = (data, month, year) => {
    return data.filter((item) => {
      try {
        const [itemYear, itemMonth, itemDay] = item.date.split('-').map(Number)
        const itemDate = new Date(itemYear, itemMonth - 1, itemDay)
        const itemMonthValue = itemDate.getMonth() + 1
        const itemYearValue = itemDate.getFullYear()
        return itemMonthValue === month && itemYearValue === year
      } catch (error) {
        console.error(`Error al parsear fecha ${item.date}:`, error)
        return false
      }
    })
  }

  const calculateDebt = (data) => {
    const totalDebt = data
      .filter((item) => item.type === 'Deudas' && item.subtype !== 'Pago Deuda')
      .reduce((sum, item) => sum + Number.parseInt(item.amount), 0)

    const debtPayments = data
      .filter((item) => (item.type === 'Egresos' && item.subtype === 'Pago Deuda') || item.type === 'PagoDeuda')
      .reduce((sum, item) => sum + Number.parseInt(item.amount), 0)

    return totalDebt - debtPayments
  }

  const calculateBalance = (data) => {
    return data.reduce((sum, item) => {
      if (item.type === 'Ingresos') {
        return sum + Number.parseInt(item.amount)
      } else if (item.type === 'Egresos' || item.type === 'Ahorros') {
        return sum - Number.parseInt(item.amount)
      }
      return sum
    }, 0)
  }

  const calculateAhorro = (data) => {
    return data.reduce((sum, item) => {
      if (item.type === 'Ahorros' || (item.type === 'Egresos' && item.subtype === 'Ahorros')) {
        return sum + Number.parseInt(item.amount)
      }
      return sum
    }, 0)
  }

  const calculateIngresos = (data) => {
    return data.filter((item) => item.type === 'Ingresos').reduce((sum, item) => sum + Number.parseInt(item.amount), 0)
  }

  const calculateEgresos = (data) => {
    return data
      .filter((item) => item.type === 'Egresos' || item.type === 'Ahorros')
      .reduce((sum, item) => sum + Number.parseInt(item.amount), 0)
  }

  const Bills = async () => {
    setLoading(true)
    try {
      const { error, result } = await getBills()
      if (!error) {
        setAllData(result)
        const currentYear = new Date().getFullYear()
        const filteredData = filterDataByMonth(result, selectedMonth, currentYear)
        setData(filteredData)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    Bills()
  }, [])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const filteredData = filterDataByMonth(allData, selectedMonth, currentYear)
    setData(filteredData)
  }, [selectedMonth, allData])

  const handleMonthChange = (selectedOption) => {
    setSelectedMonth(selectedOption ? selectedOption.id : new Date().getMonth() + 1)
  }

  const filteredTransactions = (filterType === 'Deudas' ? allData : data).filter((item) => {
    const matchesSearch =
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.date.includes(searchTerm)

    if (!filterType) return matchesSearch
    if (filterType === 'Deudas') {
      return matchesSearch && (item.type === 'Deudas' || (item.type === 'Egresos' && item.subtype === 'Pago Deuda'))
    }
    return matchesSearch && item.type === filterType
  })

  return (
    <>
      {loading && <Loading />}
      <MenuDrawer>
        <div className='p-4 bg-gray-50'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-8'>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold text-gray-800'>Panel Financiero</h1>
              </div>
              <div className='mt-4'>
                <Autocomplete
                  options={Meses}
                  placeholder='Selecciona un mes'
                  noOptionsText='No se encontraron resultados'
                  isClearable
                  className='w-full md:max-w-[400px]'
                  selectedClassName='bg-emerald-600 text-white hover:text-white hover:bg-emerald-700 rounded-md'
                  hoverClassName='hover:bg-emerald-600 hover:text-white hover:rounded-md hover:transition-colors hover:duration-300'
                  value={Meses.find((mes) => mes.id === selectedMonth) || null}
                  onChange={handleMonthChange}
                  leftIcon={<Calendar className='w-4 h-4 text-gray-500' />}
                />
              </div>
            </div>

            {/* Main Stats */}
            <div className='grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
              {/* Balance Card */}
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all ${
                  filterType === null ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setFilterType(null)}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-emerald-100 p-3 rounded-lg mr-4'>
                        <Wallet className='h-6 w-6 text-emerald-600' />
                      </div>
                      <div>
                        <h2 className='text-sm font-medium text-gray-500'>Balance Total</h2>
                        <p className='text-2xl font-bold text-gray-800'>{formatCLP(calculateBalance(data))}</p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${
                        calculateBalance(data) >= 0 ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      {calculateBalance(data) >= 0
                        ? (
                          <ArrowUpRight className='h-6 w-6' />
                          )
                        : (
                          <ArrowDownRight className='h-6 w-6' />
                          )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Card */}
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all ${
                  filterType === 'Ahorros' ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setFilterType('Ahorros')}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-blue-100 p-3 rounded-lg mr-4'>
                        <PiggyBank className='h-6 w-6 text-blue-600' />
                      </div>
                      <div>
                        <h2 className='text-sm font-medium text-gray-500'>Ahorros</h2>
                        <p className='text-2xl font-bold text-gray-800'>{formatCLP(calculateAhorro(data))}</p>
                      </div>
                    </div>
                    <CircleCheck className='h-6 w-6 text-blue-600' />
                  </div>
                </div>
              </div>

              {/* Debt Card */}
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all ${
                  filterType === 'Deudas' ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setFilterType('Deudas')}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-amber-100 p-3 rounded-lg mr-4'>
                        <CreditCard className='h-6 w-6 text-amber-600' />
                      </div>
                      <div>
                        <h2 className='text-sm font-medium text-gray-500'>Deuda Total</h2>
                        <p className='text-2xl font-bold text-gray-800'>{formatCLP(calculateDebt(allData))}</p>
                      </div>
                    </div>
                    <CircleAlert className='h-6 w-6 text-amber-600' />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
              {/* Income Card */}
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all ${
                  filterType === 'Ingresos' ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setFilterType('Ingresos')}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-emerald-100 p-3 rounded-lg mr-4'>
                        <CirclePlus className='h-6 w-6 text-emerald-600' />
                      </div>
                      <div>
                        <h2 className='text-sm font-medium text-gray-500'>Ingresos Total</h2>
                        <p className='text-2xl font-bold text-gray-800'>{formatCLP(calculateIngresos(data))}</p>
                      </div>
                    </div>
                    <TrendingUp className='h-6 w-6 text-emerald-600' />
                  </div>
                </div>
              </div>

              {/* Expenses Card */}
              <div
                className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 cursor-pointer transition-all ${
                  filterType === 'Egresos' ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => setFilterType('Egresos')}
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-red-100 p-3 rounded-lg mr-4'>
                        <MinusCircle className='h-6 w-6 text-red-600' />
                      </div>
                      <div>
                        <h2 className='text-sm font-medium text-gray-500'>Egresos Total</h2>
                        <p className='text-2xl font-bold text-gray-800'>{formatCLP(calculateEgresos(data))}</p>
                      </div>
                    </div>
                    <TrendingDown className='h-6 w-6 text-red-600' />
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
              <div className='p-6'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6'>
                  <h2 className='text-xl font-bold text-gray-800'>Historial de Transacciones</h2>
                  <div className='mt-3 md:mt-0 relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Search className='h-4 w-4 text-gray-400' />
                    </div>
                    <input
                      type='text'
                      placeholder='Buscar transacciones...'
                      className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-64'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className='overflow-x-auto'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden border border-gray-200 rounded-lg max-h-[30vh] overflow-y-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50 sticky top-0 z-10'>
                          <tr>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Descripción
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Tipo
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Subtipo
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Monto
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Fecha
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {/* Resto del código de la tabla sin cambios */}
                          {filteredTransactions.length > 0
                            ? (
                                filteredTransactions.map((item, index) => (
                                  <tr key={index} className='hover:bg-gray-50'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                      {item.description}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                      <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                          item.type === 'Ingresos'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : item.type === 'Egresos'
                                            ? 'bg-red-100 text-red-800'
                                            : item.type === 'Ahorros'
                                            ? 'bg-blue-100 text-blue-800'
                                            : (item.type === 'Deudas' && item.subtype === 'Pago Deuda') || item.type === 'PagoDeuda'
                                            ? 'bg-green-100 text-green-800'
                                            : item.type === 'Deudas'
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                      >
                                        {item.type === 'Ingresos' && <CirclePlus className='w-3 h-3 mr-1' />}
                                        {item.type === 'Egresos' && <MinusCircle className='w-3 h-3 mr-1' />}
                                        {item.type === 'Ahorros' && <PiggyBank className='w-3 h-3 mr-1' />}
                                        {(item.type === 'Deudas' && item.subtype === 'Pago Deuda') || item.type === 'PagoDeuda'
                                          ? (
                                            <DollarSign className='w-3 h-3 mr-1' />
                                            )
                                          : item.type === 'Deudas'
                                            ? (
                                              <CreditCard className='w-3 h-3 mr-1' />
                                              )
                                            : null}
                                        {(item.type === 'Deudas' && item.subtype === 'Pago Deuda') || item.type === 'PagoDeuda'
                                          ? 'Pago Deuda'
                                          : item.type}
                                      </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      {item.subtype || '-'}
                                    </td>
                                    <td
                                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                                        item.type === 'Ingresos' || item.type === 'Ahorros'
                                          ? 'text-emerald-600'
                                          : item.type === 'Egresos'
                                          ? 'text-red-600'
                                          : (item.type === 'Deudas' && item.subtype === 'Pago Deuda') || item.type === 'PagoDeuda'
                                          ? 'text-green-600'
                                          : item.type === 'Deudas'
                                          ? 'text-amber-600'
                                          : 'text-gray-900'
                                      }`}
                                    >
                                      {formatCLP(item.amount)}
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                      {formatDate(item.date)}
                                    </td>
                                  </tr>
                                ))
                              )
                            : (
                              <tr>
                                <td colSpan={5} className='px-6 py-4 text-center text-sm text-gray-500'>
                                  No se encontraron transacciones
                                </td>
                              </tr>
                              )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MenuDrawer>
    </>
  )
}
