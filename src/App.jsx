import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Index } from './views'
import { Income } from './views/income'
import { Login } from './views/login'
import { Toaster } from 'sonner'

export function App () {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/start' element={<Index />} />
          <Route path='/income' element={<Income />} />
        </Routes>
      </BrowserRouter>
    </>

  )
}
