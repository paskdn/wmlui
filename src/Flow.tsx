import * as React from "react";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Controls,
  Edge,
  Node,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  Position,
} from "react-flow-renderer";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "ui-controls" },
    position: { x: 10, y: 10 },
    sourcePosition: Position.Right,
  },

  {
    id: "2",
    type: "input",
    // you can also pass a React component as a label
    data: { label: <div title="title">core</div> },
    position: { x: 10, y: 110 },
    sourcePosition: Position.Right,
  },
  {
    id: "3",
    type: "input",
    data: { label: "theme" },
    position: { x: 10, y: 210 },
    sourcePosition: Position.Right,
  },
];

const initialEdges: Edge[] = [];
// [
//   { id: "e1-2", source: "1", target: "2" },
//   { id: "e2-3", source: "2", target: "3" },
// ];

function Flow() {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = React.useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = React.useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      //   fitView
    >
      <Controls />
    </ReactFlow>
  );
}

export default Flow;
