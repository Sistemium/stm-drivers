<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='point in routePoints' :key="point.id")
    mt-cell(
    :title="point.name"
    :value="point.ord || '?'"
    )

</template>
<script>

import sortBy from 'lodash/sortBy';

export default {

  computed: {
    routePoints() {
      return this.route && sortBy(this.route.routePoints, 'ord');
    },
  },

  props: ['route'],

};

</script>
<style scoped lang="scss">

</style>
