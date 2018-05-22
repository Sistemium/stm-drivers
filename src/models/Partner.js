import STModel from '@/jsdata/Model';

import './Outlet';

export default new STModel({

  name: 'Partner',
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
