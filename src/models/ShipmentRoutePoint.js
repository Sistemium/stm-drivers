import Model from '@/jsdata/Model';

import './ShipmentRoute';
import './Outlet';
import './Location';
import './ShipmentRoutePointShipment';

export default new Model({

  name: 'ShipmentRoutePoint',

  relations: {
    belongsTo: {
      ShipmentRoute: {
        localKey: 'shipmentRouteId',
        localField: 'shipmentRoute',
      },
      Outlet: {
        localKey: 'outletId',
        localField: 'outlet',
      },
      Location: {
        localKey: 'reachedAtLocationId',
        localField: 'reachedAtLocation',
      },
    },
    hasMany: {
      ShipmentRoutePointShipment: {
        localField: 'routePointShipments',
        foreignKey: 'shipmentRoutePointId',
      },
    },
  },

});
