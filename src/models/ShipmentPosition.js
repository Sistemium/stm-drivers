import Model from '@/jsdata/Model';

import './Shipment';

export default new Model({

  name: 'ShipmentPosition',

  relations: {
    belongsTo: {
      Shipment: {
        localField: 'shipment',
        localKey: 'shipmentId',
      },
    },
  },

});
