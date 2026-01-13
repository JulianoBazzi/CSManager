import dayjs from 'dayjs';

export function formatDate(value?: string): string {
  if (value) {
    return dayjs(value).format('DD/MM/YY');
  }

  return '';
}
