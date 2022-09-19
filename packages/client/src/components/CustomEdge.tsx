import * as React from "react";
import {
  EdgeProps,
  getBezierPath,
  getEdgeCenter,
  Position,
} from "react-flow-renderer";
import {
  Alert,
  H4,
  Icon,
  Intent,
  Label,
  Switch,
  Tooltip,
} from "@blueprintjs/core";
import { AppToaster } from "../toaster";
import { useRemoveLink, useUpdateLink } from "../apis";
import { activeColor } from "../helpers";

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
  const [show, setShow] = React.useState(false);
  const [alert, setAlert] = React.useState(false);
  const { mutate: updateLink } = useUpdateLink();
  const { refetch } = useRemoveLink(data.key);

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
      <Alert
        onConfirm={() => {
          refetch();
          setAlert(false);
        }}
        onCancel={() => {
          setAlert(false);
        }}
        cancelButtonText="Cancel"
        confirmButtonText="Remove link"
        isOpen={alert}
        intent={Intent.DANGER}
      >
        <H4>Are you sure you want to remove link</H4>
        <Label className="bp4-monospace-text bp4-running-text">
          {data.meta.source}
          <br />
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|</span>
          <br />
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;V</span>
          <br />
          {data.meta.target}
        </Label>
      </Alert>
      <path
        id={id}
        style={{
          stroke: activeColor(data.enabled),
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        onMouseEnter={(e) => {
          setShow(true);
        }}
        onMouseLeave={(e) => {
          setShow(false);
        }}
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{ height: "100%", width: "100%" }}
          onMouseEnter={(e) => {
            setShow(true);
          }}
          onMouseLeave={(e) => {
            setShow(false);
          }}
        >
          <Tooltip
            content={
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Switch
                  style={{ margin: 4 }}
                  checked={data.enabled}
                  onChange={onChangeLink}
                />
                <Icon
                  style={{
                    borderRadius: 16,
                  }}
                  icon="cross"
                  onClick={() => {
                    setAlert(true);
                  }}
                />
              </div>
            }
            position={Position.Right}
            isOpen={show}
          >
            <div
              style={{
                borderRadius: 16,
                height: 20,
                width: 20,
                backgroundColor: "#E5E8EB",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Icon icon="more" />
            </div>
          </Tooltip>
        </div>
      </foreignObject>
    </>
  );
}
