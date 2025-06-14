import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {NextUIProvider} from "@nextui-org/react";
import { Provider } from 'react-redux'
import store from './Store'

// Log the initial Redux state
console.log('Initial Redux State:', store.getState())

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode> 
      <Provider store={store}>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </Provider>
    </StrictMode>
  </BrowserRouter>
)
