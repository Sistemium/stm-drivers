import Model from '@/jsdata/Model';

import './ShipmentRoute';

export default new Model('ShipmentRoutePoint', {

  notify: false,

  relations: {
    belongsTo: {
      ShipmentRoute: {
        localKey: 'shipmentRouteId',
        localField: 'shipmentRoute',
      },
    },
  },

});
