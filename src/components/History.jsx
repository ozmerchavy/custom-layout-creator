import React from 'react';
import layout from "../layout.module.css";
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { store } from "../store.js";
import { undo, redo } from "../slices/canvasElements";


export default function History() {
  const handleUndo = () => {
    store.dispatch(undo())
  };

  const handleRedo = () => {
    store.dispatch(redo())
  };

  return (
    <div className={layout.History}>
      <Button type='text' icon={<UndoOutlined />} onClick={handleUndo}>
        Undo
      </Button>
      <Button type='text' icon={<RedoOutlined />} onClick={handleRedo}>
        Redo
      </Button>
    </div>
  );
}