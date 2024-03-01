import layout from "../layout.module.css";
import { useSelector } from "react-redux";

function printbleDebugTree(node, depth = 0) {
  const indent = "  ".repeat(depth);

  if (typeof node === 'string') {
    return `${indent}"${node}"\n`
  }

  const cssProps = Object.entries(node.cssProps)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join(", ");

  let result = `${indent}${node.type}#${node.id} { ${cssProps} }\n`;

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      result += printbleDebugTree(child, depth + 1);
    }
  } else result += printbleDebugTree(node.children, depth + 1);

  return result;
}

export default function Canvas() {
  const root = useSelector((state) => state.canvasElements);

  return (
    <article className={layout.canvas}>
      <pre>
        <code>{printbleDebugTree(root)}</code>
      </pre>
    </article>
  );
}
