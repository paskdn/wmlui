import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { useGetLinks } from "./apis";
import { AddNodes } from "./components/AddNodes";
import Toggle from "./components/CustomEdge";
import CustomNode from "./components/CustomNode";
import useStore from "./store";

const edgeTypes = {
  buttonedge: Toggle,
};

const nodeTypes = {
  src: CustomNode.src,
  dest: CustomNode.dest,
};

const LinksFlow = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    onEdgeUpdateStart,
    onEdgeUpdateEnd,
  } = useStore();
  console.log("linkflow");
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeUpdate={onEdgeUpdate}
      onEdgeUpdateStart={onEdgeUpdateStart}
      onEdgeUpdateEnd={onEdgeUpdateEnd}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      fitView
      attributionPosition="top-left"
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

function Flow() {
  const { isLoading, error } = useGetLinks();

  if (isLoading) {
    return <div>"Loading..."</div>;
  }

  if (error) {
    return <div>{"An error has occurred: " + error}</div>;
  }

  return (
    <div
      style={{
        height: "80%",
        width: "70%",
        backgroundColor: "white",
      }}
    >
      <LinksFlow />
    </div>
  );
}

export default Flow;
