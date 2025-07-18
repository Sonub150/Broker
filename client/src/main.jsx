import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import CreateListing from './pages/CreateListing'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<div className="flex items-center justify-center min-h-screen">Loading...</div>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
