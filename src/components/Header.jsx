import layout from "../layout.module.css"
import styles from "./Header.module.css"

export default function Header({ children }) {
  return (
    <div className={`${layout.Header} ${styles.Header}`}>
      {children}
    </div>
  );
}