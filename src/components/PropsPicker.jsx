import { useRef, useState } from "react";
import layout from "../layout.module.css";
import styles from "./PropsPicker.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addElement,
  findObjectById,
  modifySelectedElement,
  modifyButtonText,
} from "../slices/canvasElements";
import { Row, Col, Input, Form, InputNumber, Select, ColorPicker, Button, Flex } from "antd";

const SelectUnit = (
  <Select
    defaultValue="px"
    style={{
      width: 60,
    }}
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
    if (node.type !== "div") return;
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

  const { root, idSelected } = useSelector((store) => store.canvasElements);
  const selectedElement = findObjectById(root, idSelected);
  const dispatch = useDispatch();

  if (!selectedElement) {
    return <article className={layout.PropsPicker}>select something...</article>;
  }

  const cssProps = selectedElement.cssProps;

  const onChange = (prop, newValue) => {
    dispatch(modifySelectedElement({ [prop]: newValue }));
  };
  const modifyText = (newText) => {
    dispatch(modifyButtonText(newText));
  };

  return (
    <article className={layout.PropsPicker}>
      <Form action="none">
        <p>selected element's id {idSelected}</p>
        <Form.Item label="Width">
          <InputNumber
            addonAfter={SelectUnit}
            value={cssProps.width}
            onChange={(newValue) => onChange("width", newValue)}
          />
        </Form.Item>

        <Form.Item label="Height">
          <InputNumber
            addonAfter={SelectUnit}
            value={cssProps.height}
            onChange={(newValue) => onChange("height", newValue)}
          />
        </Form.Item>

        <Form.Item label="Background Color">
          <ColorPicker
            value={cssProps.backgroundColor}
            showText
            onChange={(color) => onChange("backgroundColor", color.toHexString())}
            placement="topLeft"
          />
        </Form.Item>

        {selectedElement.type == "button" && (
          <Form.Item label="Button Text">
            <Input
              type="text"
              disabled={selectedElement.type !== "button"}
              value={
                selectedElement.type == "button" ? selectedElement.children : "only for buttons"
              }
              onChange={(event) => modifyText(event.target.value)}
            />
          </Form.Item>
        )}
        {selectedElement.type == "button" && (
          <Form.Item label="Text Color">
            <ColorPicker
              value={cssProps.color}
              showText
              disabled={selectedElement.type !== "button"}
              onChange={(color) => onChange("color", color.toHexString())}
            />
          </Form.Item>
        )}

        <Form.Item label="Padding">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <InputNumber
              placeholder="px"
              value={cssProps.paddingTop}
              onChange={(newValue) => onChange("paddingTop", newValue)}
              style={{ marginBottom: "2px", width: "8ch" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1.5px",
              }}
            >
              <InputNumber
                placeholder="px"
                style={{ width: "8ch" }}
                value={cssProps.paddingLeft}
                onChange={(newValue) => onChange("paddingLeft", newValue)}
              />

              <InputNumber
                placeholder="px"
                style={{ width: "8ch" }}
                value={cssProps.paddingRight}
                onChange={(newValue) => onChange("paddingRight", newValue)}
              />
            </div>
            <InputNumber
              placeholder="px"
              value={cssProps.paddingBottom}
              onChange={(newValue) => onChange("paddingBottom", newValue)}
              style={{ marginTop: "2px", width: "8ch" }}
            />
          </div>
        </Form.Item>

        <Form.Item label="Margin">
          <InputNumber
            addonAfter={SelectUnit}
            value={cssProps.margin}
            onChange={(newValue) => onChange("margin", newValue)}
          />
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

        {selectedElement.type == "div" && (
          <Flex gap="small" wrap="wrap">
            <Button
              type="primary"
              size="medium"
              onClick={() => {
                dispatch(addElement({ parentId: idSelected, type: "div" }));
              }}
            >
              Add a Div
            </Button>
            <Button
              type="primary"
              size="medium"
              onClick={() => {
                dispatch(addElement({ parentId: idSelected, type: "button" }));
              }}
            >
              Add a Button
            </Button>
          </Flex>
        )}
      </Form>
    </article>
  );
}
