export default function formatPercentage(value: number, round = false): string {
  if (!value) {
    return '0%';
  }

  if (round) {
    return `${Math.round(value)}%`;
  }

  return `${value.toFixed(2)}%`;
}
