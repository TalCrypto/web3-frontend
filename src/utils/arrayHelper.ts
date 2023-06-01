export function baseFindIndex<T>(array: T[], predicate: any, fromIndex: number, fromRight: boolean): number {
  const { length } = array;
  let index = fromIndex + (fromRight ? 1 : -1);

  while (index < length) {
    index = fromRight ? index - 1 : index + 1;
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

export function findLastIndex<T>(array: T[], predicate: any, fromIndex?: number): number {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length - 1;
  if (fromIndex !== undefined) {
    index = fromIndex;
    index = fromIndex < 0 ? Math.max(length + index, 0) : Math.min(index, length - 1);
  }
  return baseFindIndex(array, predicate, index, true);
}

export function binarySearch<T>(array: T[], value: any) {
  let left = 0;
  let right = array.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (array[mid] === value) {
      return mid; // Value found, return the index
    }
    if (array[mid] < value) {
      left = mid + 1; // Value is in the right half of the remaining array
    } else {
      right = mid - 1; // Value is in the left half of the remaining array
    }
  }

  return -1; // Value not found
}
