<template lang="pug">

.route-point-list.cell-list
  .route-point(v-for='(point, index) in routePoints' :key="point.id")
    mt-cell(
    v-bind:title="point.name"
    v-bind:value="index + 1"
    )

</template>
<script>

export default {

  computed: {
    routePoints() {
      return this.route && this.route.routePoints;
    },
  },

  props: ['route'],

};

</script>
<style scoped lang="scss">

</style>
