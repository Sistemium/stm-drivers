import Model from '@/jsdata/Model';
import { pictureModelMethods } from '@/services/pictureHelper';

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

  methods: pictureModelMethods(),

});
