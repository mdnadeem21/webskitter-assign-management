import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <h1 className='font-bold underline bg-orange-500 text-center'>Welcome to Task Management App</h1> */}
      <Navbar/>
      <div className='container mx-auto'>
        <Outlet/>
      </div>

    </>
  )
}

export default App
