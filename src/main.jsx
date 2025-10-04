import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GlobalProvider } from './context/GlobalContext';
import './index.css';
import { store } from './redux/store';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <GlobalProvider>
        <Provider store={store}>
          <App />
          <Toaster position="top-right" />
        </Provider>
      </GlobalProvider>
    </AuthProvider>
  </BrowserRouter>
);
