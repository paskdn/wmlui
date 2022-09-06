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
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore();
  console.log("linkflow");
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      edgeTypes={edgeTypes}
      nodeTypes={nodeTypes}
      fitView
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

  return <LinksFlow />;
}

export default Flow;
