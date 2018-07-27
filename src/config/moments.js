import { format } from 'date-fns';
// import { ru } from 'date-fns/esm/locale';


export function dateFormat(date) {

  return format(date, 'dd.MM.y');

}

export function dateTimeFormat(utcDate) {

  const date = utcDate instanceof Date ? utcDate : `${utcDate}Z`;
  return format(date, 'dd.MM.y HH:mm');

}

export function serverDateFormat(date) {

  return format(date, 'YYYY-MM-dd');

}

export function serverDateTimeFormat(date = new Date()) {

  format(date, 'YYYY-MM-dd HH:mm:ss.SSS');

}

