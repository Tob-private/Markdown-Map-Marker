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

export function getImageDimensions(
  url: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = url;
  });
}
