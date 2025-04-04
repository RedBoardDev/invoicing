interface GenericObject {
  [key: string]: any;
}

function isObject(item: any): item is GenericObject {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

export const mergeDeep = <T extends GenericObject, U extends GenericObject>(obj1: T, obj2: U): T & U => {
  const result: GenericObject = { ...obj1 };

  if (!isObject(obj1)) return obj2 as T & U;
  if (!isObject(obj2)) return obj1 as T & U;

  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(obj2).forEach((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];

    if (isObject(val1) && isObject(val2)) {
      result[key] = mergeDeep(val1, val2);
    } else {
      result[key] = val2;
    }
  });

  return result as T & U;
};
