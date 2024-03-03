import React from "react";
import layout from "../layout.module.css";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { store } from "../store.js";
import { undo, redo } from "../slices/canvasElements";
import { useSelector } from "react-redux";

export default function History() {

  const redoHistory  = useSelector(store =>store.canvasElements.redoHistory)
  const undoHistory = useSelector(store =>store.canvasElements.undoHistory)

  const handleUndo = () => {
    store.dispatch(undo());
  };

  const handleRedo = () => {
    store.dispatch(redo());
  };

  return (
    <div className={layout.History}>
      <Button type="text" icon={<UndoOutlined />} onClick={handleUndo} disabled={undoHistory.length == 0}>
        Undo
      </Button>
      <Button type="text" icon={<RedoOutlined />} onClick={handleRedo} disabled={redoHistory.length == 0}>
        Redo
      </Button>
    </div>
  );
}
