import STModel from '@/jsdata/Model';

import './Partner';
import './Shipment';
import './ShipmentRoutePoint';

export default new STModel({

  name: 'Outlet',

  relations: {
    belongsTo: {
      Partner: {
        localKey: 'partnerId',
        localField: 'partner',
      },
    },
    hasMany: {
      Shipment: {
        localField: 'shipments',
        foreignKey: 'outletId',
      },
      ShipmentRoutePoint: {
        localField: 'routePoints',
        foreignKey: 'outletId',
      },
    },
  },
});
