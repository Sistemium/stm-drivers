import store from '.';

require('./Outlet');

export default store.defineMapper('partner', {

  notify: false,
  keepChangeHistory: false,
  applySchema: false,
  validateOnSet: false,
  noValidate: true,

  relations: {
    hasMany: {
      outlet: {
        foreignKey: 'partnerId',
        localField: 'outlets',
      },
    },
  },

});
