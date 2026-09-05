import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthLayout from './components/AuthLayout.jsx';
import App from './App.jsx'
import HomePage from './pages/Home.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import DashboardPage from './pages/Dashboard.jsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <AuthLayout authentication={true}>
            <HomePage />
          </AuthLayout>
        ),
      },
      {
        path:'/login',
        element: (
           <AuthLayout authentication={false}>
             <LoginPage />,
           </AuthLayout>)
      },
      {
        path:'/register',
        element: (
           <AuthLayout authentication={false}>
             <RegisterPage />,
           </AuthLayout>)
      },
      {
        path:'/dashboard',
        element: (
           <AuthLayout authentication={true}>
             <DashboardPage />,
           </AuthLayout>)
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
