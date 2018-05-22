import Model from '@/jsdata/Model';

import './Driver';
import './ShipmentRoutePoint';

export default new Model({

  name: 'ShipmentRoute',

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
