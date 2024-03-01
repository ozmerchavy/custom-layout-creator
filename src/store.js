import { configureStore } from '@reduxjs/toolkit'
import counter from './slices/counter'
import canvasElements from './slices/canvasElements'

export const store = configureStore({
  reducer: {
    counter,
    canvasElements,
  },
})