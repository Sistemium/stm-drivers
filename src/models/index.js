import store from '@/jsdata/store';

store.on('all', (name, model, data) => {
  // eslint-disable-next-line
  console.group(`Event "${name}" on "${model}"`);
  // eslint-disable-next-line
  console.log('Data: ', data);
  // eslint-disable-next-line
  console.groupEnd();
});

