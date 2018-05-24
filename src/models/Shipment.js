import Model from '@/jsdata/Model';

import sumBy from 'lodash/sumBy';

import './ShipmentPosition';
import './ShipmentRoutePointShipment';
import './Outlet';

export default new Model({

  name: 'Shipment',

  relations: {
    belongsTo: {
      Outlet: {
        localKey: 'outletId',
        localField: 'outlet',
      },
    },
    hasMany: {
      ShipmentPosition: {
        localField: 'positions',
        foreignKey: 'shipmentId',
      },
      ShipmentRoutePointShipment: {
        localField: 'routePointShipments',
        foreignKey: 'shipmentId',
      },
    },
  },

  methods: {

    totalBoxes() {

      return Math.ceil(sumBy(this.positions, it => it.volume / it.article.packageRel));

    },

  },

});
