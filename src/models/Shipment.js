import Model from '@/jsdata/Model';

import './ShipmentPosition';
import './ShipmentRoutePointShipment';

export default new Model({

  name: 'Shipment',

  relations: {
    hasMany: {
      ShipmentPosition: {
        localField: 'positions',
        foreignKey: 'shipmentId',
      },
      ShipmentRoutePointShipment: {
        localField: 'routePointShipments',
        foreignKey: 'shipmentId',
      },
    },
  },

});
