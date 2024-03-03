import { createSlice } from '@reduxjs/toolkit'
import {cloneDeep} from 'lodash';



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
    "backgroundColor": "#edf5ff"
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
            }

          ]
        }
      ]
    }
  ]
}



function updateHistory(state, affectedElementId, previousValue ){
    // if an element was added, previous value should be undefined.
  state.undoHistory.push({ affectedElementId, previousValue })
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
    undoHistory: [],
    idSelected: 'root',
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
      state.drag = null;

    },
    addElement: (state, { payload }) => {
      const { parentId, type, } = payload;
      const parent = findObjectById(state.root, parentId);
      const newID = makeId()
      parent.children.push({
        type,
        id: newID,
        cssProps: {
          "margin": "0.5rem",
          "padding": "0.5rem",
          "backgroundColor": "lightyellow",
        },
        children: type === "button" ? "clickme!" : [],
      })
      updateHistory(state, newID, undefined)
    },
    selectElement: (state, { payload }) => {
      const elementId = payload;
      state.idSelected = elementId
    },
    hoverElement: (state, { payload }) => {
      // const elementId = payload;
      // state.idHovered = elementId
    },
    modifySelectedElement: (state, { payload }) => {
      const cssProps = payload;
      const selectedElement = findObjectById(state.root, state.idSelected);
    
      updateHistory(state, state.idSelected, cloneDeep(selectedElement))
      selectedElement.cssProps = { ...selectedElement.cssProps, ...cssProps };
    },
    modifyButtonText: (state, { payload }) => {
      const newText = payload
      const selectedElement = findObjectById(state.root, state.idSelected);
      updateHistory(state, state.idSelected, cloneDeep(selectedElement))
      selectedElement.children = newText
    },
    undo: (state) => {
      const lastChange = state.undoHistory.pop();
      if (!lastChange) return;
      const { affectedElementId, previousValue } = lastChange;
      if (!previousValue){
        //element was created... 
        return console.log("gonna delete element!", affectedElementId)
      }
      const elementToRevert = findObjectById(state.root, affectedElementId);
      if (!elementToRevert) return;
      // Directly revert the element's state to its previous value
      Object.assign(elementToRevert, previousValue);
    }

  },
})

export const {
  addElement, selectElement, hoverElement, modifySelectedElement, modifyButtonText,
  startDrag, moveDrag, endDrag, undo
} = canvasElements.actions
export default canvasElements.reducer