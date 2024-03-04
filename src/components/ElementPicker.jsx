import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { IonIcon } from "@ionic/react";
import * as ion from "ionicons/icons";
import { useDrag } from "react-dnd";
import { useDragLayer } from "react-dnd";
import { DragOutlined } from "@ant-design/icons";

function ItemOption({ type }) {
  return <span>{type === "button" ? <DragOutlined /> : <DragOutlined />}</span>;
}

export default function ElementPicker() {
  return (
    <article className={`${layout.ElementPicker} ${styles.ElementPicker}`}>
      <ElementButton type="button" />
      <ElementButton type="div" />
    </article>
  );
}

///

function ElementButton({ type }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "box",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }} className={styles.ElementButton}>
      <ItemOption type={type} />
      <span>{type}</span>
    </div>
  );
}
