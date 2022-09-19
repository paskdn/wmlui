import "./App.css";

import { ReactFlowProvider } from "react-flow-renderer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Flow from "./Flow";
import { AddNodes } from "./components/AddNodes";

const queryClient = new QueryClient();

function App() {
  return (
    <ReactFlowProvider>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Flow />
          <AddNodes />
        </div>
      </QueryClientProvider>
    </ReactFlowProvider>
  );
}

export default App;
