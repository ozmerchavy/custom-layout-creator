import layout from "../layout.module.css";
import {selectElement} from "../slices/canvasElements"
import React, { useState } from 'react';
import {store} from "../store.js";
import { useSelector, useDispatch } from 'react-redux'
import { addElement, findObjectById, modifySelectedElement, modifyButtonText } from "../slices/canvasElements";
import { Button, Modal } from 'antd';
import { CopyBlock, CodeBlock } from 'react-code-blocks';




function generateHTML(node ,depth) {
  if (typeof node === 'string') {
    return node; // Return text content directly
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => {
      // Convert camelCase properties to kebab-case
      const kebabProp = prop.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      return `${kebabProp}: ${value};`;
    })
    .join(" ");

  let result = ``;
  if (depth == 0){
    result += `<!DOCTYPE html>\n<html>\n<head>\n<title>Generated HTML</title>\n</head>\n<body>\n`
  }

  result += `<${node.type} id="${node.id}" style="${cssProps}">\n`;

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result += generateHTML(child, depth+1);
    }
  } else {
    result += generateHTML(node.children, depth+1);
  }

  if (depth == 0 ){

    result += `</${node.type}>\n</body>\n</html>\n`;
  }
  
  return result;
}



export default function ReviewButton(){
  const { root } = useSelector((state) => state.canvasElements)
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Review and Export HTML
      </Button>
      <Modal
        open={open}
        title="HTML Code"
        onOk={handleOk}
        onCancel={handleCancel}

        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Export
          </Button>,
        ]}
      >
         <CodeBlock
      text={generateHTML(root, 0)}
      language={"html"}
      showLineNumbers= {false}
      wrapLines
    />

      </Modal>
    </>
  );
}


