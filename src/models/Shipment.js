import Model from '@/jsdata/Model';

import sumBy from 'lodash/sumBy';
// import nsDebug from '@/services/debug';

import './ShipmentPosition';
import './ShipmentRoutePointShipment';
import './Outlet';

// const debug = nsDebug('shipment');

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

    /**
     * Returns an object with positions totals
     * @returns {{totalBoxes: *, volume: number, positions: *}}
     */

    stats() {
      const res = {
        totalBoxes: this.totalBoxes(),
        volume: sumBy(this.positions, 'volume'),
        positions: this.positions.length,
      };
      // debug('stats', this.id, res);
      return res;
    },

  },

});
