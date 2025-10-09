export const flatten = <T extends { children?: T[] }>(routes: T[]) => {
  return routes.reduce((acc, r) => {
    if (r.children && r.children.length) {
      acc = acc.concat(flatten(r.children));
    } else {
      acc.push(r);
    }
    return acc;
  }, [] as T[]);
};
