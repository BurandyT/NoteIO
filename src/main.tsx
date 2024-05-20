import React from 'react'
import ReactDOM from 'react-dom/client'
import LoginRegister from './RegisterLogin.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './Home.tsx'
import { UserProvider } from './contexts/UserContext.tsx';
const router = createBrowserRouter([
  {
    path: '/',  
    element: <LoginRegister />
  },{
    path: '/home',
    element: <Home />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    
    <UserProvider>
    
      <RouterProvider router={router}/>

    </UserProvider>

  </React.StrictMode>,
)
