import Model from '@/jsdata/Model';

import './ShipmentRoutePoint';

export default new Model({

  name: 'ShipmentRoutePointPhoto',

  relations: {
    belongsTo: {
      ShipmentRoutePoint: {
        localField: 'shipmentRoutePoint',
        localKey: 'shipmentRoutePointId',
      },
    },
  },

});
