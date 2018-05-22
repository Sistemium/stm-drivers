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

import sortBy from 'lodash/sortBy';

export default {

  props: {
    shipmentRoute: Object,
    routeName: { type: String, default: 'routePoint' },
    routeParamName: { type: String, default: 'id' },
  },

  computed: {
    routePoints() {
      return this.shipmentRoute && sortBy(this.shipmentRoute.routePoints, 'ord');
    },
  },

  methods: {
    routeParams(routePoint) {
      return { ...this.$route.params, [this.routeParamName]: routePoint.id };
    },
  },

};

</script>
<style scoped lang="scss">

</style>
