import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { endDrag, startDrag, selectElement } from "../slices/canvasElements";
import { store } from "../store";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { IonIcon } from "@ionic/react";
import * as ion from 'ionicons/icons'

function initDrag(event, type, setPos) {
  const coords = [event.pageX, event.pageY];
  store.dispatch(startDrag({ type, coords }));
  store.dispatch(selectElement(null))

  const onMouseMove = (event) => {
    setPos(event.pageX, event.pageY);
  };

  const quitDrags = () => {

    store.dispatch(endDrag());
    document.removeEventListener("mousedown", onMouseMove);
    document.removeEventListener("click", quitDrags);
    // console.log("last hovered:", idHovered)
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", quitDrags);
}

function ItemOption({ icon }) {
  return (
    <span draggable="false" className={styles.ElementButton}>
      <IonIcon icon={ion.addSharp} />
      {/* todo icon depends on type */}
    </span>
  );
}

function ElementButton({ type, setPos }) {
  return (
    <div onMouseDown={(event) => initDrag(event, type, setPos)}>
      <ItemOption type={type} />
      <span draggable="false">{type}</span>
    </div>
  );
}

export default function ElementPicker() {
  const drag = useSelector((store) => store.canvasElements.drag);
  const ref = useRef(null);

  const setPos = (x, y) => {
    return 1
      ref.current.style.left = x - 10 + 'px'
      ref.current.style.top = y - 10 + 'px'
  }

  return (
    <article className={`${layout.ElementPicker} ${styles.ElementPicker}`}>
      <ElementButton text="Button" icon="button.png" type="button" setPos={setPos} />
      <ElementButton text="Container" icon="container.png" type="div" setPos={setPos} />
      
      { drag && <div
        draggable="false"
        ref={ref}
        style={{
          position: "absolute",
          zIndex: 9,
        }}
      >
        <ItemOption type={drag.type} />
      </div>}
    </article>
  );
}
