<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='routePoint in routePoints' :key="routePoint.id")
    mt-cell(
    :title="routePoint.outlet.partner.shortName"
    :label="routePoint.outlet.address"
    :value="routePoint.ord || '?'"
    :to="{name: routeName, params: routeParams(routePoint)}"
    is-link
    )

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
    routeName: { type: String, default: 'routePoint' },
    routeParamName: { type: String, default: 'id' },
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

}

</script>
<style scoped lang="scss">

</style>
