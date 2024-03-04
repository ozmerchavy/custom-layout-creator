import { createSlice } from '@reduxjs/toolkit'
import { cloneDeep, unset } from 'lodash';
import React from 'react';

/** @returns {React.CSSProperties} */
function initialCssProps(type, id, parent) {
  const color = `hsl(${(+id + 3) * 70 % 360}, 18%, 60%)`


  const divsProps = {
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
    minHeight: 100,
    minWidth: 100
  };

  const buttonProps = {
    color: 'white',
  };

  return {
    ...(type == "div" ? divsProps : buttonProps),

    marginTop: 8,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 8,

    borderRadius: 3,
    backgroundColor: color,
  }
}

const initialRootElement = {
  id: 'root',
  type: 'div',
  cssProps: { ...initialCssProps('div', -1, null), backgroundColor: 'lch(93 1.54 220.22)', width: "unset", height:"unset" },
  children: [ ],
}

function updateHistory(state, affectedElementId, previousValue) {
  state.undoHistory.push({ affectedElementId, previousValue })
  state.redoHistory = []
}


const deleteElementById = (state, id) => {
  const parent = findParentByID(state.root, id);
  if (parent) {
    const clonedParent = cloneDeep(parent);
    updateHistory(state, clonedParent.id, clonedParent);
    const index = parent.children.findIndex(child => child.id === id);
    if (index !== -1) {
      parent.children.splice(index, 1);
    }
  }
};

function findParentByID(element, id) {
  if (typeof element.children === 'string') return null;
  for (const child of element.children || []) {
    if (child.id === id) return element;
    const found = findParentByID(child, id);
    if (found) return found;
  }
  return null;
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
    root: initialRootElement,
    undoHistory: [],
    redoHistory: [],
    idSelected: 'root',
    idHovered: undefined,
  },
  reducers: {
    addElement: (state, { payload }) => {
      const { parentId, type, } = payload;
      const parent = findObjectById(state.root, parentId);
      updateHistory(state, parent.id, cloneDeep(parent))
      const id = makeId();
      parent.children.push({
        type,
        id,
        cssProps: initialCssProps(type, id, parent),
        children: type === "button" ? "clickme!" : [],
      })
    },
    selectElement: (state, { payload }) => {
      const elementId = payload;
      state.idSelected = elementId
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

      const elementToRevert = findObjectById(state.root, affectedElementId);
      if (!elementToRevert) return;
      // Directly revert the element's state to its previous value
      state.redoHistory.push({
        "affectedElementId": affectedElementId,
        "nextValue": cloneDeep(elementToRevert)
      })
      Object.assign(elementToRevert, previousValue);

    },

    redo: (state) => {
      const lastRedo = state.redoHistory.pop();
      if (!lastRedo) return;
      const { affectedElementId, nextValue } = lastRedo;

      const elementToRestore = findObjectById(state.root, affectedElementId);
      if (!elementToRestore) return;

      state.undoHistory.push({
        "affectedElementId": affectedElementId,
        "previousValue": cloneDeep(elementToRestore)
      })
      Object.assign(elementToRestore, nextValue);
    },

    startNewHTML: (state, { payload }) => {
      const newRoot = payload
      const oldRoot = cloneDeep(state.root)
      state.undoHistory.push({
        "affectedElementId": "root",
        "previousValue": cloneDeep(oldRoot)
      })
      state.root = newRoot

    },

    deleteSelectedElement: (state) => {
      deleteElementById(state, state.idSelected)
    },
  },
})

export const {
  addElement, selectElement, hoverElement, modifySelectedElement, modifyButtonText,
  undo, redo, isThereUndo, isThereRedo, deleteSelectedElement,
  startNewHTML
} = canvasElements.actions
export default canvasElements.reducer