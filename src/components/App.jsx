import ElementPicker from "./ElementPicker";
import Canvas from "./Canvas";
import PropsPicker from "./PropsPicker";
import layout from "../layout.module.css";
import ExportButton from "./ExportButton";
import ImportHTML from "./ImportHTML";
import History from "./History";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Header from "./Header";


export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={layout.App}>
        <Header>
          <History />
          <ElementPicker />
          <ExportButton />
        </Header>
        <Canvas />
        <PropsPicker />
      </div>
    </DndProvider>
  );
}
