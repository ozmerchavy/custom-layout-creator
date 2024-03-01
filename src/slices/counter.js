import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counter = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, { payload }) => {
      state.value += payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counter.actions
export default counter.reducer