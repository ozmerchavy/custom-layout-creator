import ElementPicker from "./ElementPicker";
import Canvas from "./Canvas";
import PropsPicker from "./PropsPicker";
import style from "./App.module.css"
import layout from "../layout.module.css";
import ReviewButton from "./ReviewButton";

export default function App() {

  return (
      <div className={layout.App}>
        <ElementPicker/>
        <Canvas/>
        <PropsPicker/>
        <ReviewButton/>
      </div>
  );
}
