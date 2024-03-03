import ElementPicker from "./ElementPicker";
import Canvas from "./Canvas";
import PropsPicker from "./PropsPicker";
import style from "./App.module.css"
import layout from "../layout.module.css";
import ReviewButton from "./ReviewButton";
import ImportHTML from "./ImportHTML";
import History from "./History";
export default function App() {

  return (
      <div className={layout.App}>
        <ElementPicker/>
        <ImportHTML/>
        <Canvas/>
        <PropsPicker/>
        <ReviewButton/>
      </div>
  );
}
