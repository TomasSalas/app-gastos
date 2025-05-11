import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logoutUser } from '../functions/logoutUser'
import { Loading } from './Loading'
import { PiggyBank, Home, TrendingUp, Menu, LogOut, ChevronRight } from 'lucide-react'

export const MenuDrawer = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    setLoading(true)
    const { error } = await logoutUser()
    if (!error) {
      window.localStorage.clear()
      setIsOpen(false)
      navigate('/')
    }
  }

  const navLinks = [
    { name: 'Inicio', path: '/start', icon: Home },
    { name: 'Ingresos', path: '/income', icon: TrendingUp },
  ]

  useEffect(() => {
    const user = window.localStorage.getItem('user')
    if (user) {
      try {
        const parsedUser = JSON.parse(user)
        if (parsedUser.name) {
          setUserName(parsedUser.name)
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error)
      }
    }
  }, [])

  return (
    <>
      {loading && <Loading />}
      <div className='relative min-h-screen'>
        <header className='bg-white fixed top-0 left-0 right-0 flex items-center justify-between p-3 shadow-lg z-50'>
          <button
            onClick={toggleDrawer}
            className='p-2 text-black rounded-full hover:bg-white/20 transition-all duration-200'
            aria-label='Toggle Menu'
          >
            <Menu className='w-6 h-6' />
          </button>

          <div className='flex items-center gap-2'>
            <div className='text-right'>
              <p className='text-xs text-black'>Bienvenido</p>
              <h2 className='font-bold text-black'>{userName}</h2>
            </div>
          </div>
        </header>

        {/* Backdrop */}
        {isOpen && (
          <div
            className='fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300'
            onClick={toggleDrawer}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0 rounded-r-xl shadow-2xl' : '-translate-x-full'
          }`}
        >
          <div className='p-6 h-full flex flex-col'>
            {/* Logo Section */}
            <div className='flex items-center justify-center mb-8 pt-2'>
              <div className='bg-gradient-to-r from-emerald-600 to-teal-500 p-3 rounded-xl shadow-md'>
                <PiggyBank className='w-8 h-8 text-white' />
              </div>
              <div className='ml-3'>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent'>
                  Rinde
                </h2>
                <p className='text-xs text-gray-500'>Gestión financiera</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className='flex flex-col gap-2 flex-grow'>
              <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 pl-2'>Menú Principal</p>

              {navLinks.map((link) => {
                const isActive = location.pathname === link.path
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-medium shadow-md'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                    onClick={toggleDrawer}
                  >
                    <link.icon
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-600 group-hover:text-emerald-700'}`}
                    />
                    <span className='ml-3'>{link.name}</span>
                    {isActive && <ChevronRight className='w-4 h-4 ml-auto' />}
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <div className='mt-auto pt-4 border-t border-gray-100'>
              <button
                onClick={handleLogout}
                className='w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-all duration-200 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
              >
                <LogOut className='w-5 h-5' />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className='transition-all duration-300 pt-16'>{children}</div>
      </div>
    </>
  )
}
