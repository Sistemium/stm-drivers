<template lang="pug">

.route-point-list.cell-list

  .buttons(v-for="(value, key) in shipmentRoute.workflow().to")
    mt-button(type="primary" @click = "saveProcessing(key)") {{ value }}

  .route-point(v-for='(routePoint, index) in orderedRoutePoints' :key="routePoint.id")
    mt-cell(
    :to="{name: routeName, params: routeParams(routePoint)}"
    )

      span(v-if="!reordering") {{ routePoint.routePointShipments.length }}н

      button(@click.prevent.stop="reorder(routePoint, -1)"
      v-if="reordering" :disabled = "index === 0")
        i.el-icon-arrow-up
      button(@click.prevent.stop="reorder(routePoint, 1)"
      v-if="reordering" :disabled = "index === orderedRoutePoints.length - 1")
        i.el-icon-arrow-down

      div(slot="title")
        .title
          span.ord {{ routePoint.ord || '?' }}
          span {{ routePoint.outlet.partner.shortName }}
        .label {{ routePoint.outlet.address }}

</template>
<script>
/* eslint-disable no-param-reassign */


import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';
import ShipmentRoute from '@/models/ShipmentRoute';
import orderBy from 'lodash/orderBy';
import maxBy from 'lodash/maxBy';
import fpForEach from 'lodash/fp/forEach';

export default {

  data() {
    return {
      routePoints: this.bindRoutePoints(),
      shipmentRoute: ShipmentRoute.bindOne(this, this.shipmentRouteId, 'shipmentRoute'),
    };
  },

  watch: {
    shipmentRouteId() {
      this.shipmentRoute = ShipmentRoute.bindOne(this, this.shipmentRouteId, 'shipmentRoute');
      this.routePoints = this.bindRoutePoints();
      this.refresh();
    },
  },

  props: {
    shipmentRouteId: String,
    routeName: { type: String, default: 'RoutePointPage' },
    routeParamName: { type: String, default: 'routePointId' },
  },

  computed: {

    orderedRoutePoints() {
      return orderBy(this.routePoints, 'ord');
    },

    reordering() {
      return this.shipmentRoute.processing === 'routing';
      // return true;
    },

  },

  methods: {

    bindRoutePoints() {
      const { shipmentRouteId } = this;
      return ShipmentRoutePoint.bindAll(this, { shipmentRouteId, orderBy: [['ord', 'ASC']] }, 'routePoints');
    },

    routeParams(routePoint) {
      return { ...this.$route.params, [this.routeParamName]: routePoint.id };
    },

    refresh() {
      findAll(this.shipmentRouteId)
        .then(fpForEach(point => {

          this.reorder(point, 0);

        }))
        .then(this.$loading.show().hide);
    },

    reorder(routePoint, change) {

      if (!routePoint.ord) {

        const max = maxBy(this.orderedRoutePoints, 'ord');

        if (max) {

          routePoint.ord = max.ord + 1;

        } else {

          routePoint.ord = 1;

        }

        routePoint.save();

        return;

      }

      if (change === 0) {

        return;

      }

      const point = this.orderedRoutePoints[(routePoint.ord + change) - 1];

      if (!point || !point.ord) {

        return;

      }

      point.ord = routePoint.ord;

      point.save();

      routePoint.ord += change;

      routePoint.save();

    },

    saveProcessing(processing) {

      this.shipmentRoute.processing = processing;

      this.shipmentRoute.save();

    },

  },

  created() {
    this.refresh();
  },

  beforeDestroy() {
    ShipmentRoutePoint.unbindAll(this);
  },

};

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
    ],
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

.ord {
  margin-right: 7px;
  font-size: 75%;
  display: inline-block;
  padding: 2px;
  background: $gray-background;
  border-radius: 5px;
  position: relative;
  top: -4px;
}

.reorder {

  margin-left: 8px;

}

</style>
