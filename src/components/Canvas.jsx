import layout from "../layout.module.css";
import { useSelector } from "react-redux";
import style from "./Canvas.module.css";
import { selectElement } from "../slices/canvasElements";
import React from "react";
import { Button } from "antd";
import { useDrop } from 'react-dnd';
import { store } from "../store.js";
import { addElement } from "../slices/canvasElements";

function elementClicked(elementID) {
  store.dispatch(selectElement(elementID));
}

function renderElement(node, idSelected, idHovered) {
  if (typeof node === "string") {
    return node;
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => ({ [prop]: value }))
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});

  const children = Array.isArray(node.children)
    ? node.children.map((child) =>
        renderElement(child, idSelected, idHovered)
      )
    : <span key={node.id}>{node.children}</span>;

  const props = { style: cssProps };
  if (node.id == idSelected) {
    if (node.id != "root") {
      props.className = style.selectedElement;
    }
  }
  if (node.id == idHovered) {
    props.className = style.elementShine;
  }

  props.onClick = (event) => {
    event.stopPropagation();
    elementClicked(node.id);
  };

  if (node.type == 'button') return <Button key={node.id} {...props}>{children}</Button>

  if (node.type == 'div') return <NestedDropZone key={node.id} props={props} id={node.id}>{children}</NestedDropZone>
}

export default function Canvas() {
  const { root, idSelected, idHovered } = useSelector(
    (state) => state.canvasElements
  );
  return (
    <article className={`${layout.Canvas} ${style.Canvas}`}>
      {renderElement(root, idSelected, idHovered)}
    </article>
  );
}


////

function NestedDropZone({ children, props, id }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'box',
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;// prevent nested drop zones from receiving the drop event
      }
      store.dispatch(addElement({ parentId: id, type: item.type }));
    
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }),
    }),
  }));

  return (
    <div
      ref={drop}
      {...props}
    >
      <div style={{ opacity: isOver ? 0.5 : 1, display: 'contents' }}>
        {children}
      </div>
    </div>
  );
}