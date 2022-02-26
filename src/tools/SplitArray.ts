import RandomUnique from './RandomUnique';

function SplitArray<T>(array: T[]): T[][] {
  const perArray = Math.round(array.length / 2);

  const indexes = RandomUnique(array.length - 1, perArray);

  const firstArray: T[] = [];

  indexes.forEach((index) => {
    firstArray.push(array[index]);
  });

  const secondArray = array.filter((item) => !firstArray.includes(item));

  return [firstArray, secondArray];
}

export default SplitArray;
