import layout from "../layout.module.css";
import { useSelector } from "react-redux";
import style from "./Canvas.module.css";
import {selectElement} from "../slices/canvasElements"
import React, { useEffect, useState } from 'react';
import { store} from "../store.js";

function printbleDebugTree(node, depth = 0) {
  const indent = "  ".repeat(depth);

  if (typeof node === 'string') {
    return `${indent}"${node}"\n`
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join(", ");

  let result = `${indent}${node.type}#${node.id} { ${cssProps} }\n`;

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result += printbleDebugTree(child, depth + 1);
    }
  } else result += printbleDebugTree(node.children, depth + 1);

  return result;
}


function printJSON(node, depth=0){
  return <div>{JSON.stringify(node,null,2)}</div>
}

function elementClicked(elementID){
  store.dispatch(selectElement(elementID));
}

function renderElement(node, idSelected) {
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
  const { root, idSelected } = useSelector((state) => state.canvasElements);

  return (
    <article className={layout.canvas}>
      <div>{renderElement(root, idSelected)}</div>
    </article>
  );
}
