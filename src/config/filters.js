import Vue from 'vue';
import { dateTimeFormat, dateFormat } from '@/config/moments';

Vue.filter('dateTime', value => {

  if (!value) return '';

  return dateTimeFormat(value);

});

Vue.filter('date', value => {

  if (!value) return '';

  return dateFormat(value);

});

Vue.filter('boxes', value => {

  if (!value) return '';

  const formatted = value > 2 ? Math.ceil(value) : value.toFixed(1);

  return `${formatted}к`;

});
