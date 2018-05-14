import Model from '@/jsdata/Model';

import './Driver';
import './ShipmentRoutePoint';

export default new Model('ShipmentRoute', {

  notify: false,

  relations: {
    belongsTo: {
      Driver: {
        localKey: 'driverId',
        localField: 'driver',
      },
    },
    hasMany: {
      ShipmentRoutePoint: {
        localField: 'routePoints',
        foreignKey: 'shipmentRouteId',
      },
    },
  },

});
