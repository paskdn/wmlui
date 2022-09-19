import * as React from "react";
import {
  Alert,
  Button,
  Label,
  Intent,
  TextArea,
  H6,
  Divider,
  Pre,
  Code,
  H3,
} from "@blueprintjs/core";
import { AppToaster } from "../toaster";
import { useAddLink } from "../apis";
import { getPaths } from "../helpers";
import useStore from "../store";

const downloadJsonFile = (linksJson: string) => {
  const element = document.createElement("a");
  const file = new Blob([linksJson], {
    type: "application/json",
  });
  element.href = URL.createObjectURL(file);
  element.download = `wml-links.json`;
  document.body.appendChild(element);
  element.click();
};

export const AddNodes = () => {
  const { links } = useStore();
  const prettyLinks = JSON.stringify(links, null, 4);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLinksOpen, setIsLinksOpen] = React.useState(false);
  const [link, setLink] = React.useState("");
  const { isLoading, isFetching, isRefetching, refetch } = useAddLink(link);

  if (
    (isRefetching && isLoading) ||
    isFetching ||
    Object.keys(links).length === 0
  ) {
    return null;
  }

  return (
    <div
      style={{
        marginLeft: 20,
        height: "80%",
        width: "30%",
        backgroundColor: "#edeff2",
        padding: 20,
      }}
    >
      <Alert
        key={"link"}
        cancelButtonText="Cancel"
        confirmButtonText="Link"
        intent={Intent.PRIMARY}
        icon="link"
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        onConfirm={() => {
          refetch();
          setIsOpen(false);
        }}
      >
        <Label className="bp4-monospace-text bp4-running-text">
          {link.split(",")[0]}
          <br />
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;|</span>
          <br />
          <span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;V</span>
          <br />
          {link.split(",")[1]}
        </Label>
      </Alert>
      <Alert
        style={{ maxWidth: "100%", overflowX: "scroll" }}
        key={"json"}
        confirmButtonText="Ok"
        isOpen={isLinksOpen}
        onConfirm={() => {
          setIsLinksOpen(false);
        }}
      >
        <H3>Links Json</H3>
        <Pre>{prettyLinks}</Pre>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            text="Copy Json"
            icon="clipboard"
            onClick={() => {
              navigator.clipboard.writeText(prettyLinks);
            }}
          />
          <div style={{ paddingLeft: 8 }} />
          <Button
            text="Download Json"
            icon="download"
            onClick={() => {
              downloadJsonFile(prettyLinks)
            }}
          />
        </div>
      </Alert>
      <H6>Add comma separated links(/c/dir , /d/dir)</H6>
      <TextArea
        className="bp4-label"
        style={{ width: "100%", height: "50%" }}
        large={true}
        intent={Intent.PRIMARY}
        onChange={(e) => setLink(e.target.value)}
        value={link}
        spellCheck={false}
      />
      <div style={{ paddingTop: 12, paddingBottom: 8, textAlign: "center" }}>
        <Button
          icon="link"
          text="Add link"
          onClick={() => {
            const paths = getPaths(link);
            if (paths.length === 2) {
              if (new Set(paths).size === 1) {
                AppToaster.show({
                  message: "Paths should be unique.",
                  intent: Intent.WARNING,
                });
                return;
              }
              setIsOpen(true);
            } else {
              AppToaster.show({
                message: "Add comma separated paths",
                intent: Intent.WARNING,
              });
            }
          }}
        />
      </div>
      <Divider />
      <div style={{ paddingTop: 8 }}>
        <Button
          icon="code-block"
          text="Show links"
          onClick={() => {
            setIsLinksOpen(true);
          }}
        />
      </div>
    </div>
  );
};
