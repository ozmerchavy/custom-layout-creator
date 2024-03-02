import { configureStore } from '@reduxjs/toolkit'
import canvasElements from './slices/canvasElements'

export const store = configureStore({
  reducer: {
    canvasElements,
  },
})