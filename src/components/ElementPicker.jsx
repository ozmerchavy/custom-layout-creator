import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";
import { IonIcon } from "@ionic/react";
import * as ion from 'ionicons/icons'


function ItemOption({ type }) {
  return (
    <span className={styles.ElementButton}>
      <IonIcon icon={ion.addSharp} />
      {/* todo icon depends on type */}
    </span>
  );
}

function ElementButton({ type }) {
  return (
    <div>
      <ItemOption type={type} />
      <span>{type}</span>
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
