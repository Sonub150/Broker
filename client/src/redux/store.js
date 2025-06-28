import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { combineReducers } from 'redux'

// Persist config for user slice
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'] // only persist user slice
}

// Combine reducers (in case you add more slices later)
const rootReducer = combineReducers({
  user: userReducer
})

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
})

// Create the persistor
export const persistor = persistStore(store)

export default store;