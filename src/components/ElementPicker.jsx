import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { IonIcon } from "@ionic/react";
import * as ion from 'ionicons/icons'
import { useDrag } from "react-dnd";
import { useDragLayer } from 'react-dnd';

function ItemOption({ type }) {
  return (
    <span className={styles.ElementButton}>

      {type == "button" ?<IonIcon icon={ion.squareOutline} /> : <IonIcon icon={ion.addCircleOutline} /> }
      
    </span>
  );
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
    type: 'box',
    item: { type },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const { currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    initialOffset: monitor.getInitialClientOffset(),
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (isDragging) {
    console.log('dragging at', currentOffset);
  }

  return (
    <div ref={drag} style={{opacity: isDragging ? 0.5 : 1}}>
      <ItemOption type={type} />
      <span>{type}</span>
    </div>
  );
}