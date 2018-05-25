<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='routePoint in routePoints' :key="routePoint.id")
    mt-cell(
    :to="{name: routeName, params: routeParams(routePoint)}"
    is-link
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

async function findAll(shipmentRouteId) {

  if (!shipmentRouteId) {
    return Promise.resolve();
  }

  const res = await ShipmentRoutePoint.findAll({ shipmentRouteId }, {
    with: [
      'outlet',
      'outlet.partner',
      'reachedAtLocation',
    ],
  });

  return Promise.all(res.map(routePoint =>
    routePoint.loadRelations([
      'routePointShipments',
      'routePointShipments.shipment',
      // 'routePointShipments.shipment.positions',
    ])));

}

</script>
<style scoped lang="scss">

</style>
