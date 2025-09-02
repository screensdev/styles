export const symmetricDifference = (source: Set<any>, other: Set<any>) => {
  const result = new Set(source);
  for (const e of other.keys()) {
    if (source.has(e)) {
      result.delete(e);
    } else {
      result.add(e);
    }
  }
  return result;
};
