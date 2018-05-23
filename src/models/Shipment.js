import Model from '@/jsdata/Model';

import './ShipmentPosition';
import './ShipmentRoutePointShipment';
import './Outlet';

export default new Model({

  name: 'Shipment',

  relations: {
    belongsTo: {
      Outlet: {
        localKey: 'outletId',
        localField: 'outlet',
      },
    },
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
