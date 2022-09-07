import "./App.css";

import { ReactFlowProvider } from "react-flow-renderer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Card, Elevation } from "@blueprintjs/core";
import Flow from "./Flow";
import { AddNodes } from "./components/AddNodes";

const queryClient = new QueryClient();

function App() {
  return (
    <ReactFlowProvider>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          {/* <h1 style={{ textAlign: "center" }}>wml</h1> */}
          <Card
            style={{
              height: "80%",
              width: "90%",
            }}
            elevation={Elevation.TWO}
          >
            <Flow />
          </Card>
          <AddNodes />
        </div>
      </QueryClientProvider>
    </ReactFlowProvider>
  );
}

export default App;
