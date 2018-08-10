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

Vue.filter('boxPcs', (value, packageRel = 1) => {

  if (!value) return '';

  const boxes = packageRel ? Math.floor(value / packageRel) : 0;
  const pcs = value - (boxes * packageRel);
  const res = [];

  if (boxes) {
    res.push(`${boxes}к`);
  }

  if (pcs) {
    res.push(`${pcs}б`);
  }

  return res.join(' ');

});

Vue.filter('ndoc', value => value || 'РНК');
