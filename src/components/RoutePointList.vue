<template lang="pug">

.route-point-list.cell-list

  transition-group(name="flip-list")

    mt-cell.route-point(
    v-for='(routePoint, index) in orderedRoutePoints' :key="routePoint.id"
    :to="{name: routeName, params: routeParams(routePoint)}"
    )

      small {{ routePoint.shipmentStats() | routePointStats }}

      template(slot="title")
        .title

          span.ord {{ routePoint.ord || '?' }}

          span.statuses(v-if="!reordering")
            span.done(v-if="routePoint.reachedAtLocationId")
              i.el-icon-check
            span.photo(v-if="routePoint.routePointPhotos.length")
              i.el-icon-picture-outline

          span.orders(v-else)
            button(
            @click.prevent.stop="reorder(routePoint, -1)"
            :disabled = "index === 0"
            )
              i.el-icon-arrow-up

            button(
            @click.prevent.stop="reorder(routePoint, 1)"
            :disabled = "index === orderedRoutePoints.length - 1"
            )
              i.el-icon-arrow-down

          span {{ rowTitle(routePoint) }}
          //span.stats(v-if="reordering")
            | {{ routePoint.shipmentStats() | routePointStats }}
        .label {{ rowLabel(routePoint) }}

</template>
<script>

import Vue from 'vue';
import ShipmentRoutePoint, { loadShipmentStats } from '@/models/ShipmentRoutePoint';
import ShipmentRoute from '@/models/ShipmentRoute';

import orderBy from 'lodash/orderBy';
import maxBy from 'lodash/maxBy';
import get from 'lodash/get';
import nsDebug from '@/services/debug';

const debug = nsDebug('route-point-list');

export default {

  data() {
    return {
      routePoints: [],
      shipmentRoute: null,
    };
  },

  watch: {
    shipmentRouteId() {
      ShipmentRoute.bindOne(this, this.shipmentRouteId, 'shipmentRoute');
      this.bindRoutePoints();
      this.refresh();
    },
  },

  props: {
    shipmentRouteId: String,
    routeName: { type: String, default: 'RoutePointPage' },
    routeParamName: { type: String, default: 'routePointId' },
    reordering: Boolean,
  },

  computed: {

    orderedRoutePoints() {
      return orderBy(this.routePoints, 'ord');
    },

  },

  methods: {

    rowLabel(routePoint) {
      return get(routePoint, 'outlet.address');
    },

    rowTitle(routePoint) {
      return get(routePoint, 'outlet.partner.shortName');
    },

    bindRoutePoints() {
      const { shipmentRouteId } = this;
      ShipmentRoutePoint.bindAll(this, { shipmentRouteId, orderBy: [['ord', 'ASC']] }, 'routePoints');
    },

    routeParams(routePoint) {
      return { ...this.$route.params, [this.routeParamName]: routePoint.id };
    },

    async refresh() {

      const loading = this.$loading.show();

      try {

        const routePoints = await findAll(this.shipmentRouteId);

        const reordering = routePoints.map(point => this.reorder(point, 0));
        debug('refresh reordering', `(${reordering.length})`);
        await Promise.all(reordering);

        await loadShipmentStats(routePoints);

        this.$forceUpdate();

      } catch (e) {
        debug(e.name, e.message);
      }

      loading.hide();

      debug('refresh end');

    },

    reorder(routePoint1, change) {

      if (!routePoint1.ord) {

        const max = maxBy(this.orderedRoutePoints, 'ord');

        if (max) {
          setOrd(routePoint1, max.ord + 1);
        } else {
          setOrd(routePoint1, 1);
        }

        return routePoint1.save();
      }

      if (change === 0) {
        return Promise.resolve();
      }

      const routePoint2 = this.orderedRoutePoints[(routePoint1.ord + change) - 1];

      if (!routePoint2 || !routePoint2.ord) {
        return Promise.resolve();
      }

      setOrd(routePoint2, routePoint1.ord);
      setOrd(routePoint1, routePoint1.ord + change);

      return Promise.all([
        routePoint2.save(),
        routePoint1.save(),
      ]);

    },

  },

  created() {

    this.bindRoutePoints();
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePoint.unbindAll(this);
  },

};

function setOrd(routePoint, ord) {
  Vue.set(routePoint, 'ord', ord);
}

function findAll(shipmentRouteId) {

  if (!shipmentRouteId) {
    return Promise.resolve();
  }

  return ShipmentRoutePoint.findAll({ shipmentRouteId }, {
    with: [
      'outlet',
      'outlet.partner',
      'reachedAtLocation',
      'routePointShipments',
      'routePointShipments.shipment',
      'routePointPhotos',
    ],
    // TODO: move routePoint loading to RoutePage
    force: true,
  });
  //
  // return Promise.all(res.map(routePoint =>
  //   routePoint.loadRelations([
  //     // 'routePointShipments.shipment.positions',
  //   ])));

}

</script>
<style scoped lang="scss">

@import "../styles/variables";

.label {
  margin-top: 4px;
  color: $gray;
  font-size: 75%;
}

.route-point {
  button {
    color: $blue;
    flex: 1;
    padding: 5px 7px;
  }
}

.title {
  display: flex;
  align-items: center;
  span {
    margin-right: 7px;
    > i {
      color: $green;
    }
  }
}

.ord {
  font-size: 75%;
  display: inline-block;
  padding: 2px 4px;
  background: $gray-background;
  border-radius: 5px;
  position: relative;
  top: -4px;
}

.route-point-info {

  .stats {
    flex: 1;
    text-align: right;
    font-size: 85%;
  }
}

.done {
  i {
    font-size: 75%;
    top: -4px;
    position: relative;
  }
}

.reorder {

  margin-left: 8px;

}

.flip-list-move {
  transition: transform 0.3s;
}

</style>
