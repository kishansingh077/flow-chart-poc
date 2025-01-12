"use client";

import React, { useState } from "react";
import Canvas from "./components/Canvas";
import Node from "./components/Node";
import Edge from "./components/Edge";

export const Comp = (index) => <span>ABC {index}</span>;

const App = () => {
  const [nodes, setNodes] = useState([
    { id: "1", x: 500, y: 150, label: "Node 1", render: null },
    { id: "2", x: 200, y: 250, label: "Node 2", render: null },
    { id: "3", x: 770, y: 300, label: "Node 3", render: null }
  ]);

  const [edges, setEdges] = useState([]);
  const [connectingEdge, setConnectingEdge] = useState(null);
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0
  });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [draggingNode, setDraggingNode] = useState(null);

  const handleZoom = (delta) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale + delta, 0.5), 2)
    }));
  };

  const handlePanStart = (e) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handlePanMove = (e) => {
    if (!isPanning) return;

    const dx = e.clientX - startPan.x;
    const dy = e.clientY - startPan.y;

    setTransform((prev) => ({
      ...prev,
      translateX: prev.translateX + dx,
      translateY: prev.translateY + dy
    }));

    setStartPan({ x: e.clientX, y: e.clientY });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  const handleStartEdge = (sourceId) => {
    setConnectingEdge({ source: sourceId, targetX: 0, targetY: 0 });
  };

  const handleMoveEdge = (x, y) => {
    if (connectingEdge) {
      setConnectingEdge((prev) => ({ ...prev, targetX: x, targetY: y }));
    }
  };

  const handleCompleteEdge = (targetId) => {
    if (connectingEdge && targetId && connectingEdge.source !== targetId) {
      setEdges((prevEdges) => [
        ...prevEdges,
        { source: connectingEdge.source, target: targetId }
      ]);
    }
    setConnectingEdge(null);
  };

  const handleMoveOverNode = (nodeId) => {
    if (connectingEdge && connectingEdge.source === nodeId) {
      return;
    }

    if (connectingEdge) {
      handleCompleteEdge(nodeId);
    }
  };

  const handleCancelEdge = () => {
    setConnectingEdge(null);
  };

  const handleNodeDragStart = (e, id, startX, startY) => {
    e.stopPropagation();
    setDraggingNode({ id, startX, startY });
  };

  const handleNodeDrag = (clientX, clientY) => {
    if (draggingNode) {
      const dx = clientX - draggingNode.startX;
      const dy = clientY - draggingNode.startY;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggingNode.id
            ? { ...node, x: node.x + dx, y: node.y + dy }
            : node
        )
      );

      setDraggingNode((prev) => ({
        ...prev,
        startX: clientX,
        startY: clientY
      }));
    }
  };

  const handleNodeDragEnd = (e) => {
    e.stopPropagation();
    setDraggingNode(null);
  };

  const handleAddNode = (comp = false) => {
    const newNodeId = (nodes.length + 1).toString();
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: newNodeId,
        x: 150,
        y: 150,
        label: `Node ${newNodeId}`,
        render: comp ? Comp(newNodeId) : null
      }
    ]);
  };

  const getNodeById = (id) => nodes.find((node) => node.id === id);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "#f0f0f0",
        cursor: isPanning ? "grabbing" : "grab"
      }}
      onMouseDown={handlePanStart}
      onMouseMove={(e) => {
        handlePanMove(e);
        if (draggingNode) {
          handleNodeDrag(e.clientX, e.clientY);
        }
      }}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onWheel={(e) => handleZoom(e.deltaY > 0 ? -0.1 : 0.1)}
    >
      <svg
        className="react-flow__background"
        data-testid="rf__background"
        // style="position: absolute; width: 100%; height: 100%; top: 0px; left: 0px;"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0
        }}
      >
        <pattern
          id="pattern-1"
          x="8"
          y="16"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          patternTransform="translate(-21,-21)"
        >
          <circle
            cx="1"
            cy="1"
            r="1"
            className="react-flow__background-pattern dots"
          ></circle>
        </pattern>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#pattern-1)"
        ></rect>
      </svg>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}>
        <button
          onClick={() => handleZoom(0.1)}
          style={{
            margin: 5,
            padding: "6px 10px",
            fontSize: 20,
            cursor: "pointer"
          }}
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.1)}
          style={{
            margin: 5,
            padding: "6px 10px",
            fontSize: 20,
            cursor: "pointer"
          }}
        >
          -
        </button>
        <button
          onClick={() => handleAddNode(false)}
          style={{
            margin: 5,
            padding: "6px 10px",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Add Note
        </button>
        <button
          onClick={() => handleAddNode(true)}
          style={{
            margin: 5,
            padding: "6px 10px",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Add a component
        </button>
      </div>
      <Canvas
        style={{
          transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`
        }}
        onMouseMove={(e) => handleMoveEdge(e.clientX, e.clientY)}
        onMouseLeave={handleCancelEdge}
      >
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            x={node.x}
            y={node.y}
            label={node.label}
            render={node.render}
            onStartEdge={() => handleStartEdge(node.id)}
            onMouseOver={() => handleMoveOverNode(node.id)}
            onMouseDown={(e) =>
              handleNodeDragStart(e, node.id, e.clientX, e.clientY)
            }
            onMouseUp={(e) => handleNodeDragEnd(e)}
          />
        ))}

        {edges.map((edge, index) => {
          const sourceNode = getNodeById(edge.source);
          const targetNode = getNodeById(edge.target);

          if (!sourceNode || !targetNode) return null;

          return (
            <Edge
              key={index}
              sourceX={sourceNode.x + 50}
              sourceY={sourceNode.y + 25}
              targetX={targetNode.x + 50}
              targetY={targetNode.y + 25}
            />
          );
        })}

        {connectingEdge && (
          <Edge
            sourceX={getNodeById(connectingEdge.source).x + 50}
            sourceY={getNodeById(connectingEdge.source).y + 25}
            targetX={connectingEdge.targetX}
            targetY={connectingEdge.targetY}
          />
        )}
      </Canvas>
    </div>
  );
};

export default App;
