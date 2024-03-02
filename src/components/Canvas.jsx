import layout from "../layout.module.css";
import { useSelector } from "react-redux";
import style from "./Canvas.module.css";
import React from 'react';


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

function renderElement(node) {
  if (typeof node === 'string') {
    return node;
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => ({ [prop]: value }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const children = Array.isArray(node.children) ? node.children.map(child => renderElement(child)) : node.children;

  return React.createElement(node.type, { style: cssProps }, ...children)
}


export default function Canvas() {
  const root = useSelector((state) => state.canvasElements.root);

  return (
    <article className={layout.canvas}>
      <div>{renderElement(root)}</div>
    </article>
  );
}
