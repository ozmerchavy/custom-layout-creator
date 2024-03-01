import { createSlice } from '@reduxjs/toolkit'

const exampleState = [
  {
    id: '',
    type: "div",
    cssProps: { margin: '', color: '' },
    children: [
      {
        id: '',
        type: "button",
        cssProps: { margin: '', color: '' },
        children: 'hi',
      }
    ]
  },
  {
    id: '',
    type: "button",
    cssProps: { margin: '', color: '' },
    children: 'hi',
  }
]

const initialState = {
  id: 'root',
  type: "div",
  cssProps: { position: 'relative', margin: '1rem' },
  children: [
    {
      id: 'some-id',
      type: "button",
      cssProps: { margin: '1rem', padding: '1rem', color: 'grey' },
      children: 'click me',
    }
  ],
};


function findObjectById(state, id) {
  if (state.id === id) {
    return state;
  }
  if (Array.isArray(state.children)) {
    for (const child of state.children) {
      const result = findObjectById(child, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

const makeId = (() => {
  let id = 0;
  return () => String(id++);
})()

export const canvasElements = createSlice({
  name: 'canvasElements',
  initialState,
  reducers: {
    addElement: (state, { payload }) => {
      const { parentId, type, } = payload;
      const parent = findObjectById(state, parentId);
      parent.children.push({
        type,
        id: makeId(),
        cssProps: {},
        children: type === "button" ? "text" : [],
      })
    },
  },
})

export const { addElement } = canvasElements.actions
export default canvasElements.reducer