import Model from '@/jsdata/Model';

import './ShipmentPosition';

export default new Model({

  name: 'Shipment',

  relations: {
    hasMany: {
      ShipmentPosition: {
        localField: 'positions',
        foreignKey: 'shipmentId',
      },
    },
  },

});
