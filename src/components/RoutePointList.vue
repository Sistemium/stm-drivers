<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='routePoint in routePoints' :key="routePoint.id")
    mt-cell(
    :title="routePoint.outlet.partner.shortName"
    :label="routePoint.outlet.address"
    :value="routePoint.ord || '?'"
    :to="{name: 'routePoint', params: {id: routePoint.id}}"
    is-link
    )

</template>
<script>

import sortBy from 'lodash/sortBy';

export default {

  props: { shipmentRoute: Object },

  computed: {
    routePoints() {
      return this.shipmentRoute && sortBy(this.shipmentRoute.routePoints, 'ord');
    },
  },

};

</script>
<style scoped lang="scss">

</style>
