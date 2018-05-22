import Model from '@/jsdata/Model';

import './Shipment';
import './ShipmentRoutePoint';

export default new Model({

  name: 'ShipmentRoutePointShipment',

  relations: {
    belongsTo: {
      Shipment: {
        localField: 'shipment',
        localKey: 'shipmentId',
      },
      ShipmentRoutePoint: {
        localField: 'shipmentRoutePoint',
        localKey: 'shipmentRoutePointId',
      },
    },
  },

});
