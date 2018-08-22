import Model from '@/jsdata/Model';
import sumBy from 'lodash/sumBy';

import './Driver';
import './ShipmentRoutePoint';
import Workflow from './Workflow';

export default new Model({

  name: 'ShipmentRoute',

  relations: {
    belongsTo: {
      Driver: {
        localKey: 'driverId',
        localField: 'driver',
      },
    },
    hasMany: {
      ShipmentRoutePoint: {
        localField: 'routePoints',
        foreignKey: 'shipmentRouteId',
      },
    },
  },

  methods: {
    workflow() {

      const v = Workflow.filter({ code: 'shipmentRoute.v2' })[0];

      if (v === undefined) {

        return {};

      }

      const { workflow } = v;
      return workflow[this.processing];
    },

    shipmentStats() {
      const stats = this.routePoints.map(rp => rp.shipmentStats());
      return {
        positions: sumBy(stats, 'positions'),
        volume: sumBy(stats, 'volume'),
        count: sumBy(stats, 'count'),
      };
    },

  },

});
