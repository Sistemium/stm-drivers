import STModel from '@/jsdata/Model';

import './Outlet';

export default new STModel('Partner', {

  notify: false,
  // keepChangeHistory: false,
  applySchema: false,
  // validateOnSet: false,
  // noValidate: true,

  relations: {
    hasMany: {
      Outlet: {
        foreignKey: 'partnerId',
        localField: 'outlets',
      },
    },
  },

});
