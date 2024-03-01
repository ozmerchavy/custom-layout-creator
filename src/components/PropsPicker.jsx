import { useState } from "react";
import layout from "../layout.module.css";
import styles from "./PropsPicker.module.css";
import { useSelector, useDispatch } from 'react-redux'
import { addElement } from "../slices/canvasElements";

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
  const root = useSelector((state) => state.canvasElements);
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
