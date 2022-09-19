export const getPaths = (link: string) => {
  return link.split(",").map((i) => i.trim());
};

export const activeColor = (enabled: boolean) => {
  return enabled ? "#2D72D2" : undefined;
};
