import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { endDrag, moveDrag, startDrag } from "../slices/canvasElements";
import { store } from "../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const icons = {
  div: "container.png",
  button: "button.png",
};

function initDrag(event, type) {
  const coords = [event.pageX, event.pageY];
  store.dispatch(startDrag({ type, coords }));

  const onMouseMove = (event) => {
    const coords = [event.pageX, event.pageY];
    store.dispatch(moveDrag(coords));
  };

  const quitDrags = () => {
    store.dispatch(endDrag());
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", quitDrags);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", quitDrags);
}

function ItemOption({ type }) {
  return (
    <span draggable="false" className={styles.ElementButton}>
      <img draggable="false" src={icons[type]} alt="" />
    </span>
  );
}

export function DragThingy() {
  const drag = useSelector((store) => store.canvasElements.drag);

  if (!drag) return;  

  const [x, y] = drag.coords;

  return (
    <div
      draggable="false"
      style={{
        position: "absolute",
        left: `${x - 25}px`,
        top: `${y - 25}px`,
      }}
    >
      <ItemOption type={drag.type} />
    </div>
  );
}

function ElementButton({ type }) {
  return (
    <div onMouseDown={(event) => initDrag(event, type)}>
      <ItemOption type={type} />
      <span draggable="false">{type}</span>
    </div>
  );
}

export default function ElementPicker() {
  return (
    <article className={`${layout.ElementPicker} ${styles.ElementPicker}`}>
      <ElementButton text="Button" icon="button.png" type="button" />
      <ElementButton text="Container" icon="container.png" type="div" />
    </article>
  );
}
