export function baseFindIndex(array, predicate, fromIndex, fromRight) {
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

export function findLastIndex(array, predicate, fromIndex) {
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
