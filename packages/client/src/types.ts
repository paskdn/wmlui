import { Node } from "react-flow-renderer";

export interface Link {
  src: string;
  dest: string;
  enabled: boolean;
  createdTime: string;
}
export type Links = Record<string, Link>;

export interface GetLinksResponse {
  isInstalled: boolean;
  links: Links;
}

export interface Details {
  key: string;
  toggleTo: "enable" | "disable";
}
