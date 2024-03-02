import layout from "../layout.module.css";
import styles from "./ElementPicker.module.css";

function ElementButton({ text, icon, action }) {
  return (
    <span className={styles.ElementButton} onClick={action}>
      <img src={icon} alt="" />
      <span>{text}</span>
    </span>
  );
}

export default function ElementPicker() {
  return (
    <article className={`${layout.ElementPicker} ${styles.ElementPicker}`}>
      <ElementButton text="Button" icon="button.png" />
      <ElementButton text="Container" icon="container.png" />
      
    </article>
  );
}
