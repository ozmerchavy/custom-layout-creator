import { createSlice } from '@reduxjs/toolkit'



const exampleRootElement = {
  "id": "root",
  "type": "div",
  "cssProps": {
    "position": "relative",
    "margin": "1rem",
    "width": "auto",
    "height": "auto",
    "display": "block",
    "color": "#000000",
    "backgroundColor": "transparent"
  },
  "children": [
    {
      "id": "div1",
      "type": "div",
      "cssProps": {
        "margin": "1rem",
        "padding": "1rem",
        "color": "blue",
        "backgroundColor": "#90ee90",
        "width": "auto",
        "height": "auto",
        "display": "block",
        "position": "static"
      },
      "children": [
        {
          "id": "button1",
          "type": "button",
          "cssProps": {
            "margin": "0.5rem",
            "padding": "0.5rem",
            "color": "white",
            "backgroundColor": "blue",
            "width": "auto",
            "height": "auto",
            "display": "block",
            "position": "static"
          },
          "children": "Button 1"
        },
        {
          "id": "div2",
          "type": "div",
          "cssProps": {
            "margin": "1rem",
            "padding": "1rem",
            "backgroundColor": "lightcoral",
            "width": "auto",
            "height": "auto",
            "display": "block",
            "position": "static"
          },
          "children": [
            {
              "id": "button2",
              "type": "button",
              "cssProps": {
                "margin": "0.5rem",
                "padding": "0.5rem",
                "color": "white",
                "backgroundColor": "green",
                "width": "auto",
                "height": "auto",
                "display": "block",
                "position": "static"
              },
              "children": "Button 2"
            },
            {
              "id": "div3",
              "type": "div",
              "cssProps": {
                "margin": "1rem",
                "padding": "1rem",
                "backgroundColor": "lightgrey",
                "width": "auto",
                "height": "auto",
                "display": "block",
                "position": "static"
              },
              "children": [
                {
                  "id": "button3",
                  "type": "button",
                  "cssProps": {
                    "margin": "0.5rem",
                    "padding": "0.5rem",
                    "color": "black",
                    "backgroundColor": "orange",
                    "width": "auto",
                    "height": "auto",
                    "display": "block",
                    "position": "static"
                  },
                  "children": "Button 3"
                },
                {
                  "id": "div4",
                  "type": "div",
                  "cssProps": {
                    "margin": "1rem",
                    "padding": "1rem",
                    "backgroundColor": "lightyellow",
                    "width": "auto",
                    "height": "auto",
                    "display": "block",
                    "position": "static"
                  },
                  "children": [
                    {
                      "id": "button4",
                      "type": "button",
                      "cssProps": {
                        "margin": "0.5rem",
                        "padding": "0.5rem",
                        "color": "black",
                        "backgroundColor": "yellow",
                        "width": "auto",
                        "height": "auto",
                        "display": "block",
                        "position": "static"
                      },
                      "children": "Button 4"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}


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
    idHovered: undefined,
    drag: null,
  },
  reducers: {
    startDrag: (state, { payload }) => {
      const { type, coords } = payload;
      state.drag = { type, coords };
    },
    moveDrag: (state, { payload }) => {
      const coords = payload;
      state.drag.coords = coords;
    },
    endDrag: (state, { payload }) => {
      // const  type = payload;
      // const parent = findObjectById(state.idHovered);
      // parent.children.push({
      //   type,
      //   id: makeId(),
      //   cssProps: {},
      //   children: type === "button" ? "div" : [],
      // })

      state.drag = null;
      
    },
    addElement: (state, { payload }) => {
      const { parentId, type, } = payload;
      const parent = findObjectById(state.root, parentId);
      parent.children.push({
        type,
        id: makeId(),
        cssProps:  {
          "margin": "0.5rem",
          "padding": "0.5rem",
          "backgroundColor": "lightyellow",
        },
        children: type === "button" ? "clickme!" : [],
      })
    },
    selectElement : (state, {payload} ) =>{
      const elementId = payload;
      state.idSelected = elementId
    },
    hoverElement : (state, {payload} ) =>{
      // const elementId = payload;
      // state.idHovered = elementId
    },
    modifySelectedElement: (state, {payload})=>{
      const cssProps = payload;
      const selectedElement = findObjectById(state.root, state.idSelected);
      selectedElement.cssProps = { ...selectedElement.cssProps, ...cssProps };
    },
    modifyButtonText: (state, {payload})=>{
      const newText = payload
      const selectedElement = findObjectById(state.root, state.idSelected);
      selectedElement.children = newText
    },

    
  },
})

export const { 
  addElement, selectElement, hoverElement, modifySelectedElement, modifyButtonText, 
  startDrag, moveDrag, endDrag
} = canvasElements.actions
export default canvasElements.reducer