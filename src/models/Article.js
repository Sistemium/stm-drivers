import Model from '@/jsdata/Model';

import './ShipmentPosition';

export default new Model({

  name: 'Article',

  relations: {
    hasMany: {
      ShipmentPosition: {
        localField: 'shipmentPositions',
        foreignKey: 'articleId',
      },
    },
  },

});
