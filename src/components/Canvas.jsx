import layout from "../layout.module.css";
import { useSelector } from "react-redux";
import style from "./Canvas.module.css";
import {selectElement} from "../slices/canvasElements"
import React, { useEffect, useState } from 'react';
import { store} from "../store.js";




function elementClicked(elementID){
  store.dispatch(selectElement(elementID));
}

function renderElement(node, idSelected, isDrag) {
  if (typeof node === 'string') {
    return node;
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => ({ [prop]: value }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const children = Array.isArray(node.children) ? node.children.map(child => renderElement(child, idSelected)) : node.children;

  const props = { style: cssProps };
  if (node.id == idSelected) {
    props.className = style.selectedElement;
  }
  props.onClick = (event) => {
    event.stopPropagation();
    elementClicked(node.id)
  }
  return React.createElement(node.type, props, ...children)
}


export default function Canvas() {
  const { root, idSelected, drag } = useSelector((state) => state.canvasElements);
   
  return (
    <article className={layout.Canvas}>
      <div>{renderElement(root, idSelected, drag)}</div>
    </article>
  );
}
