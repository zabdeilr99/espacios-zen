import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#2c3e2e',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            borderRadius: '12px',
            border: '1px solid #ddd6c9',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#4a9354', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
