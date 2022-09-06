import { EdgeProps, getBezierPath, getEdgeCenter } from "react-flow-renderer";
import { Button, Switch } from "@blueprintjs/core";
import useStore from "../store";
import { AppToaster } from "../toaster";
import { useUpdateLink } from "../apis";

const foreignObjectSize = 40;

export default function Toggle({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const { mutate: updateLink } = useUpdateLink();
  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const onChangeLink: React.FormEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();
    updateLink({
      key: data.key,
      toggleTo: data.enabled ? "disable" : "enable",
    });
    AppToaster.show({
      icon: "console",
      message: `Updating link in the background...`,
    });
  };

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <Switch
          style={{ margin: 4 }}
          checked={data.enabled}
          onChange={onChangeLink}
        />
      </foreignObject>
    </>
  );
}
