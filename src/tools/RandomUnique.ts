function RandomUnique(range: number, count: number): number[] {
  const nums = new Set<number>();
  while (nums.size < count) {
    nums.add(Math.floor(Math.random() * (range - 1 + 1) + 1));
  }
  return [...nums];
}

export default RandomUnique;
