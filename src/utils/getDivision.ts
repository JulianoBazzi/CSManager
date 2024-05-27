export default function getDivision(value1: number, value2?: number): number {
  return value2 && value2 > 0 ? value1 / value2 : 0;
}
