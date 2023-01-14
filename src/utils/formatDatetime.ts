import moment from 'moment';

export function formatDatetime(value?: string): string {
  if (value) {
    return moment(value).format('DD/MM/YYYY HH:mm');
  }

  return '';
}
