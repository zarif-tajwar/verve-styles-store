export const dynamicQueryFromObj = (
  staticKey: string,
  dyanmicObjectKey: Record<string, string | string[] | undefined>,
) => {
  return Object.keys(dyanmicObjectKey).length > 0
    ? [staticKey, dyanmicObjectKey]
    : [staticKey];
};
