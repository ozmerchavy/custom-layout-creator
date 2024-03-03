import layout from "../layout.module.css";
import { useSelector } from "react-redux";
import style from "./Canvas.module.css";
import { selectElement, hoverElement } from "../slices/canvasElements";
import React, { useEffect, useState } from "react";
import { store } from "../store.js";
import { Button } from "antd";

const canvasElementsDesign = {
  div: "div",
  button: Button
}


function elementClicked(elementID) {
  store.dispatch(selectElement(elementID));
}

function elementHovered(elementID) {
  store.dispatch(hoverElement(elementID));
}

function renderElement(node, idSelected, idHovered, isDrag) {
  if (typeof node === "string") {
    return node;
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => ({ [prop]: value }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const children = Array.isArray(node.children)
    ? node.children.map((child) =>
        renderElement(child, idSelected, idHovered, isDrag)
      )
    : node.children;

  const props = { style: cssProps };
  if (node.id == idSelected) {
    props.className = style.selectedElement;
  }
  if (node.id == idHovered) {
    props.className = style.elementShine;
  }

  props.onClick = (event) => {
    event.stopPropagation();
    elementClicked(node.id);
  };
  props.onMouseMove = (event) => {
    event.stopPropagation();
    if (node.id != "root" && isDrag) {
      elementHovered(node.id);
    }
  };
  
  return React.createElement(canvasElementsDesign[node.type], props, ...children);
}

export default function Canvas() {
  const { root, idSelected, idHovered, drag } = useSelector(
    (state) => state.canvasElements
  );
  return (
    <article className={`${layout.Canvas} ${style.Canvas}`}>
      <div>{renderElement(root, idSelected, idHovered, drag)}</div>
    </article>
  );
}
