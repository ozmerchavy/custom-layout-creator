import React, { useState } from 'react';
import layout from "../layout.module.css";
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { store } from "../store.js";
import { startNewHTML } from "../slices/canvasElements";


function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  function parseNode(element) {
    if (element.nodeType === Node.TEXT_NODE) {
      return element.textContent.trim();
    }
    
    if (element.tagName.toLowerCase() === 'div' || element.tagName.toLowerCase() === 'button') {
      const cssProps = {};
      const styleAttr = element.getAttribute('style');
      if (styleAttr) {
        styleAttr.split(';').forEach(prop => {
          const [key, value] = prop.split(':').map(part => part.trim());
          cssProps[key] = value;
        });
      }
      
      const children = Array.from(element.childNodes).map(parseNode);

      return {
        type: element.tagName.toLowerCase(),
        id: element.getAttribute('id'),
        cssProps,
        children: children.filter(child => child !== ''),
      };
    } else if (element.tagName.toLowerCase() === 'body') {
      const children = Array.from(element.childNodes).map(parseNode);
      return children.filter(child => child !== '');
    } else {
      return '';
    }
  }
  
  return parseNode(doc.body);
}


export default function ImportHTML() {
  const [fileList, setFileList] = useState([]);
  const [parseError, setParseError] = useState(false); 
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const html = event.target.result;
      try {
        const parsedHTML = parseHTML(html); 
        if (typeof parsedHTML === "object") {
          setParseError(false);
          store.dispatch(startNewHTML(parsedHTML))
        

        } else {
          console.error('Error parsing HTML:', parsedHTML);
          setParseError(true); 
        }
      } catch (error) {
        console.error('Error parsing HTML:', error);
        setParseError(true); 
      }
    };
    reader.readAsText(file);
    return false; 
  };
  

  const props = {
    beforeUpload: handleUpload,
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
  };

  return (
    <div className={layout.Import}>
      <Upload {...props} showUploadList={false}>
        <Button type='text' icon={<UploadOutlined />}>Import</Button>
      </Upload>
      {parseError && <div style={{ color: 'red' }}>Error parsing HTML. Please try again.</div>}
    </div>
  );
}
