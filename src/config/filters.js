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
