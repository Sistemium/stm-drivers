<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='routePoint in routePoints' :key="routePoint.id")
    mt-cell(
    :to="{name: routeName, params: routeParams(routePoint)}"
    )
      span {{ routePoint.routePointShipments.length }}н
      div(slot="title")
        .title
          span.ord {{ routePoint.ord || '?' }}
          span {{ routePoint.outlet.partner.shortName }}
        .label {{ routePoint.outlet.address }}

</template>
<script>

import ShipmentRoutePoint from '@/models/ShipmentRoutePoint';

export default {

  data() {
    return {
      routePoints: this.bindRoutePoints(),
    };
  },

  watch: {
    shipmentRouteId() {
      this.routePoints = this.bindRoutePoints();
      this.refresh();
    },
  },

  props: {
    shipmentRouteId: String,
    routeName: { type: String, default: 'RoutePointPage' },
    routeParamName: { type: String, default: 'routePointId' },
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
        .then(this.$loading.show().hide);
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

</style>
