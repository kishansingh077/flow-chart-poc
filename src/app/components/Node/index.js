import React, { useState } from "react";
import styles from "./index.module.css";

const Node = ({
  id,
  x,
  y,
  label,
  render,
  onStartEdge,
  onMouseOver,
  onMouseDown,
  onMouseUp
}) => {
  return (
    <div
      data-node-id={id}
      className={styles.node}
      style={{ left: `${x}px`, top: `${y}px`, position: "absolute" }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <div
        className={styles.edgeDot}
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartEdge();
        }}
        onMouseOver={(e) => {
          e.stopPropagation();
          onMouseOver();
        }}
      />
      {render ? render : <span>{label}</span>}
    </div>
  );
};
export default Node;
