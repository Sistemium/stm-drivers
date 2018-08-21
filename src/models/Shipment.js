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

      return sumBy(this.positions, it => (it.article ? it.volume / it.article.packageRel : 0));

    },

    stats() {

      return {
        totalBoxes: this.totalBoxes(),
        volume: sumBy(this.positions, 'volume'),
        positions: this.positions.length,
      };

    },

  },

});
