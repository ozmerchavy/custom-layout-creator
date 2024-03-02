import { createSlice } from '@reduxjs/toolkit'



const exampleRootElement = {
  id: 'root',
  type: "div",
  cssProps: { position: 'relative', margin: '1rem' },
  children: [
    {
      id: 'div1',
      type: "div",
      cssProps: { margin: '1rem', padding: '1rem', color: 'blue', backgroundColor: 'lightgreen' },
      children: [
        {
          id: 'button1',
          type: "button",
          cssProps: { margin: '0.5rem', padding: '0.5rem', color: 'white', backgroundColor: 'blue' },
          children: 'Button 1',
        },
        {
          id: 'div2',
          type: "div",

          cssProps: { margin: '1rem', padding: '1rem', backgroundColor: 'lightcoral' },
          children: [
            {
              id: 'button2',
              type: "button",

              cssProps: { margin: '0.5rem', padding: '0.5rem', color: 'white', backgroundColor: 'green' },
              children: 'Button 2',
            },
            {
              id: 'div3',
              type: "div",

              cssProps: { margin: '1rem', padding: '1rem', backgroundColor: 'lightgrey' },
              children: [
                {
                  id: 'button3',
                  type: "button",

                  cssProps: { margin: '0.5rem', padding: '0.5rem', color: 'black', backgroundColor: 'orange' },
                  children: 'Button 3',
                },
                {
                  id: 'div4',
                  type: "div",

                  cssProps: { margin: '1rem', padding: '1rem', backgroundColor: 'lightyellow' },
                  children: [
                    {
                      id: 'button4',
                      type: "button",
                      cssProps: { margin: '0.5rem', padding: '0.5rem', color: 'black', backgroundColor: 'yellow' },
                      children: 'Button 4',
                    }
                  ],
                }
              ],
            }
          ],
        }
      ],
    }
  ],
};

export function findObjectById(state, id) {
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
  initialState: {
    root: exampleRootElement,
    idSelected: undefined,
  },
  reducers: {
    addElement: (state, { payload }) => {
      const { parentId, type, } = payload;
      const parent = findObjectById(state.root, parentId);
      parent.children.push({
        type,
        id: makeId(),
        cssProps: {},
        children: type === "button" ? "text" : [],
      })
    },
    selectElement : (state, {payload} ) =>{
      const elementId = payload;
      state.idSelected = elementId
    },
    modifySelectedElement: (state, {payload})=>{
      const cssProps = payload;
      const selectedElement = findObjectById(state.root, state.idSelected);
      selectedElement.cssProps = { ...selectedElement.cssProps, ...cssProps };
    }

    
  },
})

export const { addElement, selectElement, modifySelectedElement } = canvasElements.actions
export default canvasElements.reducer