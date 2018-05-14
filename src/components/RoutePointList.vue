<template lang="pug">

.route-point-list
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
<style lang="scss">

.route-point-list {
  .mint-cell {
    height: auto;
  }
  .mint-cell-wrapper {
    padding: 7px 0;
  }
  .mint-cell-title {
    margin-right: 14px;
  }
  .mint-cell-text {
    font-size: 14px;
  }
}

</style>
