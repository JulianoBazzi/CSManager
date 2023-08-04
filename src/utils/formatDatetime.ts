import dayjs from 'dayjs';

export function formatDatetime(value?: string): string {
  if (value) {
    return dayjs(value).format('DD/MM/YYYY HH:mm');
  }

  return '';
}
