import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className='flex flex-col items-center justify-center min-h-screen p-4' data-theme="cupcake">
      <App />
    </div>
  </React.StrictMode>,
)
