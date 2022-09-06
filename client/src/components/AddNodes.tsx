import * as React from "react";
import { Alert, Button, Label, Intent, TextArea } from "@blueprintjs/core";
import { AppToaster } from "../toaster";

const message = "Add comma separated paths";

export const AddNodes = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [link, setLink] = React.useState(
    "/Users/kuladeepupillaappalasurya/HW/Work/GitHub/plat-mobi-ui-reactnative/core/lib, /Users/kuladeepupillaappalasurya/HW/Work/GitHub/plat-mobi-ui-reactnative/core/lib"
  );
  return (
    <>
      <Alert
        cancelButtonText="Cancel"
        confirmButtonText="Link"
        intent={Intent.PRIMARY}
        icon="link"
        isOpen={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
        onConfirm={() => {
          setIsOpen(false);
          setLink("");
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "80%",
          paddingTop: "20px",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TextArea
          className="bp4-label"
          style={{ width: "80%", height: "70px" }}
          large={true}
          intent={Intent.PRIMARY}
          onChange={(e) => setLink(e.target.value)}
          value={link}
          spellCheck={false}
        />
        <div>
          <Button
            text="Create link"
            onClick={() => {
              if (link.split(",").length === 2) {
                setIsOpen(true);
              } else {
                AppToaster.show({ message, intent: Intent.WARNING });
              }
            }}
          />
        </div>
      </div>
    </>
  );
};
