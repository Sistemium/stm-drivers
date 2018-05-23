import Model from '@/jsdata/Model';

import './Shipment';
import './Article';

export default new Model({

  name: 'ShipmentPosition',

  relations: {
    belongsTo: {
      Shipment: {
        localField: 'shipment',
        localKey: 'shipmentId',
      },
      Article: {
        localField: 'article',
        localKey: 'articleId',
      },
    },
  },

});
