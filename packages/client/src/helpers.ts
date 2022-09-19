export const getPaths = (link: string) => {
  return link.split(",").map((i) => i.trim());
};
