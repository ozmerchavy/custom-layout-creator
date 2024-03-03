import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { endDrag, moveDrag, startDrag } from "../slices/canvasElements";
import { store } from "../store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function useDrag() {
  const drag = useSelector((store) => store.canvasElements.drag);

  useEffect(() => {
    if (!drag) return;

    const onMouseMove = (event) => {
      const coords = [event.pageX, event.pageY];
      store.dispatch(moveDrag(coords));
    };

    const onMouseUp = () => {
      store.dispatch(endDrag());
    };

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, [drag])

  return drag;
}


export function DragThingy() {
  const drag = useDrag();

  if (!drag) return;

  const [x, y] = drag.coords;

  return <div style={{
    width: '50px',
    height: '50px',
    borderRadius: '50px',
    backgroundColor: 'magenta',
    position: 'absolute',
    left: `${x - 25}px`,
    top: `${y - 25}px`,
  }}>{drag.type}</div>
}

function ElementButton({ text, icon, type }) {
  const onMouseDown = (event) => {
    const coords = [event.pageX, event.pageY]
    store.dispatch(startDrag({ type, coords }))
  };

  return (
    <span className={styles.ElementButton} onMouseDown={onMouseDown}>
      <img src={icon} alt="" />
      <span>{text}</span>
    </span>
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
