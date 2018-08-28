<template lang="pug">

.route-point-list.cell-list(:class="reordering && 'reordering'")

  transition-group(name="flip-list")

    mt-cell.route-point(
    v-for='(routePoint, index) in orderedRoutePoints()' :key="routePoint.id"
    :to="{name: routeName, params: routeParams(routePoint)}"
    )

      small.stats {{ routePoint.shipmentStats() | routePointStats }}

      template(
      slot="title"
      )
        .title(@click="titleClick")

          span.ord(
          @click.prevent.stop="orderClick(routePoint)"
          ) {{ routePoint.ord }}

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
            :disabled = "index === orderedRoutePoints().length - 1"
            )
              i.el-icon-arrow-down

          span {{ rowTitle(routePoint) }}

        .label(@click="titleClick") {{ rowLabel(routePoint) }}

  mt-popup.popup(
  v-model="orderPopupVisible" position="right" v-if="routePoints.length"
  )
    route-point-order-picker(
    v-if="orderingRoutePoint"
    :route-point="orderingRoutePoint"
    :count="routePoints.length"
    :on-done="setRoutePointOrder"
    )

</template>
<script>
import filter from 'lodash/filter';
import Vue from 'vue';
import ShipmentRoutePoint, { loadShipmentStats } from '@/models/ShipmentRoutePoint';
import ShipmentRoute from '@/models/ShipmentRoute';
import RoutePointOrderPicker from '@/components/RoutePointOrderPicker';

import orderBy from 'lodash/orderBy';
import maxBy from 'lodash/maxBy';
import get from 'lodash/get';
import nsDebug from '@/services/debug';

const debug = nsDebug('route-point-list');

export default {

  components: { RoutePointOrderPicker },

  data() {
    return {
      routePoints: [],
      shipmentRoute: null,
      orderPopupVisible: false,
      orderingRoutePoint: null,
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

  computed: {},

  methods: {

    titleClick(event) {
      if (!this.reordering) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      debug('titleClick', event);
    },

    async setRoutePointOrder(order) {

      this.orderPopupVisible = false;

      if (!order) {
        return;
      }

      const ordAfter = parseInt(order, 0);
      const { ord: ordBefore } = this.orderingRoutePoint;

      if (ordAfter === ordBefore) return;

      const dir = ordAfter > ordBefore ? 1 : -1;

      const { routePoints } = this;

      const oldRPSameOrd = filter(routePoints, ({ ord }) => {
        if (dir > 0) {
          return ord <= ordAfter && ord > ordBefore;
        }
        return ord >= ordAfter && ord < ordBefore;
      });

      oldRPSameOrd.forEach(rp => {
        Vue.set(rp, 'ord', rp.ord - dir);
      });

      this.orderingRoutePoint.ord = ordAfter;

      // const loading = this.$loading.show();

      try {
        await this.normalizeOrders();
      } catch (e) {
        debug(e.name, e.message);
      }

      // loading.hide();

    },

    normalizeOrders(immediate = false) {

      this.orderedRoutePoints().forEach((rp, idx) => {
        Vue.set(rp, 'ord', idx + 1);
      });

      const toSave = this.orderedRoutePoints()
        .map(rp => rp.hasChanges() && this.saveRoutePoint(rp, immediate));

      return Promise.all(filter(toSave));

    },

    orderClick(routePoint) {
      this.orderingRoutePoint = routePoint;
      this.orderPopupVisible = true;
    },

    orderedRoutePoints() {
      return orderBy(this.routePoints || [], 'ord');
    },

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

        await this.normalizeOrders(true);
        await loadShipmentStats(routePoints);

        this.$forceUpdate();

      } catch (e) {
        debug(e.name, e.message);
      }

      loading.hide();

      debug('refresh end');

    },

    reorder(routePoint1, change, immediate = false) {

      if (!routePoint1.ord) {

        const max = maxBy(this.orderedRoutePoints(), 'ord');

        if (max) {
          setOrd(routePoint1, max.ord + 1);
        } else {
          setOrd(routePoint1, 1);
        }

        return this.saveRoutePoint(routePoint1, immediate);
      }

      if (change === 0) {
        return Promise.resolve();
      }

      const routePoint2 = this.orderedRoutePoints()[(routePoint1.ord + change) - 1];

      if (!routePoint2 || !routePoint2.ord) {
        return Promise.resolve();
      }

      setOrd(routePoint2, routePoint1.ord);
      setOrd(routePoint1, routePoint1.ord + change);

      if (!immediate) {
        this.$forceUpdate();
      }

      return Promise.all([
        this.saveRoutePoint(routePoint2, immediate),
        this.saveRoutePoint(routePoint1, immediate),
      ]);

    },

    saveRoutePoint(routePoint, immediate = false) {

      return ShipmentRoutePoint.safeSave(routePoint, immediate);

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
    &[disabled] {
      color: $gray-border-color;
    }
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

.orders {
  white-space: nowrap;
}

.ord {
  font-size: 75%;
  display: inline-block;
  padding: 3px 5px;
  background: $gray-background;
  border-radius: 7px;
  position: relative;
  top: -4px;
}

.reordering {
  .stats {
    color: $primary-color;
  }
  .ord {
    background: $primary-color;
    color: white;
  }
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

.popup {
  left: 0;
  top: 50%;
  bottom: -50%;
}

</style>
