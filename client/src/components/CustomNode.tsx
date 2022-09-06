import { Card, Elevation, Button, Label } from "@blueprintjs/core";
import { useCallback } from "react";
import { Handle, NodeProps, Position } from "react-flow-renderer";

const handleStyle = { left: 10 };

function Source({ data }: NodeProps) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <div className="bp4-card srcnode">{data.name}</div>
      <Handle type="source" position={Position.Right} id="r" />
    </>
  );
}

function Destination({ data }: NodeProps) {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <div className="bp4-card destnode">{data.name}</div>
      <Handle type="target" position={Position.Left} id="l" />
    </>
  );
}

export default {
  src: Source,
  dest: Destination,
};
