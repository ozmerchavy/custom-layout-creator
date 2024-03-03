import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import layout from "../layout.module.css";
import findDifferences from '../functions/findDifferences.mjs';
import { updateRoot } from '../slices/canvasElements';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default function History() {
  const dispatch = useDispatch();
  const { root } = useSelector((state) => state.canvasElements);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const prevRootRef = useRef(root);

  useEffect(() => {
    const handleMouseUp = () => {
      if (prevRootRef.current !== root) {
        const differences = findDifferences(prevRootRef.current, root);
        const changeSummary = JSON.stringify(differences);
        setHistory([...history, { root: prevRootRef.current, changeSummary }].slice(-25));
        setRedoHistory([]);
        prevRootRef.current = root;
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [root, history]);

  const handleUndo = () => {
    if (history.length > 0) {
      const lastChange = history[history.length - 1];
      dispatch(updateRoot(lastChange.root));
      setHistory(history.slice(0, -1));
      setRedoHistory([lastChange, ...redoHistory]);
    }
  };

  const handleRedo = () => {
    if (redoHistory.length > 0) {
      const nextChange = redoHistory[0];
      dispatch(updateRoot(nextChange.root));
      setRedoHistory(redoHistory.slice(1));
      setHistory([...history, nextChange]);
    }
  };

  return (
    <div className={layout.History}>
      <Button icon={<UndoOutlined />} onClick={handleUndo} disabled={history.length === 0}>
        Undo
      </Button>
      <Button icon={<RedoOutlined />} onClick={handleRedo} disabled={redoHistory.length === 0}>
        Redo
      </Button>
      <p>Editing History:</p>
      <ul>
        {history.map((change, index) => (
          <li key={index + ':' + change.changeSummary}>{change.changeSummary}</li>
        ))}
      </ul>
    </div>
  );
}