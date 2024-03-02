import { useRef, useState } from "react";
import layout from "../layout.module.css";
import styles from "./PropsPicker.module.css";
import { useSelector, useDispatch } from 'react-redux'
import { addElement, findObjectById, modifySelectedElement, modifyButtonText } from "../slices/canvasElements";
import { Input, Form, InputNumber, Select, Space } from 'antd';



const selectUnit = (
  <Select
    defaultValue="px"
    style={{
      width: 60,
    }}
    // onChange={(value) => setUnit(value || "px")} 
  >
    <Option value="px">px</Option>
    <Option value="%">%</Option>
    <Option value="rem">rem</Option>
    <Option value="em">em</Option>
  </Select>
);




function findAllDivsIds(node) {
  const ids = [];
  const traverse = (node) => {
    if (node.type !== 'div') return;
    ids.push(node.id);
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  };
  traverse(node);
  return ids;
}



export default function PropsPicker() {

  // const [unit, setUnit] = useState("px"); // State to store the selected unit

  const { root, idSelected } = useSelector((store) => store.canvasElements)
  const selectedElement = findObjectById(root, idSelected)
  const dispatch = useDispatch()

  if (!selectedElement) {
    return <article>select element...</article>
  }

  const cssProps = selectedElement.cssProps

  const onChange = (prop, newValue) => {
    console.log("changing", prop, "to be", newValue)
    dispatch(modifySelectedElement({[prop]: newValue}))

 
  }
  const modifyText = (newText) => {
    dispatch (modifyButtonText(newText))
  }
  



return <article>
<Form action="none">
  <p>selected element's id {idSelected}</p>
  <Form.Item label="Width">
    <InputNumber addonAfter={selectUnit} value={cssProps.width} onChange={(newValue) => onChange("width", newValue)} />
  </Form.Item>

  <Form.Item label="Height">
    <InputNumber addonAfter={selectUnit} value={cssProps.height} onChange={(newValue) => onChange("height", newValue)} />
  </Form.Item>
 
 {(selectedElement.type == "button") &&<Form.Item label="Button Text"><Input type="text" disabled={selectedElement.type !== "button"} value={selectedElement.type == "button" ? selectedElement.children : "only for buttons"} onChange={(event) => modifyText(event.target.value)} /></Form.Item> }
 {(selectedElement.type == "button") && (<Form.Item label="Text Color"><Input type="text" disabled={selectedElement.type !== "button"} value={selectedElement.type == "button" ? cssProps.color : "only for buttons"} onChange={(event) => onChange("color", event.target.value)} /></Form.Item>)}   
  
  <Form.Item label="Padding">
    <InputNumber addonAfter={selectUnit} value={cssProps.padding} onChange={(newValue) => onChange("padding", newValue)} />
  </Form.Item>

  <Form.Item label="Margin">
    <InputNumber addonAfter={selectUnit} value={cssProps.margin} onChange={(newValue) => onChange("margin", newValue)} />
  </Form.Item>

  <Form.Item label="Position">
  <Select value={cssProps.position} onChange={(value) => onChange("position", value)}>
    <Select.Option value="absolute">Absolute</Select.Option>
    <Select.Option value="relative">Relative</Select.Option>
    <Select.Option value="fixed">Fixed</Select.Option>
    <Select.Option value="static">Static</Select.Option>
  </Select>
</Form.Item>

<Form.Item label="Display">
  <Select value={cssProps.display} onChange={(value) => onChange("display", value)}>
    <Select.Option value="block">Block</Select.Option>
    <Select.Option value="inline">Inline</Select.Option>
    <Select.Option value="inline-block">Inline Block</Select.Option>
    <Select.Option value="flex">Flex</Select.Option>
  </Select>
</Form.Item>

</Form>
</article>

}





function ToDelete() {
  const root = useSelector((state) => state.canvasElements.root);
  const dispatch = useDispatch();

  const allIds = findAllDivsIds(root);

  const [type, setType] = useState("div");
  const [parentId, setParentId] = useState("root");
  
  // relevant if type is "button"
  const [text, setText] = useState("Click Me!"); 

  const onSubmit = (event) => {
    event.preventDefault();
    // if it's not a button it's a div hence children is []
    const children = (type === 'button' ? text.trim() : []);
    dispatch(addElement({ type, parentId, children }));
  };

  return (
    <article className={`${layout.PropsPicker} ${styles.PropsPicker}`}>
      <p>Create New Element</p>
      <hr />

      <form onSubmit={onSubmit}>
        <fieldset>
          <label>
            Type
            <select
              value={type}
              onChange={({ target }) => setType(target.value)}
            >
              <option value="div">div</option>
              <option value="button">button</option>
            </select>
          </label>

          <label>
            Parent
            <select
              value={parentId}
              onChange={({ target }) => setParentId(target.value)}
            >
              {allIds.map((id) => (
                <option value={id} key={id}>
                  #{id}
                </option>
              ))}
            </select>
          </label>

          {type === "button" && (
            <label>
              Text
              <input
                type="text"
                value={text}
                onChange={({ target }) => setText(target.value)}
              />
            </label>
          )}
        </fieldset>

        <input type="submit" value="Add New Element" />
      </form>
    </article>
  );
}
