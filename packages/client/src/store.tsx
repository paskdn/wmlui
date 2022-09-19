import create from "zustand";
import produce from "immer";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  Position,
  OnEdgeUpdateFunc,
  WrapEdgeProps,
  updateEdge,
} from "react-flow-renderer";
import { Links } from "./types";
import { Label } from "@blueprintjs/core";
import { activeColor } from "./helpers";

const VERTICAL_SPACING = 80;

type RFState = {
  links: Links;
  edgeUpdateSuccessful: boolean;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  onEdgeUpdate: OnEdgeUpdateFunc;
  onEdgeUpdateStart: WrapEdgeProps<any>["onEdgeUpdateStart"];
  onEdgeUpdateEnd: WrapEdgeProps<any>["onEdgeUpdateEnd"];
  updateFlow: (links: Links) => void;
  set: (fn: (state: RFState) => void) => void;
};

const getFolder = (path: string, dest = false) => {
  const folderArr = path.split("/").reverse();
  if (!dest) {
    return folderArr[1];
  } else {
    return `${folderArr[5]}/${folderArr[4]}/${folderArr[1]}`;
  }
};

const getDetails = (links: Links) => {
  const edges: Edge[] = [];
  const sources: Node[] = [];
  const destinations: Node[] = [];

  Object.entries(links).forEach(([key, { src, dest, enabled }]) => {
    const srcFolder = getFolder(src);
    const destFolder = getFolder(dest, true);
    if (!sources.find(({ id }) => id === src)) {
      sources.push({
        id: src,
        type: "src",
        data: {
          label: <Label title={src}>{srcFolder}</Label>,
          name: srcFolder,
        },
        // position: { x: 10, y: 10 + sources.length * VERTICAL_SPACING },
        // will override positions
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
      });
    }
    if (!destinations.find(({ id }) => id === dest)) {
      destinations.push({
        id: dest,
        type: "dest",
        width: 200,
        data: {
          label: <Label title={dest}>{destFolder}</Label>,
          name: destFolder,
        },
        // position: { x: 350, y: 10 + destinations.length * VERTICAL_SPACING },
        // will override positions
        position: { x: 0, y: 0 },
        targetPosition: Position.Left,
      });
    }
    edges.push({
      id: `e${src}-${dest}`,
      source: src,
      target: dest,
      markerStart: { type: MarkerType.ArrowClosed },
      markerEnd: { type: MarkerType.Arrow, color: activeColor(enabled) },
      type: "buttonedge",
      data: {
        enabled,
        key,
        meta: {
          source: src,
          target: dest,
        },
      },
    } as Edge);
  });

  return {
    nodes: [
      ...sources
        .sort((a, b) => a.data.name.localeCompare(b.data.name))
        .map((link, index) => ({
          ...link,
          position: { x: 10, y: 10 + index * VERTICAL_SPACING },
        })),
      ...destinations
        .sort((a, b) => {
          const getLastPath = (path: string) => path.split("/").reverse()[0];
          return getLastPath(a.data.name).localeCompare(
            getLastPath(b.data.name)
          );
        })
        .map((link: Node, index: number) => ({
          ...link,
          position: { x: 350, y: 10 + index * VERTICAL_SPACING },
        })),
    ],
    edges,
  };
};

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  links: {},
  edgeUpdateSuccessful: false,
  nodes: [],
  edges: [],
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  onEdgeUpdateStart: () => {
    set({
      edgeUpdateSuccessful: false,
    });
  },

  onEdgeUpdate: (oldEdge, newConnection) => {
    set({
      edges: updateEdge(oldEdge, newConnection, get().edges),
      edgeUpdateSuccessful: true,
    });
  },

  onEdgeUpdateEnd: (_, edge) => {
    const { edgeUpdateSuccessful } = get();
    if (!edgeUpdateSuccessful) {
      set({
        edges: get().edges.filter((e) => e.id !== edge.id),
      });
    }
    set({
      edgeUpdateSuccessful: true,
    });
  },

  updateFlow: (links: Links) => {
    set({ ...getDetails(links), links });
  },
  set: (fn) => set(produce(fn)),
}));

export default useStore;
