import { STModel } from '@/jsdata';

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