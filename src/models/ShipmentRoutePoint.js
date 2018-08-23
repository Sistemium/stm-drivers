import Vue from 'vue';
import flatten from 'lodash/flatten';
import map from 'lodash/map';
import filter from 'lodash/filter';
import keyBy from 'lodash/keyBy';
import sumBy from 'lodash/sumBy';

import Model from '@/jsdata/Model';

import ShipmentPosition from '@/models/ShipmentPosition';

import './ShipmentRoute';
import './Outlet';
import './Location';
import './ShipmentRoutePointShipment';
import './ShipmentRoutePointPhoto';

const positionsData = {};
const statsByRoutePointId = {};

export default new Model({

  name: 'ShipmentRoutePoint',

  relations: {
    belongsTo: {
      ShipmentRoute: {
        localKey: 'shipmentRouteId',
        localField: 'shipmentRoute',
      },
      Outlet: {
        localKey: 'outletId',
        localField: 'outlet',
      },
      Location: {
        localKey: 'reachedAtLocationId',
        localField: 'reachedAtLocation',
      },
    },
    hasMany: {
      ShipmentRoutePointShipment: {
        localField: 'routePointShipments',
        foreignKey: 'shipmentRoutePointId',
      },
      ShipmentRoutePointPhoto: {
        localField: 'routePointPhotos',
        foreignKey: 'shipmentRoutePointId',
      },
    },
  },

  methods: {

    shipmentStats() {
      const shipmentIds = keyBy(this.routePointShipments, 'shipmentId');
      const stats = filter(positionsData, (stat, shipmentId) => shipmentIds[shipmentId]);
      statsByRoutePointId[this.id] = statsByRoutePointId[this.id] || {};
      const stat = statsByRoutePointId[this.id];
      Vue.set(stat, 'positions', sumBy(stats, 'count()'));
      Vue.set(stat, 'volume', sumBy(stats, 'sum(volume)'));
      Vue.set(stat, 'count', stats.length);
      return stat;
    },

  },

});


export async function loadShipmentStats(routePoints) {

  const shipmentIds = flatten(routePoints.map(point => {
    const { routePointShipments } = point;
    return map(routePointShipments, 'shipmentId');
  }));

  if (!shipmentIds.length) {
    return;
  }

  const where = { shipmentId: { '==': shipmentIds } };
  const res = await ShipmentPosition.groupBy({ where }, ['shipmentId']);

  res.forEach(stat => {
    positionsData[stat.shipmentId] = stat;
  });

}
