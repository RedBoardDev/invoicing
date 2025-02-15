import ApiError from '@libs/error-management/api-error';

/**
 * Checks if a value is an object and not null or an array.
 * @param value - The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

/**
 * Checks if an array contains only strings.
 * @param array - The array to check.
 * @returns True if every element in the array is a string, false otherwise.
 */
export const isArrayOfString = (array: unknown[]): array is string[] =>
  array.every((element) => typeof element === 'string');

/**
 * Checks if all elements of a subset are contained in a set.
 * @param subset - The subset to check.
 * @param set - The set to check against.
 * @returns True if all elements of the subset are in the set, false otherwise.
 */
export const isContainedIn = (subset: unknown[], set: unknown[]): boolean => {
  const setConverted = new Set(set);
  return subset.every((element) => setConverted.has(element));
};

/**
 * Creates a new object excluding the specified properties.
 * @param obj - The object from which to exclude properties.
 * @param props - The properties to exclude.
 * @returns A new object excluding the specified properties.
 */
export const excludeProperties = <T, K extends keyof T>(obj: T, ...props: K[]): Omit<T, K> => {
  const result = { ...obj };
  props.forEach((prop) => delete result[prop]);
  return result;
};

/**
 * Type representing the result of comparing two lists.
 */
export interface comparedListsType {
  added: number[];
  removed: number[];
}

/**
 * Compares two lists and identifies items added and removed.
 * @param currentList - The current list of items.
 * @param newList - The new list of items to compare against the current list.
 * @returns An object with arrays of added and removed items.
 */
export const compareLists = (currentList: number[], newList: number[]): comparedListsType => {
  const added = newList.filter((id) => !currentList.includes(id));
  const removed = currentList.filter((id) => !newList.includes(id));
  return { added, removed };
};

/**
 * Generates a random six-digit number.
 * @returns A random six-digit number.
 */
export const generateRandomSixDigitNumber = (): number => Math.floor(100000 + Math.random() * 900000);

/**
 * Checks if an object contains a specific attribute and it's not null or undefined.
 * @param obj - The object to check.
 * @param attribut - The attribute to check for.
 * @returns True if the attribute exists and is not null or undefined, false otherwise.
 */
export const attrExist = (obj: unknown, attribut: string): boolean => {
  if (typeof obj !== 'object' || obj === null) return false;
  const typedObj = obj as Record<string, unknown>;
  return attribut in typedObj && typedObj[attribut] !== null && typedObj[attribut] !== undefined;
};

/**
 * Removes specific elements from an array.
 * @param array - The array from which to remove elements.
 * @param elementsToRemove - The elements to remove.
 */
export const removeElements = (array: unknown[], elementsToRemove: unknown[]): void => {
  elementsToRemove.forEach((element) => {
    const index = array.indexOf(element);
    if (index !== -1) array.splice(index, 1);
  });
};

/**
 * Removes a specific element from an array.
 * @param array - The array from which to remove the element.
 * @param elementToRemove - The element to remove.
 */
export const removeElement = (array: unknown[], elementToRemove: unknown): void => {
  const index = array.indexOf(elementToRemove);
  if (index !== -1) array.splice(index, 1);
};

/**
 * Returns a value or throws an error based on a condition.
 * @param doThrow - A boolean indicating whether to throw an error.
 * @param throwObj - The error object containing the message and status code.
 * @param retVal - The value to return if not throwing an error.
 * @returns The provided value if not throwing, or throws an error if `doThrow` is true.
 */
export const returnOrThrow = (
  doThrow: boolean,
  throwObj: { message: string; status: number },
  retVal: unknown,
): unknown => {
  if (doThrow) throw new ApiError(throwObj.message, 400, throwObj.status);
  return retVal;
};

/**
 * Divides an array into chunks of a specified size.
 * @param array - The array to chunk.
 * @param chunkSize - The size of each chunk.
 * @returns An array of chunks, where each chunk is a sub-array of the specified size.
 */
export const chunkArray = (array: unknown[], chunkSize: number): unknown[][] => {
  const result: unknown[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) result.push(array.slice(i, i + chunkSize));
  return result;
};

/**
 * Converts an enum object into an array of its numeric values.
 * @param enumObj - The enum object to convert.
 * @returns An array of numeric values from the enum.
 */
export const enumToArray = (enumObj: object): number[] =>
  Object.values(enumObj).filter((value) => typeof value === 'number') as number[];

/**
 * Checks if an array contains no duplicate elements.
 * @param array - The array to check.
 * @returns True if the array contains no duplicates, false otherwise.
 */
export const hasNoDuplicates = (array: unknown[]): boolean => array.length === new Set(array).size;

/**
 * Checks if all elements in one array are present in another array.
 * @param toverif - The array of elements to verify.
 * @param source - The source array to check against.
 * @returns True if all elements in `toverif` are in `source`, false otherwise.
 */
export const areAllElementsInSource = (toverif: number[], source: number[]): boolean =>
  toverif.every((element) => source.includes(element));
