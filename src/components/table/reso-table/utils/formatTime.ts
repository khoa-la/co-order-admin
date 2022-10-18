import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function formatDate(date: string | number | Date, formatStr: string = 'yyyy/MM/dd') {
  return format(new Date(date), formatStr);
}

export function fDate(date: string | number | Date, formatStr: string = 'dd/MM/yyy') {
  return format(new Date(date), formatStr);
}

export function fDateTime(date: string | number | Date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}
export function fDateTimeSuffix2(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm');
}

export function fDateTimeSuffix3(date: string | number | Date) {
  return format(new Date(date), 'dd/MM/yyyy');
}

export function fToNow(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
