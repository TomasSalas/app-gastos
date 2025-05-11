export const Loading = () => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300'>
      <div className='bg-white px-8 py-6 rounded-xl shadow-lg flex flex-col items-center'>
        {/* Spinner with gradient */}
        <div className='relative w-16 h-16 mb-4'>
          {/* Outer ring */}
          <div className='absolute inset-0 border-4 border-emerald-100 rounded-full' />

          {/* Spinning gradient ring */}
          <div className='absolute inset-0 border-4 border-transparent border-t-emerald-600 border-r-teal-500 rounded-full animate-spin' />

          {/* Inner dot */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='w-2 h-2 bg-emerald-600 rounded-full' />
          </div>
        </div>

        {/* Text */}
        <p className='text-gray-700 font-medium'>Cargando</p>
        <div className='flex space-x-1 mt-1'>
          <div
            className='w-1 h-1 bg-emerald-600 rounded-full animate-bounce'
            style={{ animationDelay: '0s' }}
          />
          <div
            className='w-1 h-1 bg-emerald-600 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          />
          <div
            className='w-1 h-1 bg-emerald-600 rounded-full animate-bounce'
            style={{ animationDelay: '0.4s' }}
          />
        </div>
      </div>
    </div>
  )
}
