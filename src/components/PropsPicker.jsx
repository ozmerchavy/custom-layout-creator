import { useRef, useState } from "react";
import layout from "../layout.module.css";
import styles from "./PropsPicker.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  addElement,
  findObjectById,
  modifySelectedElement,
  modifyButtonText,
  deleteSelectedElement,
} from "../slices/canvasElements";
import { Layout, Collapse, Input, Form, InputNumber, Select, ColorPicker, Button, Flex, Divider } from "antd";

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

  const Label = ({ text, style }) => {
    return <label style={{ color: "#aaa", fontSize: "0.8rem", ...style }}>{text}</label>;
  };

  return (
    <article className={layout.PropsPicker}>
      <Form action="none" labelAlign="left">
        <Collapse ghost>
          <Collapse.Panel header="CSS Properties" key="1">
            <Form.Item label={<Label text="Position" style={{ minWidth: "10ch" }} />} colon={false}>
              <Select variant="borderless" value={cssProps.position} onChange={(value) => onChange("position", value)}>
                <Select.Option value="absolute">Absolute</Select.Option>
                <Select.Option value="relative">Relative</Select.Option>
                <Select.Option value="fixed">Fixed</Select.Option>
                <Select.Option value="static">Static</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label={<Label text="Display" style={{ minWidth: "10ch" }} />} colon={false}>
              <Select variant="borderless" value={cssProps.display} onChange={(value) => onChange("display", value)}>
                <Select.Option value="block">Block</Select.Option>
                <Select.Option value="inline">Inline</Select.Option>
                <Select.Option value="inline-block">Inline Block</Select.Option>
                <Select.Option value="flex">Flex</Select.Option>
              </Select>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>

        <Divider />
        <Collapse ghost>
          <Collapse.Panel header="Dimensions" key="1">
            <Flex gap={10}>
              <Form.Item label={<Label text="W" />} colon={false}>
                <InputNumber
                  value={cssProps.width}
                  onChange={(newValue) => onChange("width", newValue)}
                  className={styles.InputNumber}
                  variant="borderless"
                />
              </Form.Item>

              <Form.Item label={<Label text="H" />} colon={false}>
                <InputNumber
                  value={cssProps.height}
                  onChange={(newValue) => onChange("height", newValue)}
                  variant="borderless"
                />
              </Form.Item>
            </Flex>
          </Collapse.Panel>
        </Collapse>

        <Divider />
        <Collapse ghost>
          <Collapse.Panel header="Padding" key="2">
            <Form.Item>
              <div style={{ marginLeft: "6em" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <InputNumber
                    placeholder="top"
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
                    <Label text="Padding" style={{ position: "absolute", left: 0, paddingBlock: 4 }} />
                    <InputNumber
                      placeholder="left"
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
                    placeholder="bottom"
                    value={cssProps.paddingBottom}
                    onChange={(newValue) => onChange("paddingBottom", newValue)}
                    style={{ marginTop: "2px", width: "8ch" }}
                  />
                </div>
              </div>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>

        <Divider />

        <Collapse ghost>
          <Collapse.Panel header="Margin" key="3">
            <Form.Item>
              <div style={{ marginLeft: "6em" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <InputNumber
                    placeholder="top"
                    value={cssProps.marginTop}
                    onChange={(newValue) => onChange("marginTop", newValue)}
                    style={{ marginBottom: "2px", width: "8ch" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "1.5px",
                    }}
                  >
                    <Label text="Margin" style={{ position: "absolute", left: 0, paddingBlock: 4 }} />
                    <InputNumber
                      placeholder="left"
                      style={{ width: "8ch" }}
                      value={cssProps.marginLeft}
                      onChange={(newValue) => onChange("marginLeft", newValue)}
                    />

                    <InputNumber
                      placeholder="px"
                      style={{ width: "8ch" }}
                      value={cssProps.marginRight}
                      onChange={(newValue) => onChange("marginRight", newValue)}
                    />
                  </div>
                  <InputNumber
                    placeholder="bottom"
                    value={cssProps.marginBottom}
                    onChange={(newValue) => onChange("marginBottom", newValue)}
                    style={{ marginTop: "2px", width: "8ch" }}
                  />
                </div>
              </div>
            </Form.Item>
          </Collapse.Panel>
        </Collapse>

        <Divider />
        {selectedElement.type == "button" && (
          <Form.Item label={<Label text="Button Text" style={{ minWidth: "10ch" }} />} colon={false}>
            <Input type="text" value={selectedElement.children} onChange={(event) => modifyText(event.target.value)} />
          </Form.Item>
        )}

        <Form.Item label={<Label text="Color" style={{ minWidth: "10ch" }} />} colon={false}>
          <ColorPicker
            value={cssProps.backgroundColor}
            showText
            onChange={(color) => onChange("backgroundColor", color.toHexString())}
            placement="topLeft"
          />
        </Form.Item>

  
        {selectedElement.type == "button" && (
          <Form.Item label={<Label text="Text Color" style={{ minWidth: "10ch" }} />} colon={false}>
            <ColorPicker value={cssProps.color} showText onChange={(color) => onChange("color", color.toHexString())} />
          </Form.Item>
        )}

        {selectedElement.type == "div" && (
          <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
            <Flex gap="small" wrap="wrap">
              <Button
                size="medium"
                onClick={() => {
                  dispatch(addElement({ parentId: idSelected, type: "div" }));
                }}
              >
                Add a Div
              </Button>
              <Button
                size="medium"
                onClick={() => {
                  dispatch(addElement({ parentId: idSelected, type: "button" }));
                }}
              >
                Add a Button
              </Button>
            </Flex>
          </Form.Item>
        )}

        <Divider />
        <Form.Item style={{display: 'flex', justifyContent: 'center'}}>
          <Button
            danger
            onClick={() => {
              dispatch(deleteSelectedElement());
            }}
          >
            Delete Element
          </Button>
        </Form.Item>
      </Form>
    </article>
  );
}
