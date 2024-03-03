import ElementPicker from "./ElementPicker";
import Canvas from "./Canvas";
import PropsPicker from "./PropsPicker";
import layout from "../layout.module.css";
import ExportButton from "./ExportButton";
import ImportHTML from "./ImportHTML";

function Header({ children }) {
  return <div className={layout.Header}>{children}</div>;
}

export default function App() {
  return (
    <div className={layout.App}>
      <Header>
        <p>Undo/Redo</p>
        <ElementPicker />
        <div style={{ display: "flex", gap: '0.5rem' }}>
          <ImportHTML />
          <ExportButton />
        </div>
      </Header>
      <Canvas />
      <PropsPicker />
    </div>
  );
}
