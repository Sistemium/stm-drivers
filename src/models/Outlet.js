import store from '.';

require('./Partner');

export default store.defineMapper('outlet', {
  relations: {
    belongsTo: {
      partner: {
        localKey: 'partnerId',
        localField: 'partner',
      },
    },
  },
});
